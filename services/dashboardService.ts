import { DashboardBundle, DailySummary, RiskSignal, TrendBundle, TrendPoint } from '../types';

type BackendDailySummary = {
  date: string;
  caloriesConsumed: number;
  calorieGoal: number;
  systolic: number;
  diastolic: number;
  weight: number;
  exerciseMinutes: number;
  hydrationLiters: number;
  medicationAdherence: number;
  missedDoses: number;
  steps: number;
};

type BackendTrendPoint = {
  date: string;
  systolic: number;
  diastolic: number;
  weight: number;
  calories: number;
};

type BackendTrendBundle = {
  sevenDay: BackendTrendPoint[];
  thirtyDay: BackendTrendPoint[];
};

type BackendDashboardBundle = {
  summary: BackendDailySummary;
  trend: BackendTrendBundle;
  notes?: string[];
};

const mapSummary = (summary: BackendDailySummary): DailySummary => ({
  date: summary.date,
  caloriesConsumed: summary.caloriesConsumed,
  calorieGoal: summary.calorieGoal,
  protein: 0,
  carbs: 0,
  fats: 0,
  systolic: summary.systolic,
  diastolic: summary.diastolic,
  weight: summary.weight,
  exerciseMinutes: summary.exerciseMinutes,
  hydrationLiters: summary.hydrationLiters,
  medicationAdherence: summary.medicationAdherence,
  missedDoses: summary.missedDoses,
  steps: summary.steps,
  sleepHours: 0,
});

const mapTrend = (trend: BackendTrendBundle): TrendBundle => ({
  sevenDay: trend.sevenDay,
  thirtyDay: trend.thirtyDay,
});

const buildBundleFromBackend = (payload: BackendDashboardBundle): DashboardBundle => ({
  summary: mapSummary(payload.summary),
  trend: mapTrend(payload.trend),
  notes:
    payload.notes ?? [
      '백엔드 번들 API에서 집계된 데이터를 불러왔습니다.',
      '혈압/체중 변화, 칼로리 초과, 복약 누락을 기반으로 리스크를 계산합니다.',
    ],
});

const today = new Date();

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

const generateTrend = (days: number, base: { systolic: number; diastolic: number; weight: number; calories: number }): TrendPoint[] => {
  const points: TrendPoint[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const pointDate = new Date(today);
    pointDate.setDate(today.getDate() - i);
    const modifier = Math.sin(i / 2) * 2 + (i % 3 === 0 ? 3 : 0);
    points.push({
      date: formatDate(pointDate),
      systolic: Math.round(base.systolic + modifier),
      diastolic: Math.round(base.diastolic + modifier / 2),
      weight: parseFloat((base.weight + modifier * 0.1 - 0.8).toFixed(1)),
      calories: Math.round(base.calories + modifier * 20),
    });
  }
  return points;
};

const summary: DailySummary = {
  date: formatDate(today),
  caloriesConsumed: 1920,
  calorieGoal: 2000,
  protein: 110,
  carbs: 230,
  fats: 60,
  systolic: 138,
  diastolic: 86,
  weight: 68.4,
  exerciseMinutes: 45,
  hydrationLiters: 2.1,
  medicationAdherence: 0.92,
  missedDoses: 1,
  steps: 8400,
  sleepHours: 7.3,
};

const trend: TrendBundle = {
  sevenDay: generateTrend(7, { systolic: 134, diastolic: 82, weight: 68.5, calories: 1880 }),
  thirtyDay: generateTrend(30, { systolic: 133, diastolic: 81, weight: 68.9, calories: 1820 }),
};

const mockBundle: DashboardBundle = {
  summary,
  trend,
  notes: [
    '캐시된 번들 응답으로 프런트의 초기 로딩을 단축합니다.',
    '칼로리 초과, 복약 누락, 혈압 급상승을 리스크로 집계합니다.',
  ],
};

const dashboardEndpoint = `${import.meta.env.VITE_BACKEND_URL ?? ''}/api/dashboard`;

export const fetchDashboardBundle = async (): Promise<DashboardBundle> => {
  try {
    const response = await fetch(dashboardEndpoint, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`백엔드 요청 실패: ${response.status}`);
    }

    const payload = (await response.json()) as BackendDashboardBundle;
    return buildBundleFromBackend(payload);
  } catch (error) {
    console.warn('백엔드 번들을 불러올 수 없어 mock 데이터를 사용합니다.', error);
    return mockBundle;
  }
};

const lastValue = (points: TrendPoint[]): TrendPoint | undefined => points[points.length - 1];
const previousValue = (points: TrendPoint[]): TrendPoint | undefined => points[points.length - 2];

export const evaluateRiskSignals = (bundle: DashboardBundle): RiskSignal[] => {
  const signals: RiskSignal[] = [];
  const { summary: daily, trend: trendBundle } = bundle;

  const latestBp = lastValue(trendBundle.sevenDay);
  const priorBp = previousValue(trendBundle.sevenDay);
  const bpDelta = latestBp && priorBp ? latestBp.systolic - priorBp.systolic : 0;
  if (latestBp && (latestBp.systolic >= 140 || bpDelta >= 10)) {
    signals.push({
      id: 'bp-surge',
      label: '혈압 급상승',
      severity: latestBp.systolic >= 150 ? 'high' : 'medium',
      description: `최근 혈압 ${latestBp.systolic}/${latestBp.diastolic} mmHg, 하루 대비 ${bpDelta}포인트 상승`,
      action: '휴식 후 재측정, 필요 시 의료진에 알림',
    });
  }

  const weightLatest = lastValue(trendBundle.sevenDay);
  const weightPrevious = previousValue(trendBundle.sevenDay);
  const weightDelta = weightLatest && weightPrevious ? weightLatest.weight - weightPrevious.weight : 0;
  if (Math.abs(weightDelta) >= 1.5) {
    signals.push({
      id: 'weight-shift',
      label: '체중 급변',
      severity: 'medium',
      description: `하루 만에 체중이 ${weightDelta > 0 ? '+' : ''}${weightDelta.toFixed(1)}kg 변했습니다.`,
      action: '염분·수분 섭취 확인 및 2회차 측정 권장',
    });
  }

  if (daily.caloriesConsumed > daily.calorieGoal) {
    signals.push({
      id: 'calorie-over',
      label: '칼로리 목표 초과',
      severity: daily.caloriesConsumed - daily.calorieGoal > 150 ? 'medium' : 'low',
      description: `오늘 섭취량이 목표보다 ${daily.caloriesConsumed - daily.calorieGoal} kcal 높습니다.`,
      action: '저녁 식단 조정 또는 추가 활동량 확보',
    });
  }

  if (daily.medicationAdherence < 0.9 || daily.missedDoses > 0) {
    signals.push({
      id: 'medication-miss',
      label: '복약 누락 감지',
      severity: daily.missedDoses > 1 ? 'high' : 'medium',
      description: `복약 준수율 ${Math.round(daily.medicationAdherence * 100)}%, 누락 ${daily.missedDoses}회`,
      action: '리마인더 확인 및 다음 복약 알림 강화',
    });
  }

  if (daily.hydrationLiters < 1.5) {
    signals.push({
      id: 'hydration-low',
      label: '수분 부족',
      severity: 'low',
      description: `하루 수분 섭취가 ${daily.hydrationLiters.toFixed(1)}L로 낮습니다.`,
      action: '다음 2시간 내 300~500ml 추가 섭취',
    });
  }

  return signals;
};

export default fetchDashboardBundle;

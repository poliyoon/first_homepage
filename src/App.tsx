import React, { useEffect, useMemo, useState } from 'react';
import { DashboardBundle, RiskSignal, TrendPoint } from '../types';
import { fetchDashboardBundle, evaluateRiskSignals } from '../services/dashboardService';
import RiskBadge from '../components/dashboard/RiskBadge';
import StatCard from '../components/dashboard/StatCard';
import TrendCard from '../components/dashboard/TrendCard';

const App: React.FC = () => {
  const [bundle, setBundle] = useState<DashboardBundle | null>(null);
  const [riskSignals, setRiskSignals] = useState<RiskSignal[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [largeText, setLargeText] = useState(false);

  useEffect(() => {
    fetchDashboardBundle().then((data) => {
      setBundle(data);
      setRiskSignals(evaluateRiskSignals(data));
    });
  }, []);

  const wrapperClass = useMemo(
    () =>
      `${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-stone-50 text-stone-900'} ${
        largeText ? 'text-lg' : 'text-base'
      } min-h-screen transition-colors duration-300` as const,
    [darkMode, largeText]
  );

  const cardTone = darkMode ? 'bg-slate-800 text-slate-100 border-slate-700' : 'bg-white text-slate-900 border-slate-200';
  const subduedText = darkMode ? 'text-slate-300' : 'text-slate-600';

  const renderEmptyState = () => (
    <div className="max-w-6xl mx-auto px-4 py-20 text-center">
      <p className="text-xl font-semibold">데이터를 불러오는 중입니다...</p>
      <p className={`mt-2 ${subduedText}`}>대시보드 번들에서 최신 요약과 추세를 가져오고 있습니다.</p>
    </div>
  );

  const renderRiskSignals = () => (
    <section className="mt-8" aria-labelledby="risk-section">
      <div className="flex items-center justify-between mb-3">
        <h2 id="risk-section" className="text-xl font-bold flex items-center gap-2">
          리스크 신호
        </h2>
        <span className={`text-sm ${subduedText}`}>혈압·체중 급변, 칼로리 초과, 복약 누락을 즉시 표기</span>
      </div>
      {riskSignals.length === 0 ? (
        <div className={`rounded-xl border ${cardTone} p-4 ${subduedText}`}>현재 감지된 리스크가 없습니다.</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {riskSignals.map((signal) => (
            <RiskBadge key={signal.id} signal={signal} darkMode={darkMode} />
          ))}
        </div>
      )}
    </section>
  );

  const renderAccessibilityControls = () => (
    <section className={`mt-8 rounded-2xl border p-5 ${cardTone}`}
      aria-labelledby="accessibility-options">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 id="accessibility-options" className="text-lg font-semibold">
            접근성 & 보기 옵션
          </h3>
          <div className="flex gap-2">
            <button
              className={`px-3 py-2 rounded-lg border ${
                darkMode ? 'bg-amber-500 text-slate-900' : 'bg-slate-900 text-white'
              }`}
              onClick={() => setDarkMode((prev) => !prev)}
              aria-pressed={darkMode}
              aria-label="다크 모드 토글"
            >
              다크 모드
            </button>
            <button
              className={`px-3 py-2 rounded-lg border ${
                largeText ? 'bg-emerald-500 text-slate-900' : 'bg-slate-200 text-slate-900'
              }`}
              onClick={() => setLargeText((prev) => !prev)}
              aria-pressed={largeText}
              aria-label="큰 글꼴 토글"
            >
              큰 글꼴
            </button>
          </div>
        </div>
        <p className={subduedText}>
          색상 대비 강화, 다크 모드, 큰 글꼴 모드를 제공하여 시인성과 접근성을 높였습니다.
        </p>
      </div>
    </section>
  );

  const renderTrendCard = (title: string, points: TrendPoint[], description: string) => (
    <TrendCard
      key={title}
      title={title}
      points={points}
      description={description}
      darkMode={darkMode}
    />
  );

  if (!bundle) {
    return <div className={wrapperClass}>{renderEmptyState()}</div>;
  }

  const { summary, trend } = bundle;

  const caloriesDelta = summary.calorieGoal - summary.caloriesConsumed;
  const calorieStatus = caloriesDelta >= 0 ? '목표 이내' : '초과';
  const bpLabel = `${summary.systolic}/${summary.diastolic} mmHg`;
  const weightTrend = trend.sevenDay.length > 1
    ? summary.weight - trend.sevenDay[1].weight
    : 0;

  return (
    <div className={wrapperClass}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className={`text-sm uppercase tracking-wide ${subduedText}`}>건강 대시보드</p>
            <h1 className="text-3xl font-bold">일일 요약 & 추세 번들</h1>
            <p className={subduedText}>섭취 칼로리, 혈압·체중, 운동, 복약 준수율을 한 화면에서 모니터링합니다.</p>
          </div>
          <div className="flex gap-2" aria-label="보기 토글">
            <button
              className={`px-3 py-2 rounded-lg border ${
                darkMode ? 'bg-amber-500 text-slate-900' : 'bg-slate-900 text-white'
              }`}
              onClick={() => setDarkMode((prev) => !prev)}
              aria-pressed={darkMode}
            >
              다크 모드
            </button>
            <button
              className={`px-3 py-2 rounded-lg border ${
                largeText ? 'bg-emerald-500 text-slate-900' : 'bg-slate-200 text-slate-900'
              }`}
              onClick={() => setLargeText((prev) => !prev)}
              aria-pressed={largeText}
            >
              큰 글꼴
            </button>
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="섭취 칼로리"
            value={`${summary.caloriesConsumed.toLocaleString()} kcal`}
            helper={`${calorieStatus} · 목표 ${summary.calorieGoal.toLocaleString()} kcal`}
            accentColor="bg-emerald-500"
            darkMode={darkMode}
          />
          <StatCard
            title="혈압 / 체중"
            value={`${bpLabel} / ${summary.weight.toFixed(1)} kg`}
            helper={`최근 체중 변화 ${weightTrend >= 0 ? '+' : ''}${weightTrend.toFixed(1)} kg (7일)`}
            accentColor="bg-sky-500"
            darkMode={darkMode}
          />
          <StatCard
            title="운동 & 활동"
            value={`${summary.exerciseMinutes}분 · ${summary.steps.toLocaleString()}보`}
            helper={`수면 ${summary.sleepHours.toFixed(1)}시간 · 수분 ${summary.hydrationLiters.toFixed(1)}L`}
            accentColor="bg-indigo-500"
            darkMode={darkMode}
          />
          <StatCard
            title="복약 준수율"
            value={`${Math.round(summary.medicationAdherence * 100)}%`}
            helper={`누락 ${summary.missedDoses}회 · 처방 메모 연동`}
            accentColor="bg-amber-500"
            darkMode={darkMode}
          />
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          <TrendCard
            title="7일 혈압 추세"
            points={trend.sevenDay}
            description="급격한 상승·하락을 탐지하고 하이라이트합니다."
            darkMode={darkMode}
          />
          <TrendCard
            title="7일 체중 추세"
            valueKey="weight"
            points={trend.sevenDay}
            description="체중 변동을 직관적 막대로 표시합니다."
            darkMode={darkMode}
          />
          <TrendCard
            title="30일 칼로리 흐름"
            points={trend.thirtyDay}
            description="월간 섭취량 추세로 과다 섭취를 조기에 포착합니다."
            darkMode={darkMode}
            valueKey="calories"
          />
        </section>

        {renderRiskSignals()}
        {renderAccessibilityControls()}
      </div>
    </div>
  );
};

export default App;

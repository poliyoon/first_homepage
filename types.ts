export interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  imageUrl: string;
}

export interface DailySummary {
  date: string;
  caloriesConsumed: number;
  calorieGoal: number;
  protein: number;
  carbs: number;
  fats: number;
  systolic: number;
  diastolic: number;
  weight: number;
  exerciseMinutes: number;
  hydrationLiters: number;
  medicationAdherence: number;
  missedDoses: number;
  steps: number;
  sleepHours: number;
}

export interface TrendPoint {
  date: string;
  systolic: number;
  diastolic: number;
  weight: number;
  calories: number;
}

export interface TrendBundle {
  sevenDay: TrendPoint[];
  thirtyDay: TrendPoint[];
}

export interface DashboardBundle {
  summary: DailySummary;
  trend: TrendBundle;
  notes?: string[];
}

export interface RiskSignal {
  id: string;
  label: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  action: string;
}

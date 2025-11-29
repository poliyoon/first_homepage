import React from 'react';
import { TrendPoint } from '../../types';

interface TrendCardProps {
  title: string;
  points: TrendPoint[];
  description: string;
  darkMode: boolean;
  valueKey?: 'bloodPressure' | 'weight' | 'calories';
}

const TrendCard: React.FC<TrendCardProps> = ({ title, points, description, darkMode, valueKey = 'bloodPressure' }) => {
  const getValue = (point: TrendPoint) => {
    if (valueKey === 'weight') return point.weight;
    if (valueKey === 'calories') return point.calories;
    return point.systolic;
  };

  const maxValue = Math.max(...points.map((point) => getValue(point)));
  const borderColor = darkMode ? 'border-slate-700' : 'border-slate-200';
  const textMuted = darkMode ? 'text-slate-300' : 'text-slate-600';
  const barBackground = darkMode ? 'bg-slate-700' : 'bg-slate-100';
  const barFill = darkMode ? 'bg-emerald-400' : 'bg-emerald-600';

  return (
    <article className={`rounded-2xl border ${borderColor} p-4 ${darkMode ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-900'}`}>
      <header className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className={`text-sm ${textMuted}`}>{points.length} 포인트</span>
      </header>
      <p className={`text-sm mb-4 ${textMuted}`}>{description}</p>
      <div className="space-y-2" aria-label={`${title} 값 목록`}>
        {points.map((point) => {
          const value = getValue(point);
          const widthPercent = Math.max(10, Math.round((value / maxValue) * 100));
          return (
            <div key={point.date} className="flex items-center gap-3">
              <span className="min-w-[72px] text-sm font-medium" aria-label={`${point.date} 라벨`}>
                {point.date.slice(5)}
              </span>
              <div className={`flex-1 h-3 rounded-full ${barBackground}`} aria-hidden>
                <div
                  className={`h-3 rounded-full ${barFill}`}
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
              <span className={`text-sm ${textMuted}`}>
                {valueKey === 'bloodPressure'
                  ? `${point.systolic}/${point.diastolic} mmHg`
                  : valueKey === 'weight'
                    ? `${point.weight.toFixed(1)} kg`
                    : `${point.calories} kcal`}
              </span>
            </div>
          );
        })}
      </div>
    </article>
  );
};

export default TrendCard;

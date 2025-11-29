import React from 'react';
import { RiskSignal } from '../../types';

interface RiskBadgeProps {
  signal: RiskSignal;
  darkMode: boolean;
}

const severityTone: Record<RiskSignal['severity'], string> = {
  low: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  medium: 'bg-amber-100 text-amber-800 border-amber-300',
  high: 'bg-rose-100 text-rose-800 border-rose-300',
};

const severityToneDark: Record<RiskSignal['severity'], string> = {
  low: 'bg-emerald-900/40 text-emerald-100 border-emerald-700',
  medium: 'bg-amber-900/40 text-amber-100 border-amber-700',
  high: 'bg-rose-900/40 text-rose-100 border-rose-700',
};

const RiskBadge: React.FC<RiskBadgeProps> = ({ signal, darkMode }) => {
  const tone = darkMode ? severityToneDark[signal.severity] : severityTone[signal.severity];

  return (
    <article className={`rounded-2xl border p-4 ${tone}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{signal.label}</h3>
        <span className="text-xs font-bold uppercase tracking-wide">{signal.severity}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed">{signal.description}</p>
      <p className="mt-1 text-xs underline underline-offset-4">{signal.action}</p>
    </article>
  );
};

export default RiskBadge;

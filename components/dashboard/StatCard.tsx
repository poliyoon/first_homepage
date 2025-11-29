import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  helper: string;
  accentColor: string;
  darkMode: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, helper, accentColor, darkMode }) => {
  const cardBorder = darkMode ? 'border-slate-700' : 'border-slate-200';
  const textMuted = darkMode ? 'text-slate-300' : 'text-slate-600';

  return (
    <article
      className={`rounded-2xl border ${cardBorder} p-4 shadow-sm ${darkMode ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-900'}`}
      aria-label={title}
    >
      <div className="flex items-center justify-between">
        <p className={textMuted}>{title}</p>
        <span className={`w-3 h-3 rounded-full ${accentColor}`} aria-hidden />
      </div>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      <p className={`mt-1 text-sm ${textMuted}`}>{helper}</p>
    </article>
  );
};

export default StatCard;

import React from 'react';

const circumference = 2 * Math.PI * 18; // r = 18

const OverProgressRing: React.FC<{ ballsBowled: number }>=({ ballsBowled })=>{
  const clamped = Math.min(6, Math.max(0, ballsBowled || 0));
  const progress = clamped / 6;
  const dash = circumference * progress;
  const remaining = circumference - dash;
  return (
    <div className="flex items-center gap-2" title={`Balls this over: ${clamped}/6`}>
      <svg width="48" height="48" viewBox="0 0 48 48" className="drop-shadow-sm">
        <circle cx="24" cy="24" r="18" stroke="#e5e7eb" strokeWidth="6" fill="none" />
        <circle
          cx="24" cy="24" r="18" stroke="#10b981" strokeWidth="6" fill="none"
          strokeDasharray={`${dash} ${remaining}`}
          strokeLinecap="round"
          transform="rotate(-90 24 24)"
        />
        <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle" fontSize="12" fill="#111827" className="font-bold">
          {clamped}/6
        </text>
      </svg>
      <span className="text-sm text-gray-700 dark:text-gray-300">Over progress</span>
    </div>
  );
};

export default OverProgressRing;
"use client";

import { useProgress } from "./Providers";

export function ProgressRing({ moduleId, total, color, size = 44 }: { moduleId: string; total: number; color: string; size?: number }) {
  const { moduleProgress } = useProgress();
  const p = moduleProgress(moduleId, total);
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }} title={`${Math.round(p * 100)}% of lab steps done`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#ede9fe" strokeWidth="5" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - p)} className="transition-all duration-500" />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-[10px] font-bold text-slate-700">{Math.round(p * 100)}%</span>
    </div>
  );
}

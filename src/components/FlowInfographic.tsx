import { Icon } from "./Icon";
import type { FlowStep } from "@/lib/types";

const PALETTE = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#0ea5e9", "#6366f1"];

export function FlowInfographic({ title, steps }: { title: string; steps: FlowStep[] }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">{title}</h4>
      <ol className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-0">
        {steps.map((s, i) => {
          const c = PALETTE[i % PALETTE.length];
          return (
            <li key={s.label} className="relative flex flex-1 items-center gap-3 sm:flex-col sm:gap-2 sm:text-center">
              {i < steps.length - 1 && (
                <div className="absolute left-[calc(50%+30px)] right-[calc(-50%+30px)] top-6 hidden h-1 rounded-full sm:block" style={{ background: `linear-gradient(90deg, ${c}, ${PALETTE[(i + 1) % PALETTE.length]})` }} />
              )}
              <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow-md" style={{ background: `linear-gradient(135deg, ${c}, ${c}cc)` }}>
                <Icon name={s.icon} className="h-6 w-6" />
                <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-white text-[10px] font-extrabold shadow" style={{ color: c }}>{i + 1}</span>
              </div>
              <div className="sm:px-1">
                <div className="text-sm font-bold text-slate-800">{s.label}</div>
                <div className="text-xs leading-snug text-slate-500">{s.desc}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

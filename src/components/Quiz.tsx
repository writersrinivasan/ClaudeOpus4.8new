"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import type { QuizQ } from "@/lib/types";

export function Quiz({ items, accent }: { items: QuizQ[]; accent: string }) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const answered = Object.keys(picked).length;
  const score = items.filter((q, i) => picked[i] === q.answer).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl px-4 py-3 text-white" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}aa)` }}>
        <span className="font-bold">Knowledge check</span>
        <span className="text-sm font-semibold">{answered === items.length ? `Score ${score}/${items.length} ${score === items.length ? "🏆" : "✨"}` : `${answered}/${items.length} answered`}</span>
      </div>
      {items.map((q, i) => (
        <div key={q.q} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="mb-3 font-semibold text-slate-800">{i + 1}. {q.q}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {q.options.map((o, j) => {
              const chosen = picked[i] === j;
              const reveal = picked[i] !== undefined;
              const correct = j === q.answer;
              return (
                <button
                  key={o}
                  disabled={reveal}
                  onClick={() => setPicked((p) => ({ ...p, [i]: j }))}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition ${
                    reveal && correct ? "border-emerald-300 bg-emerald-50 text-emerald-800" :
                    reveal && chosen ? "border-rose-300 bg-rose-50 text-rose-800" :
                    "border-slate-200 hover:border-violet-300 hover:bg-violet-50"
                  }`}
                >
                  {reveal && correct ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : reveal && chosen ? <XCircle className="h-4 w-4 shrink-0" /> : <span className="grid h-4 w-4 shrink-0 place-items-center text-[10px] font-bold text-slate-400">{String.fromCharCode(65 + j)}</span>}
                  {o}
                </button>
              );
            })}
          </div>
          {picked[i] !== undefined && <p className="mt-2 text-xs text-slate-500">💡 {q.why}</p>}
        </div>
      ))}
      {answered > 0 && (
        <button onClick={() => setPicked({})} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800">
          <RotateCcw className="h-4 w-4" /> Reset quiz
        </button>
      )}
    </div>
  );
}

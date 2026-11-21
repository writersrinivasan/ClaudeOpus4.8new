"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Bot } from "lucide-react";
import { ALL_USE_CASES } from "@/lib/content";
import { Icon } from "@/components/Icon";

export default function UseCasesPage() {
  const industries = useMemo(() => ["All", ...Array.from(new Set(ALL_USE_CASES.map((u) => u.industry))).sort()], []);
  const [f, setF] = useState("All");
  const list = f === "All" ? ALL_USE_CASES : ALL_USE_CASES.filter((u) => u.industry === f);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8">
      <section className="rounded-[2rem] bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 p-8 text-white shadow-xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Industry use cases</h1>
        <p className="mt-2 max-w-2xl text-white/90">{ALL_USE_CASES.length} enterprise scenarios mapped to the workshop modules. Each card shows the problem, how Opus 4.8 solves it and the business impact.</p>
        <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold">
          <span className="rounded-full bg-white/15 px-3 py-1">{industries.length - 1} industries</span>
          <span className="rounded-full bg-white/15 px-3 py-1">8 modules</span>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        {industries.map((i) => (
          <button key={i} onClick={() => setF(i)} className={`rounded-full px-3.5 py-1.5 text-sm font-bold transition ${f === i ? "bg-violet-600 text-white shadow" : "bg-white text-slate-600 hover:bg-violet-50"}`}>
            {i}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((u) => (
          <article key={u.title} className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center gap-3 p-5 pb-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl text-white shadow" style={{ background: u.accent }}><Icon name={u.icon} className="h-6 w-6" /></span>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider" style={{ color: u.accent }}>{u.industry}</div>
                <h3 className="font-extrabold leading-snug text-slate-900">{u.title}</h3>
              </div>
            </div>
            <div className="flex-1 space-y-2 px-5 text-sm">
              <p><b className="text-rose-500">Problem · </b><span className="text-slate-600">{u.problem}</span></p>
              <p><b className="text-sky-600">Solution · </b><span className="text-slate-600">{u.solution}</span></p>
            </div>
            <div className="m-5 mb-3 rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">📈 {u.impact}</div>
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs font-bold">
              <Link href={`/modules/${u.moduleId}`} style={{ color: u.accent }}>Learn in {u.moduleTitle} →</Link>
              <Link href={`/assistant?q=${encodeURIComponent(`Design a solution for: ${u.industry} — ${u.title}. ${u.problem}`)}`} className="flex items-center gap-1 text-slate-500 hover:text-violet-600">
                <Bot className="h-3.5 w-3.5" /> Deep-dive with AI
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

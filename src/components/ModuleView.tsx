"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Bot, CheckCircle2, Circle, Code, Factory, FlaskConical, Target, Trophy } from "lucide-react";
import type { Module } from "@/lib/types";
import { Icon } from "./Icon";
import { CodeBlock } from "./CodeBlock";
import { FlowInfographic } from "./FlowInfographic";
import { Quiz } from "./Quiz";
import { useProgress } from "./Providers";
import { ProgressRing } from "./ProgressRing";

type Tab = "lab" | "code" | "cases" | "quiz";
const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "lab", label: "Hands-on Lab", icon: FlaskConical },
  { id: "code", label: "Code", icon: Code },
  { id: "cases", label: "Use Cases", icon: Factory },
  { id: "quiz", label: "Quiz", icon: Trophy },
];

export function ModuleView({ m, prev, next, all }: { m: Module; prev?: Module; next?: Module; all: Pick<Module, "id" | "num" | "short" | "accent" | "icon">[] }) {
  const [side, setSide] = useState<"learn" | "practice">("learn");
  const [tab, setTab] = useState<Tab>("lab");
  const { done, toggle } = useProgress();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6">
      {/* module stepper */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {all.map((x) => (
          <Link
            key={x.id}
            href={`/modules/${x.id}`}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${x.id === m.id ? "text-white shadow-md" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}
            style={x.id === m.id ? { background: x.accent, borderColor: x.accent } : undefined}
          >
            <Icon name={x.icon} className="h-3.5 w-3.5" /> M{x.num} · {x.short}
          </Link>
        ))}
      </div>

      {/* hero */}
      <section className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${m.gradient} p-7 text-white shadow-xl sm:p-9`}>
        <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-white/10" />
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/80">
              <Icon name={m.icon} className="h-4 w-4" /> Module {m.num} · {m.minutes} minutes
            </div>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">{m.title}</h1>
            <p className="mt-3 text-lg text-white/90">{m.tagline}</p>
          </div>
          <div className="rounded-2xl bg-white/95 p-2"><ProgressRing moduleId={m.id} total={m.handsOn.steps.length} color={m.accent} size={64} /></div>
        </div>
        {m.stats && (
          <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {m.stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/15 p-3 backdrop-blur">
                <div className="text-2xl font-extrabold">{s.value}</div>
                <div className="text-xs font-semibold text-white/90">{s.label}</div>
                {s.hint && <div className="text-[11px] text-white/70">{s.hint}</div>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* objectives */}
      <section className="mt-5 flex flex-wrap gap-2">
        {m.objectives.map((o) => (
          <span key={o} className={`flex items-center gap-2 rounded-full border ${m.ring} bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700`}>
            <Target className="h-4 w-4" style={{ color: m.accent }} /> {o}
          </span>
        ))}
      </section>

      {/* mobile side toggle */}
      <div className="mt-6 grid grid-cols-2 rounded-2xl bg-white p-1 shadow-sm lg:hidden">
        {(["learn", "practice"] as const).map((s) => (
          <button key={s} onClick={() => setSide(s)} className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold ${side === s ? "text-white" : "text-slate-500"}`} style={side === s ? { background: m.accent } : undefined}>
            {s === "learn" ? <BookOpen className="h-4 w-4" /> : <FlaskConical className="h-4 w-4" />}
            {s === "learn" ? "Learn" : "Practice"}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* LEARN */}
        <section className={`${side === "learn" ? "block" : "hidden"} space-y-5 lg:block`}>
          <SideHeader icon={BookOpen} title="Learn" sub="Concepts, visuals and key ideas" color={m.accent} />
          <FlowInfographic title={m.flow.title} steps={m.flow.steps} />
          <div className="grid gap-4 sm:grid-cols-2">
            {m.concepts.map((c, i) => (
              <article key={c.title} className={`rounded-3xl border ${m.ring} bg-white p-5 shadow-sm transition hover:shadow-md ${i === 0 && m.concepts.length % 2 === 1 ? "sm:col-span-2" : ""}`}>
                <div className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ${m.soft}`}>
                  <Icon name={c.icon} className="h-5 w-5" style={{ color: m.accent }} />
                </div>
                <h3 className="font-extrabold text-slate-900">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{c.body}</p>
                {c.points && (
                  <ul className="mt-3 space-y-1">
                    {c.points.map((p) => (
                      <li key={p} className="flex gap-2 text-sm text-slate-700"><span style={{ color: m.accent }}>▸</span>{p}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
          <div className={`rounded-3xl ${m.soft} border ${m.ring} p-5`}>
            <h4 className={`mb-3 font-extrabold ${m.text}`}>🔑 Key takeaways</h4>
            <ul className="space-y-2">
              {m.takeaways.map((t) => (
                <li key={t} className="flex gap-2 text-sm font-medium text-slate-800"><CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: m.accent }} />{t}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* PRACTICE */}
        <section className={`${side === "practice" ? "block" : "hidden"} space-y-5 lg:block`}>
          <SideHeader icon={FlaskConical} title="Practice" sub="Labs, code, industry cases, quiz" color="#ec4899" />
          <div className="flex gap-1 overflow-x-auto rounded-2xl bg-white p-1 shadow-sm">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex flex-1 shrink-0 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold transition ${tab === t.id ? "text-white shadow" : "text-slate-500 hover:bg-slate-50"}`} style={tab === t.id ? { background: m.accent } : undefined}>
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </div>

          {tab === "lab" && (
            <div className="space-y-4">
              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-pink-600">Hands-on activity</div>
                <h3 className="mt-1 text-xl font-extrabold text-slate-900">{m.handsOn.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{m.handsOn.goal}</p>
              </div>
              <ol className="relative space-y-3 before:absolute before:bottom-4 before:left-[19px] before:top-4 before:w-0.5 before:bg-slate-200">
                {m.handsOn.steps.map((s, i) => {
                  const key = `${m.id}:${i}`;
                  const isDone = !!done[key];
                  return (
                    <li key={s.title} className="relative flex gap-3">
                      <button onClick={() => toggle(key)} className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-4 border-white text-sm font-extrabold text-white shadow" style={{ background: isDone ? "#10b981" : m.accent }} aria-label={isDone ? "Mark step not done" : "Mark step done"}>
                        {isDone ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                      </button>
                      <div className={`flex-1 rounded-2xl border bg-white p-4 shadow-sm transition ${isDone ? "border-emerald-200 opacity-80" : "border-slate-100"}`}>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`font-bold ${isDone ? "text-emerald-700 line-through decoration-2" : "text-slate-900"}`}>{s.title}</h4>
                          <button onClick={() => toggle(key)} className="text-slate-300 hover:text-emerald-500" aria-hidden tabIndex={-1}>
                            {isDone ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5" />}
                          </button>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{s.detail}</p>
                        {s.code && <div className="mt-3"><CodeBlock sample={s.code} accent={m.accent} /></div>}
                      </div>
                    </li>
                  );
                })}
              </ol>
              <div className="rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">
                <b>🎯 Expected output:</b> {m.handsOn.expected}
              </div>
            </div>
          )}

          {tab === "code" && <div className="space-y-4">{m.code.map((c) => <CodeBlock key={c.title} sample={c} accent={m.accent} />)}</div>}

          {tab === "cases" && (
            <div className="space-y-4">
              {m.useCases.map((u) => (
                <article key={u.title} className="overflow-hidden rounded-3xl bg-white shadow-sm">
                  <div className="flex items-center gap-3 px-5 py-3 text-white" style={{ background: `linear-gradient(90deg, ${m.accent}, ${m.accent}b0)` }}>
                    <Icon name={u.icon} className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">{u.industry}</span>
                    <span className="ml-auto font-bold">{u.title}</span>
                  </div>
                  <div className="grid gap-3 p-5 sm:grid-cols-3">
                    <Cell label="Problem" text={u.problem} color="#f43f5e" />
                    <Cell label="Solution" text={u.solution} color="#0ea5e9" />
                    <Cell label="Impact" text={u.impact} color="#10b981" />
                  </div>
                </article>
              ))}
              <Link href="/use-cases" className="block text-center text-sm font-bold" style={{ color: m.accent }}>Explore all industry use cases →</Link>
            </div>
          )}

          {tab === "quiz" && <Quiz items={m.quiz} accent={m.accent} />}

          <Link
            href={`/assistant?module=${m.id}`}
            className="flex items-center gap-3 rounded-3xl bg-slate-900 p-4 text-white shadow-lg transition hover:scale-[1.01]"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-orange-400"><Bot className="h-5 w-5" /></span>
            <span className="flex-1">
              <span className="block font-bold">Stuck? Ask the AI Coach about Module {m.num}</span>
              <span className="text-xs text-slate-400">LangGraph agent · tutor, lab coach, engineer, consultant & quiz personas</span>
            </span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </section>
      </div>

      {/* prev/next */}
      <div className="mt-10 flex justify-between gap-4">
        {prev ? (
          <Link href={`/modules/${prev.id}`} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:border-slate-300"><ArrowLeft className="h-4 w-4" /> M{prev.num} · {prev.short}</Link>
        ) : <span />}
        {next ? (
          <Link href={`/modules/${next.id}`} className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-md" style={{ background: next.accent }}>M{next.num} · {next.short} <ArrowRight className="h-4 w-4" /></Link>
        ) : (
          <Link href="/project" className="flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-md">Capstone project <ArrowRight className="h-4 w-4" /></Link>
        )}
      </div>
    </div>
  );
}

function SideHeader({ icon: I, title, sub, color }: { icon: React.ElementType; title: string; sub: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-xl text-white shadow" style={{ background: color }}><I className="h-5 w-5" /></span>
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">{title}</h2>
        <p className="text-xs text-slate-500">{sub}</p>
      </div>
    </div>
  );
}

function Cell({ label, text, color }: { label: string; text: string; color: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="mb-1 text-[11px] font-extrabold uppercase tracking-wider" style={{ color }}>{label}</div>
      <p className="text-sm text-slate-700">{text}</p>
    </div>
  );
}

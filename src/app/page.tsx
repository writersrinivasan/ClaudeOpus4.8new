import Link from "next/link";
import { ArrowRight, BookOpen, Bot, Clock, FlaskConical, KeyRound, Network, Sparkles } from "lucide-react";
import { MODULES, PROJECT, TOTAL_MINUTES, ALL_USE_CASES } from "@/lib/content";
import { Icon } from "@/components/Icon";
import { ProgressRing } from "@/components/ProgressRing";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16">
      {/* HERO */}
      <section className="relative pt-12 pb-10 text-center sm:pt-16">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-violet-700 shadow-sm">
          <Sparkles className="h-3.5 w-3.5" /> Hands-on workshop · {MODULES.length} modules · {TOTAL_MINUTES} minutes
        </span>
        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl">
          Learn it. <span className="text-gradient">Build it.</span> Master Claude Opus 4.8.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          Every module has two sides: a <b className="text-violet-700">Learning</b> side with visual concepts and a <b className="text-pink-600">Practice</b> side with labs, code and industry use cases. An agentic AI coach, built on LangGraph, is there when you get stuck.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/modules/m1" className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-bold text-white shadow-lg shadow-fuchsia-200 transition hover:scale-[1.03]">
            Start Module 1 <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/assistant" className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 font-bold text-slate-800 shadow-sm transition hover:border-violet-300">
            <Bot className="h-4 w-4 text-violet-600" /> Open AI Coach
          </Link>
        </div>
      </section>

      {/* TWO SIDES INFOGRAPHIC */}
      <section className="grid gap-5 md:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 p-6 text-white shadow-xl shadow-violet-200">
          <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/20 p-2.5"><BookOpen className="h-6 w-6" /></div><h2 className="text-2xl font-extrabold">Learning side</h2></div>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {["Concept cards", "Infographic flows", "Key stats", "Takeaways", "Objectives", "Knowledge checks"].map((t) => (
              <li key={t} className="rounded-xl bg-white/15 px-3 py-2 font-semibold">✦ {t}</li>
            ))}
          </ul>
        </div>
        <div className="hidden items-center md:flex">
          <div className="float grid h-20 w-20 place-items-center rounded-full bg-white text-3xl shadow-xl ring-4 ring-fuchsia-100">⇄</div>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-pink-500 to-orange-500 p-6 text-white shadow-xl shadow-pink-200">
          <div className="flex items-center gap-3"><div className="rounded-2xl bg-white/20 p-2.5"><FlaskConical className="h-6 w-6" /></div><h2 className="text-2xl font-extrabold">Practice side</h2></div>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {["Step-by-step labs", "Runnable Python", `${ALL_USE_CASES.length} industry cases`, "Progress tracking", "Capstone project", "AI Coach help"].map((t) => (
              <li key={t} className="rounded-xl bg-white/15 px-3 py-2 font-semibold">✦ {t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* LEARNING PATH */}
      <section className="mt-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">Your learning path</h2>
            <p className="text-slate-500">Each module = learn the concept → do the lab → see it in industry.</p>
          </div>
          <div className="hidden items-center gap-1.5 text-sm font-semibold text-slate-500 sm:flex"><Clock className="h-4 w-4" />{TOTAL_MINUTES} min total</div>
        </div>
        {/* timeline bar */}
        <div className="mb-6 flex h-3 overflow-hidden rounded-full shadow-inner">
          {MODULES.map((m) => (
            <div key={m.id} className={`bg-gradient-to-r ${m.gradient}`} style={{ width: `${(m.minutes / TOTAL_MINUTES) * 100}%` }} title={`M${m.num} · ${m.minutes} min`} />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((m) => (
            <Link key={m.id} href={`/modules/${m.id}`} className="group relative overflow-hidden rounded-3xl border border-white bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${m.gradient}`} />
              <div className="flex items-start justify-between">
                <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${m.gradient} text-white shadow-md`}>
                  <Icon name={m.icon} className="h-6 w-6" />
                </div>
                <ProgressRing moduleId={m.id} total={m.handsOn.steps.length} color={m.accent} size={40} />
              </div>
              <div className="mt-4 text-xs font-bold uppercase tracking-wider" style={{ color: m.accent }}>Module {m.num} · {m.minutes} min</div>
              <h3 className="mt-1 font-extrabold leading-snug text-slate-900">{m.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-slate-500">{m.tagline}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-bold opacity-0 transition group-hover:opacity-100" style={{ color: m.accent }}>
                Open <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AGENTIC COACH TEASER */}
      <section className="mt-14 grid items-center gap-8 rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-fuchsia-300"><Network className="h-3.5 w-3.5" /> Agentic AI · LangGraph</span>
          <h2 className="mt-4 text-3xl font-extrabold">An AI coach you can watch think</h2>
          <p className="mt-3 text-slate-300">
            Each question runs through a LangGraph workflow: a <b>Router</b> classifies intent, a <b>Retriever</b> searches this syllabus, a <b>Tool Agent</b> calls real functions for maths and cost, a <b>Specialist</b> persona answers, and a <b>Reviewer</b> grades the answer and can send it back for revision. Every step lights up live.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/assistant" className="flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-orange-400 px-5 py-2.5 font-bold">
              <Bot className="h-4 w-4" /> Try the coach
            </Link>
            <span className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm text-slate-300"><KeyRound className="h-4 w-4" /> BYOK · your Groq key</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-bold">
          {[
            ["🧭", "Router", "#8b5cf6"], ["📚", "Retriever", "#0ea5e9"], ["🛠️", "Tools", "#f59e0b"], ["🎓", "Specialist", "#f43f5e"], ["🛡️", "Reviewer", "#22c55e"],
          ].map(([e, l, c], i, a) => (
            <div key={l} className="flex items-center gap-2">
              <div className="rounded-2xl px-4 py-3 text-center shadow-lg" style={{ background: c }}>
                <div className="text-2xl">{e}</div>
                <div>{l}</div>
              </div>
              {i < a.length - 1 && <ArrowRight className="h-5 w-5 text-slate-500" />}
            </div>
          ))}
        </div>
      </section>

      {/* PROJECT */}
      <section className="mt-14 rounded-[2rem] border border-orange-100 bg-gradient-to-br from-amber-50 via-white to-pink-50 p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-orange-600">End-to-end capstone</div>
            <h2 className="mt-1 text-3xl font-extrabold text-slate-900">{PROJECT.title}</h2>
          </div>
          <Link href="/project" className="flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 font-bold text-white shadow-md">View the project <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PROJECT.features.map((f, i) => (
            <div key={f.text} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white" style={{ background: MODULES[i % 8].accent }}><Icon name={f.icon} className="h-4 w-4" /></span>
              <span className="text-sm font-semibold text-slate-700">{f.text}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

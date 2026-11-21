import Link from "next/link";
import { ArrowDown, ArrowRight, CheckCircle2 } from "lucide-react";
import { MODULES, PROJECT, getModule } from "@/lib/content";
import { Icon } from "@/components/Icon";

export const metadata = { title: "Capstone Project · Opus 4.8 Lab" };

const ARCH = [
  { label: "User", sub: "Natural-language question + CSV/PDF", icon: "Users", color: "#8b5cf6" },
  { label: "Streamlit UI", sub: "app.py · upload, effort slider", icon: "Monitor", color: "#ec4899" },
  { label: "pandas", sub: "profile, summarise, sample", icon: "Database", color: "#f59e0b" },
  { label: "Claude Opus 4.8", sub: "Messages API · adaptive thinking", icon: "BrainCircuit", color: "#6366f1" },
  { label: "Python tools", sub: "calculate_growth · get_kpi · MCP", icon: "Wrench", color: "#06b6d4" },
  { label: "JSON report", sub: "schema-validated output", icon: "FileJson", color: "#10b981" },
  { label: "Eval harness", sub: "tests · rubric · pass rate", icon: "ClipboardCheck", color: "#22c55e" },
] as const;

export default function ProjectPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8">
      <section className="rounded-[2rem] bg-gradient-to-br from-orange-500 via-pink-500 to-violet-600 p-8 text-white shadow-xl sm:p-10">
        <div className="text-sm font-bold uppercase tracking-wider text-white/80">End-to-end hands-on project</div>
        <h1 className="mt-2 max-w-3xl text-3xl font-extrabold sm:text-5xl">{PROJECT.title}</h1>
        <p className="mt-3 max-w-2xl text-lg text-white/90">You build a working AI assistant that analyses business data, generates insights, calls tools and validates its own output, one module at a time.</p>
      </section>

      {/* architecture infographic */}
      <section className="mt-10">
        <h2 className="text-2xl font-extrabold text-slate-900">System architecture</h2>
        <p className="text-slate-500">How the pieces you build in each module connect.</p>
        <div className="mt-6 flex flex-col items-stretch gap-2 lg:flex-row lg:items-center">
          {ARCH.map((a, i) => (
            <div key={a.label} className="flex flex-col items-center lg:flex-1 lg:flex-row">
              <div className="w-full rounded-2xl bg-white p-4 text-center shadow-md ring-1 ring-slate-100" style={{ borderTop: `4px solid ${a.color}` }}>
                <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl text-white" style={{ background: a.color }}>
                  <Icon name={a.icon} className="h-5 w-5" />
                </div>
                <div className="mt-2 text-sm font-extrabold text-slate-900">{a.label}</div>
                <div className="text-[11px] leading-tight text-slate-500">{a.sub}</div>
              </div>
              {i < ARCH.length - 1 && (
                <>
                  <ArrowDown className="my-1 h-5 w-5 text-slate-300 lg:hidden" />
                  <ArrowRight className="mx-1 hidden h-5 w-5 shrink-0 text-slate-300 lg:block" />
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* features */}
      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Application features</h2>
          <div className="mt-4 grid gap-3">
            {PROJECT.features.map((f, i) => (
              <div key={f.text} className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-sm">
                <span className="grid h-9 w-9 place-items-center rounded-xl text-sm font-extrabold text-white" style={{ background: MODULES[i % 8].accent }}>{i + 1}</span>
                <Icon name={f.icon} className="h-5 w-5 text-slate-400" />
                <span className="font-semibold text-slate-700">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Implementation exercises</h2>
          <ol className="relative mt-4 space-y-3 before:absolute before:bottom-3 before:left-5 before:top-3 before:w-1 before:rounded before:bg-gradient-to-b before:from-violet-400 before:via-pink-400 before:to-emerald-400">
            {PROJECT.exercises.map((e) => {
              const m = getModule(e.module)!;
              return (
                <li key={e.n} className="relative flex gap-4">
                  <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border-4 border-white font-extrabold text-white shadow" style={{ background: m.accent }}>{e.n}</span>
                  <Link href={`/modules/${m.id}`} className="flex-1 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md">
                    <div className="font-bold text-slate-900">{e.impl}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                      <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700"><CheckCircle2 className="h-3 w-3" />{e.out}</span>
                      <span className="font-semibold" style={{ color: m.accent }}>→ Module {m.num}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* stack + prereqs */}
      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="bg-slate-900 px-5 py-3 font-bold text-white">Technical requirements</div>
          <table className="w-full text-sm">
            <tbody>
              {PROJECT.stack.map(([k, v], i) => (
                <tr key={k} className={i % 2 ? "bg-slate-50" : ""}>
                  <td className="px-5 py-2.5 font-semibold text-slate-500">{k}</td>
                  <td className="px-5 py-2.5 font-bold text-slate-800">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="font-extrabold text-slate-900">Prerequisites checklist</h3>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {PROJECT.prerequisites.map((p) => (
              <li key={p} className="flex items-start gap-2 rounded-xl bg-violet-50 px-3 py-2 text-sm font-medium text-violet-900"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />{p}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

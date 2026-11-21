"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, Bot, KeyRound, Loader2, RotateCcw, Send, ShieldCheck, User, Wrench, BookOpen, X } from "lucide-react";
import { useByok } from "./Providers";
import { AgentGraph, type NodeStatus } from "./AgentGraph";
import { Markdown } from "./Markdown";
import { MODULES, getModule } from "@/lib/content";
import { GRAPH_NODES, INTENTS, type AgentEvent, type Intent, type NodeId, type Review, type SourceRef, type ToolTrace } from "@/lib/agent/spec";

type Meta = { intent: Intent; review?: Review; sources: SourceRef[]; toolCalls: ToolTrace[]; revisions: number };
type Msg = { role: "user" | "assistant"; content: string; meta?: Meta; error?: boolean };
type TraceItem = { node: NodeId; data: Record<string, unknown>; t: number };

const DEFAULT_SUGGESTIONS = [
  "Explain adaptive thinking and effort levels like I'm a product manager",
  "Give me a hands-on lab to practise tool use with Python",
  "Estimate cost: 2,000 requests/day, 6K input + 1.5K output tokens each, on Opus 4.8, for 30 days",
  "Write Python that analyses a CSV with Opus 4.8 and returns JSON",
  "How would a bank use Opus 4.8 for credit memos? Include ROI",
  "Quiz me on Module 6",
];

export function AgentChat() {
  const params = useSearchParams();
  const { apiKey, model, setOpen } = useByok();
  const [moduleId, setModuleId] = useState<string | undefined>(params.get("module") ?? undefined);
  const [input, setInput] = useState(params.get("q") ?? "");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Record<string, NodeStatus>>({});
  const [visits, setVisits] = useState<Record<string, number>>({});
  const [traversed, setTraversed] = useState<Set<string>>(new Set());
  const [trace, setTrace] = useState<TraceItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mod = moduleId ? getModule(moduleId) : undefined;

  useEffect(() => {
    const el = scrollRef.current;
    if (el && msgs.length) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  const suggestions = mod
    ? [`Explain the key concepts of Module ${mod.num}: ${mod.short}`, `Walk me through the hands-on lab: ${mod.handsOn.title}`, `Show me Python code for ${mod.short}`, `Industry use cases for ${mod.short}`, `Quiz me on Module ${mod.num}`]
    : DEFAULT_SUGGESTIONS;

  async function ask(q: string) {
    if (!q.trim() || busy) return;
    if (!apiKey) { setOpen(true); return; }
    const history = msgs.filter((m) => !m.error).map(({ role, content }) => ({ role, content }));
    setMsgs((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setBusy(true);
    setStatus({}); setVisits({}); setTraversed(new Set()); setTrace([]);
    let last: NodeId | null = null;
    const t0 = performance.now();

    const handle = (e: AgentEvent) => {
      if (e.type === "node_start") {
        const from = last;
        if (from) setTraversed((s) => new Set(s).add(`${from}->${e.node}`));
        setStatus((s) => ({ ...s, [e.node]: "active" }));
        setVisits((v) => ({ ...v, [e.node]: (v[e.node] ?? 0) + 1 }));
      } else if (e.type === "node_end") {
        last = e.node;
        setStatus((s) => ({ ...s, [e.node]: "done" }));
        if (!e.node.startsWith("__")) setTrace((t) => [...t, { node: e.node, data: e.data, t: Math.round(performance.now() - t0) }]);
      } else if (e.type === "final") {
        setMsgs((m) => [...m, { role: "assistant", content: e.answer, meta: { intent: e.intent, review: e.review, sources: e.sources, toolCalls: e.toolCalls, revisions: e.revisions } }]);
      } else if (e.type === "error") {
        setMsgs((m) => [...m, { role: "assistant", content: e.message, error: true }]);
      }
    };

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-groq-key": apiKey },
        body: JSON.stringify({ question: q, moduleId, model, history }),
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        handle({ type: "error", message: j.error ?? `HTTP ${res.status}` });
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop() ?? "";
        for (const p of parts) {
          const line = p.trim();
          if (line.startsWith("data:")) {
            try { handle(JSON.parse(line.slice(5))); } catch { /* skip malformed chunk */ }
          }
        }
      }
    } catch (err) {
      handle({ type: "error", message: `Network error: ${(err as Error).message}` });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-6">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-violet-600 to-orange-400 text-white shadow-lg"><Bot className="h-6 w-6" /></div>
        <div className="mr-auto">
          <h1 className="text-2xl font-extrabold text-slate-900">AI Coach <span className="text-gradient">· Agentic LangGraph workflow</span></h1>
          <p className="text-sm text-slate-500">Router → Retriever → Tool Agent → Specialist → Reviewer, with a self-correction loop. Model: <b className="font-mono">{model}</b> on Groq.</p>
        </div>
        <select
          value={moduleId ?? ""}
          onChange={(e) => setModuleId(e.target.value || undefined)}
          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
          aria-label="Module context"
        >
          <option value="">All modules</option>
          {MODULES.map((m) => <option key={m.id} value={m.id}>M{m.num} · {m.short}</option>)}
        </select>
        {msgs.length > 0 && (
          <button onClick={() => { setMsgs([]); setTrace([]); setStatus({}); setVisits({}); setTraversed(new Set()); }} className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600">
            <RotateCcw className="h-4 w-4" /> New chat
          </button>
        )}
      </div>

      {!apiKey && (
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-pink-50 p-4">
          <KeyRound className="h-6 w-6 text-orange-500" />
          <div className="flex-1 text-sm text-slate-700"><b>Bring your own key:</b> add a free Groq API key to run the agent. It stays in your browser.</div>
          <button onClick={() => setOpen(true)} className="rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white">Add Groq key</button>
        </div>
      )}

      <div className="mb-6">
        <AgentGraph status={status} visits={visits} traversed={traversed} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
        {/* CHAT */}
        <section className="flex h-[calc(100vh-10rem)] min-h-[520px] flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
          {mod && (
            <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2 text-xs font-semibold" style={{ color: mod.accent }}>
              <BookOpen className="h-3.5 w-3.5" /> Context: Module {mod.num} · {mod.title}
              <button onClick={() => setModuleId(undefined)} className="ml-auto text-slate-400 hover:text-slate-700" aria-label="Clear module context"><X className="h-3.5 w-3.5" /></button>
            </div>
          )}
          <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto p-5">
            {msgs.length === 0 && (
              <div className="py-6 text-center">
                <div className="float mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-violet-100 to-pink-100 text-3xl">🤖</div>
                <h2 className="mt-3 text-lg font-extrabold text-slate-800">What do you want to learn or build?</h2>
                <p className="text-sm text-slate-500">Ask for concepts, labs, code, industry cases or a quiz. The router picks the right specialist.</p>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {suggestions.map((s) => (
                    <button key={s} onClick={() => ask(s)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:border-violet-300 hover:bg-violet-50">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {msgs.map((m, i) => <Bubble key={i} m={m} />)}
            {busy && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-violet-500" /> Agent is working through the graph…
              </div>
            )}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="flex gap-2 border-t border-slate-100 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={apiKey ? "Ask anything about Claude Opus 4.8…" : "Add your Groq key to start…"}
              className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
            <button disabled={busy || !input.trim()} className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-md disabled:opacity-40" aria-label="Send">
              {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </form>
        </section>

        {/* GRAPH + TRACE */}
        <section className="space-y-4">
          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <h3 className="mb-3 flex items-center justify-between text-sm font-extrabold uppercase tracking-wider text-slate-500">
              Execution trace <span className="text-[11px] normal-case tracking-normal text-slate-400">state updates per node</span>
            </h3>
            {trace.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">Ask a question to watch each LangGraph node run.</p>
            ) : (
              <ol className="max-h-[calc(100vh-14rem)] min-h-40 space-y-2 overflow-y-auto pr-1">
                {trace.map((t, i) => <TraceCard key={i} item={t} />)}
              </ol>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function Bubble({ m }: { m: Msg }) {
  if (m.role === "user")
    return (
      <div className="flex justify-end gap-2">
        <div className="max-w-[85%] rounded-3xl rounded-tr-md bg-gradient-to-br from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm text-white shadow">{m.content}</div>
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-violet-100 text-violet-700"><User className="h-4 w-4" /></div>
      </div>
    );
  if (m.error)
    return (
      <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"><AlertTriangle className="h-5 w-5 shrink-0" />{m.content}</div>
    );
  const persona = m.meta ? INTENTS[m.meta.intent] : undefined;
  return (
    <div className="flex gap-2">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-base" style={{ background: `${persona?.color ?? "#8b5cf6"}22` }}>{persona?.emoji ?? "🤖"}</div>
      <div className="min-w-0 flex-1">
        {m.meta && persona && (
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
            <span className="rounded-full px-2 py-0.5 text-white" style={{ background: persona.color }}>{persona.label}</span>
            {m.meta.review && (
              <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${m.meta.review.score >= 7 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                <ShieldCheck className="h-3 w-3" /> Reviewer {m.meta.review.score}/10
              </span>
            )}
            {m.meta.revisions > 0 && <span className="rounded-full bg-sky-100 px-2 py-0.5 text-sky-700">self-corrected ×{m.meta.revisions}</span>}
            {m.meta.toolCalls.length > 0 && <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-amber-700"><Wrench className="h-3 w-3" />{m.meta.toolCalls.length} tool call{m.meta.toolCalls.length > 1 ? "s" : ""}</span>}
          </div>
        )}
        <div className="rounded-3xl rounded-tl-md border border-slate-100 bg-slate-50/70 px-4 py-3 text-slate-800">
          <Markdown text={m.content} />
        </div>
        {m.meta && m.meta.sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {m.meta.sources.map((s) => {
              const mod = getModule(s.moduleId);
              return (
                <a key={s.id} href={`/modules/${s.moduleId}`} className="rounded-full border bg-white px-2 py-0.5 text-[11px] font-semibold hover:shadow-sm" style={{ borderColor: `${mod?.accent}55`, color: mod?.accent }}>
                  📎 {s.module} · {s.title}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function TraceCard({ item }: { item: TraceItem }) {
  const n = GRAPH_NODES.find((g) => g.id === item.node)!;
  const d = item.data;
  let body: React.ReactNode = null;
  if (item.node === "router") {
    const intent = d.intent as Intent;
    body = (
      <div className="flex flex-wrap gap-1.5 text-xs">
        <span className="rounded-full px-2 py-0.5 font-bold text-white" style={{ background: INTENTS[intent]?.color }}>{INTENTS[intent]?.emoji} {intent}</span>
        <span className={`rounded-full px-2 py-0.5 font-bold ${d.needsTools ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>tools: {d.needsTools ? "yes" : "no"}</span>
        <span className="text-slate-500">{String(d.reason ?? "")}</span>
      </div>
    );
  } else if (item.node === "retriever") {
    const s = (d.sources as string[]) ?? [];
    body = s.length ? <ul className="space-y-0.5 text-xs text-slate-600">{s.map((x) => <li key={x}>📄 {x}</li>)}</ul> : <p className="text-xs text-slate-400">No matching chunks</p>;
  } else if (item.node === "tools") {
    const c = (d.calls as string[]) ?? [];
    body = c.length ? <ul className="space-y-1">{c.map((x, i) => <li key={i} className="break-all rounded-lg bg-slate-900 px-2 py-1 font-mono text-[10.5px] text-amber-200">{x}</li>)}</ul> : <p className="text-xs text-slate-400">No tool calls made</p>;
  } else if (item.node === "specialist") {
    body = <p className="line-clamp-2 text-xs text-slate-600">{String(d.preview ?? "")}… <span className="text-slate-400">({String(d.chars)} chars)</span></p>;
  } else if (item.node === "reviewer") {
    const issues = (d.issues as string[]) ?? [];
    body = (
      <div className="text-xs">
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-bold text-emerald-700">score {String(d.score)}/10</span>
          <span className={`rounded-full px-2 py-0.5 font-bold ${d.verdict === "pass" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{String(d.verdict)}</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 font-bold text-slate-600">grounded: {d.grounded ? "yes" : "no"}</span>
          {Boolean(d.willRevise) && <span className="rounded-full bg-sky-100 px-2 py-0.5 font-bold text-sky-700">↺ sending back for revision</span>}
        </div>
        {issues.length > 0 && <ul className="mt-1 list-disc pl-4 text-slate-500">{issues.map((x) => <li key={x}>{x}</li>)}</ul>}
      </div>
    );
  }
  return (
    <li className="rounded-2xl border p-3" style={{ borderColor: `${n.color}40`, background: `${n.color}0a` }}>
      <div className="mb-1.5 flex items-center gap-2 text-sm font-extrabold" style={{ color: n.color }}>
        <span>{n.emoji}</span> {n.label}
        <span className="ml-auto font-mono text-[10px] font-semibold text-slate-400">+{item.t} ms</span>
      </div>
      {body}
    </li>
  );
}

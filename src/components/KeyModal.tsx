"use client";

import { useState } from "react";
import { KeyRound, Loader2, ShieldCheck, X, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";
import { useByok } from "./Providers";

export function KeyModal() {
  const { apiKey, setApiKey, model, setModel, models, setModels, clear, open, setOpen } = useByok();
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<{ kind: "idle" | "testing" | "ok" | "err"; msg?: string }>({ kind: "idle" });

  if (!open) return null;
  const masked = apiKey ? `${apiKey.slice(0, 6)}…${apiKey.slice(-4)}` : "not set";

  const test = async (k: string) => {
    setStatus({ kind: "testing" });
    try {
      const r = await fetch("/api/groq-models", { method: "POST", headers: { "x-groq-key": k } });
      const j = await r.json();
      if (!j.ok) return setStatus({ kind: "err", msg: j.error });
      setModels(j.models);
      if (!j.models.includes(model) && j.models.length) setModel(j.models.includes("llama-3.3-70b-versatile") ? "llama-3.3-70b-versatile" : j.models[0]);
      setApiKey(k);
      setDraft("");
      setStatus({ kind: "ok", msg: `Key verified · ${j.models.length} models available` });
    } catch {
      setStatus({ kind: "err", msg: "Network error" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative bg-gradient-to-r from-orange-500 via-pink-500 to-violet-600 p-6 text-white">
          <button onClick={() => setOpen(false)} className="absolute right-4 top-4 rounded-full p-1 hover:bg-white/20" aria-label="Close"><X className="h-5 w-5" /></button>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/20 p-2.5"><KeyRound className="h-6 w-6" /></div>
            <div>
              <h2 className="text-xl font-bold">Bring Your Own Key</h2>
              <p className="text-sm text-white/85">Power the AI Coach with your Groq API key</p>
            </div>
          </div>
        </div>
        <div className="space-y-5 p-6">
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
            <span className="text-slate-500">Current key</span>
            <span className="font-mono font-semibold text-slate-800">{masked}</span>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Groq API key</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="gsk_…"
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 font-mono text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
              <button
                disabled={!draft.trim() || status.kind === "testing"}
                onClick={() => test(draft.trim())}
                className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-40"
              >
                {status.kind === "testing" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & save"}
              </button>
            </div>
            <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="mt-1.5 inline-flex items-center gap-1 text-xs text-violet-600 hover:underline">
              Get a free key at console.groq.com <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {status.kind === "ok" && <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700"><CheckCircle2 className="h-4 w-4" />{status.msg}</p>}
          {status.kind === "err" && <p className="flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700"><AlertTriangle className="h-4 w-4" />{status.msg}</p>}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Model</label>
            <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400">
              {models.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <p className="mt-1 text-xs text-slate-500">Tool-calling models work best (e.g. llama-3.3-70b-versatile).</p>
          </div>

          <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3 text-xs text-emerald-900">
            <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
            <p>Your key is stored only in this browser&apos;s localStorage. It is sent per request to this app&apos;s <code>/api/agent</code> route, which forwards it to Groq and never stores or logs it. Use a key you can revoke and clear it on shared machines.</p>
          </div>

          {apiKey && (
            <button onClick={() => { clear(); setStatus({ kind: "idle" }); }} className="w-full rounded-xl border border-rose-200 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50">
              Remove key from this browser
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

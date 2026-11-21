"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { CodeSample } from "@/lib/types";

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const TOKEN =
  /("""[\s\S]*?"""|f?"(?:\\.|[^"\\\n])*"|f?'(?:\\.|[^'\\\n])*'|#[^\n]*)|\b(import|from|as|def|return|if|elif|else|for|in|while|with|try|except|class|True|False|None|and|or|not|print|break|lambda|async|await)\b|\b(\d+\.?\d*)\b/g;

function highlight(code: string, lang: string) {
  if (lang !== "python" && lang !== "bash") return esc(code);
  let out = "";
  let last = 0;
  for (const m of code.matchAll(TOKEN)) {
    out += esc(code.slice(last, m.index));
    const [tok, str, kw] = m;
    const cls = str ? (str.startsWith("#") ? "text-slate-400 italic" : "text-emerald-300") : kw ? "text-pink-400 font-semibold" : "text-amber-300";
    out += `<span class="${cls}">${esc(tok)}</span>`;
    last = m.index + tok.length;
  }
  return out + esc(code.slice(last));
}

export function CodeBlock({ sample, accent = "#8b5cf6" }: { sample: CodeSample; accent?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#1b1830] shadow-lg">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-rose-400" />
        <span className="h-3 w-3 rounded-full bg-amber-300" />
        <span className="h-3 w-3 rounded-full bg-emerald-400" />
        <span className="ml-2 truncate text-xs font-semibold text-slate-300">{sample.title}</span>
        <span className="ml-auto rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white" style={{ background: accent }}>
          {sample.lang}
        </span>
        <button
          onClick={() => { navigator.clipboard?.writeText(sample.code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          className="rounded-md p-1 text-slate-300 hover:bg-white/10"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <pre className="max-h-[480px] overflow-auto p-4 text-[12.5px] leading-relaxed text-slate-100">
        <code className="font-mono" dangerouslySetInnerHTML={{ __html: highlight(sample.code, sample.lang) }} />
      </pre>
      {sample.note && <div className="border-t border-white/10 bg-white/5 px-4 py-2 text-xs text-amber-200">💡 {sample.note}</div>}
    </div>
  );
}

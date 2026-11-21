"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bot, KeyRound, Menu, Sparkles, X } from "lucide-react";
import { useByok } from "./Providers";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/modules/m1", label: "Modules", match: "/modules" },
  { href: "/project", label: "Capstone Project" },
  { href: "/use-cases", label: "Industry Use Cases" },
  { href: "/assistant", label: "AI Coach", icon: true },
];

export function Nav() {
  const path = usePathname();
  const { apiKey, setOpen } = useByok();
  const [mobile, setMobile] = useState(false);
  const active = (l: (typeof LINKS)[number]) => (l.match ? path.startsWith(l.match) : path === l.href);

  return (
    <header className="glass sticky top-0 z-40 border-b border-violet-100/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-400 text-white shadow-md shadow-fuchsia-200">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline">
            Opus 4.8 <span className="text-gradient">Lab</span>
          </span>
        </Link>
        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                active(l) ? "bg-violet-600 text-white shadow-sm" : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
              }`}
            >
              {l.icon && <Bot className="h-4 w-4" />}
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => setOpen(true)}
          className={`ml-auto flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
            apiKey ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
          }`}
        >
          <KeyRound className="h-4 w-4" />
          <span className={`h-2 w-2 rounded-full ${apiKey ? "bg-emerald-500" : "bg-orange-400"}`} />
          <span className="hidden sm:inline">{apiKey ? "Groq key set" : "Add Groq key"}</span>
        </button>
        <button className="rounded-lg p-2 md:hidden" onClick={() => setMobile(!mobile)} aria-label="Menu">
          {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {mobile && (
        <nav className="flex flex-col gap-1 border-t border-violet-100 px-4 py-3 md:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMobile(false)} className={`rounded-xl px-3 py-2 text-sm font-semibold ${active(l) ? "bg-violet-600 text-white" : "text-slate-700"}`}>
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

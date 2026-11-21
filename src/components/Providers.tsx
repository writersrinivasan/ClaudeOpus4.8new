"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { GROQ_MODELS } from "@/lib/agent/spec";

const safeGet = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const safeSet = (k: string, v: string | null) => {
  try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch { /* storage unavailable */ }
};

type Byok = {
  apiKey: string;
  model: string;
  models: string[];
  setApiKey: (k: string) => void;
  setModel: (m: string) => void;
  setModels: (m: string[]) => void;
  clear: () => void;
  open: boolean;
  setOpen: (o: boolean) => void;
};

type Progress = {
  done: Record<string, boolean>;
  toggle: (key: string) => void;
  moduleProgress: (moduleId: string, total: number) => number;
};

const ByokCtx = createContext<Byok | null>(null);
const ProgressCtx = createContext<Progress | null>(null);

export function Providers({ children }: { children: React.ReactNode }) {
  const [apiKey, setKeyState] = useState("");
  const [model, setModelState] = useState(GROQ_MODELS[0]);
  const [models, setModels] = useState<string[]>(GROQ_MODELS);
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Hydrate from browser storage after mount (BYOK key never leaves this browser except per-request).
    /* eslint-disable react-hooks/set-state-in-effect */
    setKeyState(safeGet("groq_key") ?? "");
    setModelState(safeGet("groq_model") ?? GROQ_MODELS[0]);
    try { setDone(JSON.parse(safeGet("progress") ?? "{}")); } catch { /* ignore */ }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const setApiKey = useCallback((k: string) => { setKeyState(k); safeSet("groq_key", k || null); }, []);
  const setModel = useCallback((m: string) => { setModelState(m); safeSet("groq_model", m); }, []);
  const clear = useCallback(() => { setKeyState(""); safeSet("groq_key", null); }, []);

  const toggle = useCallback((key: string) => {
    setDone((d) => {
      const n = { ...d, [key]: !d[key] };
      safeSet("progress", JSON.stringify(n));
      return n;
    });
  }, []);
  const moduleProgress = useCallback(
    (moduleId: string, total: number) => {
      if (!total) return 0;
      const c = Object.keys(done).filter((k) => done[k] && k.startsWith(`${moduleId}:`)).length;
      return Math.min(1, c / total);
    },
    [done],
  );

  return (
    <ByokCtx.Provider value={{ apiKey, model, models, setApiKey, setModel, setModels, clear, open, setOpen }}>
      <ProgressCtx.Provider value={{ done, toggle, moduleProgress }}>{children}</ProgressCtx.Provider>
    </ByokCtx.Provider>
  );
}

export const useByok = () => {
  const c = useContext(ByokCtx);
  if (!c) throw new Error("useByok outside Providers");
  return c;
};
export const useProgress = () => {
  const c = useContext(ProgressCtx);
  if (!c) throw new Error("useProgress outside Providers");
  return c;
};

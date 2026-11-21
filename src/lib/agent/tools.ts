import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { moduleSummary } from "./knowledge";

/** Safe arithmetic evaluator (no eval): + - * / ^ % and parentheses. */
export function calc(expr: string): number {
  const s = expr.replace(/,/g, "").replace(/\s+/g, "");
  let i = 0;
  const peek = () => s[i];
  const num = (): number => {
    if (peek() === "(") {
      i++;
      const v = add();
      if (s[i++] !== ")") throw new Error("Missing )");
      return v;
    }
    if (peek() === "-") { i++; return -num(); }
    if (peek() === "+") { i++; return num(); }
    const m = /^\d*\.?\d+(e[+-]?\d+)?/i.exec(s.slice(i));
    if (!m) throw new Error(`Unexpected token at ${i}: '${s.slice(i, i + 5)}'`);
    i += m[0].length;
    let v = parseFloat(m[0]);
    if (peek() === "%") { i++; v = v / 100; }
    return v;
  };
  const pow = (): number => {
    const b = num();
    if (peek() === "^") { i++; return Math.pow(b, pow()); }
    return b;
  };
  const mul = (): number => {
    let v = pow();
    while (peek() === "*" || peek() === "/") {
      const op = s[i++];
      const r = pow();
      v = op === "*" ? v * r : v / r;
    }
    return v;
  };
  const add = (): number => {
    let v = mul();
    while (peek() === "+" || peek() === "-") {
      const op = s[i++];
      const r = mul();
      v = op === "+" ? v + r : v - r;
    }
    return v;
  };
  const out = add();
  if (i !== s.length) throw new Error(`Unexpected trailing input: '${s.slice(i)}'`);
  if (!Number.isFinite(out)) throw new Error("Result is not finite (division by zero?)");
  return out;
}

export const calculator = tool(
  async ({ expression }) => {
    try {
      return JSON.stringify({ expression, result: Math.round(calc(expression) * 1e6) / 1e6 });
    } catch (e) {
      return JSON.stringify({ error: (e as Error).message });
    }
  },
  {
    name: "calculator",
    description: "Evaluate an arithmetic expression exactly. Use for ANY math (growth %, ratios, ROI). Supports + - * / ^ ( ) and % suffix.",
    schema: z.object({ expression: z.string().describe("e.g. (4.9-4.2)/4.2*100") }),
  },
);

const PRICES: Record<string, { in: number; out: number }> = {
  "claude-opus-4-8": { in: 5, out: 25 },
  "claude-sonnet-4-6": { in: 3, out: 15 },
  "claude-haiku-4-5": { in: 1, out: 5 },
};

export const estimateCost = tool(
  async ({ model, input_tokens, output_tokens, requests }) => {
    const p = PRICES[model] ?? PRICES["claude-opus-4-8"];
    const per = (input_tokens * p.in + output_tokens * p.out) / 1e6;
    return JSON.stringify({
      model: PRICES[model] ? model : "claude-opus-4-8",
      price_per_mtok_usd: p,
      cost_per_request_usd: +per.toFixed(4),
      requests,
      total_cost_usd: +(per * requests).toFixed(2),
      note: "List prices, first-party API, before caching/batch discounts. Thinking tokens bill as output.",
    });
  },
  {
    name: "estimate_claude_cost",
    description: "Estimate Claude API cost from token counts. Use when the user asks about pricing, budgets or cost of a workload.",
    schema: z.object({
      model: z.string().describe("claude-opus-4-8 | claude-sonnet-4-6 | claude-haiku-4-5").default("claude-opus-4-8"),
      input_tokens: z.number().describe("input tokens per request"),
      output_tokens: z.number().describe("output tokens per request (incl. thinking)"),
      requests: z.number().describe("number of requests").default(1),
    }),
  },
);

export const kpiGrowth = tool(
  async ({ metric, current, previous }) => {
    if (previous === 0) return JSON.stringify({ metric, error: "previous value is 0 — growth undefined" });
    const g = ((current - previous) / previous) * 100;
    return JSON.stringify({ metric, current, previous, change: current - previous, growth_pct: +g.toFixed(2), trend: g > 0 ? "up" : g < 0 ? "down" : "flat" });
  },
  {
    name: "kpi_growth",
    description: "Compute change and % growth for a business KPI between two periods.",
    schema: z.object({ metric: z.string(), current: z.number(), previous: z.number() }),
  },
);

export const lookupModule = tool(
  async ({ query }) => JSON.stringify(moduleSummary(query)),
  {
    name: "lookup_workshop_module",
    description: "Look up the workshop syllabus: module objectives, concepts and hands-on lab. Use when asked what a module covers or where to learn something.",
    schema: z.object({ query: z.string().describe("module number/name or topic") }),
  },
);

export const TOOLS = [calculator, estimateCost, kpiGrowth, lookupModule];
export const TOOL_MAP = Object.fromEntries(TOOLS.map((t) => [t.name, t]));

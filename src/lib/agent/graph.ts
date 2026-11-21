import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { AIMessage, HumanMessage, SystemMessage, ToolMessage, type BaseMessage } from "@langchain/core/messages";
import { retrieve, type Chunk } from "./knowledge";
import { TOOLS, TOOL_MAP } from "./tools";
import { INTENTS, type AgentEvent, type Intent, type NodeId, type Review, type ToolTrace } from "./spec";

type Turn = { role: "user" | "assistant"; content: string };

const State = Annotation.Root({
  question: Annotation<string>,
  moduleId: Annotation<string | undefined>,
  history: Annotation<Turn[]>,
  intent: Annotation<Intent>,
  needsTools: Annotation<boolean>,
  routerReason: Annotation<string>,
  sources: Annotation<Chunk[]>,
  toolCalls: Annotation<ToolTrace[]>,
  draft: Annotation<string>,
  review: Annotation<Review | undefined>,
  revisions: Annotation<number>({ reducer: (_a, b) => b, default: () => 0 }),
  loopBack: Annotation<boolean>,
});
type S = typeof State.State;

const COURSE = `The learner is taking a hands-on workshop on Claude Opus 4.8 (model id claude-opus-4-8; 1M-token context,
128K max output, adaptive thinking via thinking={"type":"adaptive"} which must be set explicitly on 4.8, effort levels
low/medium/high/xhigh/max via output_config.effort, no temperature/top_p/top_k, no assistant prefill, structured outputs via
output_config.format json_schema, tool use, MCP, computer use, Claude Code). Workshop language: Python + anthropic SDK + pandas + Streamlit.`;

function extractJson<T>(text: string): T | null {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]) as T; } catch { return null; }
}

const textOf = (m: BaseMessage) =>
  typeof m.content === "string" ? m.content : m.content.map((c) => ("text" in c ? c.text : "")).join("");

const PERSONAS: Record<Intent, string> = {
  concept: "You are a vivid, precise Concept Tutor. Explain with a one-line definition, a simple analogy, a short 'how it works' list, and a 'common pitfall'. Use small markdown tables when comparing things.",
  handson: "You are a Lab Coach. Give a numbered, step-by-step practical exercise the learner can do right now, with commands/code blocks, what they should observe at each step, and a 'stretch goal'.",
  usecase: "You are an Industry Consultant. Frame the answer as: Business problem → How Claude Opus 4.8 solves it (which capabilities) → Architecture sketch (bullets) → KPIs/ROI → Risks & controls.",
  code: "You are a Senior AI Engineer. Provide correct, runnable Python using the official `anthropic` SDK with model=\"claude-opus-4-8\". Explain key lines briefly after the code. Never use temperature or prefill on Opus 4.8.",
  quiz: "You are a Quiz Master. Create 3–5 multiple-choice questions (A–D) on the topic, then an 'Answer key' section with a one-line explanation for each.",
};

export function buildGraph(llm: ChatGroq, emit: (e: AgentEvent) => void) {
  const wrap =
    (id: NodeId, fn: (s: S) => Promise<Partial<S>>, summarize: (u: Partial<S>, s: S) => Record<string, unknown>) =>
    async (s: S) => {
      emit({ type: "node_start", node: id });
      const u = await fn(s);
      emit({ type: "node_end", node: id, data: summarize(u, s) });
      return u;
    };

  const historyMsgs = (s: S) =>
    (s.history ?? []).slice(-6).map((t) => (t.role === "user" ? new HumanMessage(t.content) : new AIMessage(t.content)));

  // 1) ROUTER — classify the learner's intent
  const router = wrap(
    "router",
    async (s) => {
      const res = await llm.invoke([
        new SystemMessage(
          `Classify a learner's message for a Claude Opus 4.8 workshop assistant.
Intents: "concept" (explain/understand), "handson" (exercise, lab, practice, how do I do it step by step),
"usecase" (industry/business application, ROI), "code" (write/fix/explain code), "quiz" (test me, questions).
needs_tools=true if answering requires arithmetic, cost/pricing estimates, KPI growth, or looking up what a module covers.
Reply ONLY with JSON: {"intent": "...", "needs_tools": true|false, "reason": "<10 words>"}`,
        ),
        new HumanMessage(s.question),
      ]);
      const j = extractJson<{ intent: string; needs_tools: boolean; reason: string }>(textOf(res));
      const intent = (j && j.intent in INTENTS ? j.intent : "concept") as Intent;
      const heuristicTools = /\d/.test(s.question) && /(cost|price|budget|growth|%|calculate|roi|token)/i.test(s.question);
      return { intent, needsTools: Boolean(j?.needs_tools) || heuristicTools, routerReason: j?.reason ?? "fallback classification" };
    },
    (u) => ({ intent: u.intent, needsTools: u.needsTools, reason: u.routerReason }),
  );

  // 2) RETRIEVER — keyword RAG over the workshop knowledge base
  const retriever = wrap(
    "retriever",
    async (s) => ({ sources: retrieve(s.question, s.intent, s.moduleId) }),
    (u) => ({ sources: (u.sources ?? []).map((c) => `${c.module} · ${c.title}`) }),
  );

  // 3) TOOL AGENT — ReAct-style loop with real function calling
  const toolsNode = wrap(
    "tools",
    async (s) => {
      const bound = llm.bindTools(TOOLS);
      const msgs: BaseMessage[] = [
        new SystemMessage(
          "You are a tool-using analyst. Call the available tools to compute every number or lookup the question needs. Do not do arithmetic in your head. When you have all results, reply with a one-line summary of them.",
        ),
        new HumanMessage(s.question),
      ];
      const trace: ToolTrace[] = [];
      for (let step = 0; step < 4; step++) {
        const ai = await bound.invoke(msgs);
        msgs.push(ai);
        const calls = ai.tool_calls ?? [];
        if (!calls.length) break;
        for (const c of calls) {
          const t = TOOL_MAP[c.name];
          let result: string;
          try {
            result = t ? String(await (t as { invoke: (a: unknown) => Promise<unknown> }).invoke(c.args)) : JSON.stringify({ error: `unknown tool ${c.name}` });
          } catch (e) {
            result = JSON.stringify({ error: (e as Error).message });
          }
          trace.push({ name: c.name, args: c.args, result });
          msgs.push(new ToolMessage({ content: result, tool_call_id: c.id ?? c.name }));
        }
      }
      return { toolCalls: trace };
    },
    (u) => ({ calls: (u.toolCalls ?? []).map((t) => `${t.name}(${JSON.stringify(t.args)}) → ${t.result}`) }),
  );

  // 4) SPECIALIST — persona selected by intent writes the answer
  const specialist = wrap(
    "specialist",
    async (s) => {
      const ctx = (s.sources ?? []).map((c, i) => `<source id="${i + 1}" module="${c.module}" title="${c.title}">\n${c.text}\n</source>`).join("\n");
      const tools = (s.toolCalls ?? []).length
        ? `<tool_results>\n${s.toolCalls.map((t) => `${t.name}(${JSON.stringify(t.args)}) = ${t.result}`).join("\n")}\n</tool_results>\nUse these exact numbers.`
        : "";
      const feedback = s.review?.verdict === "revise" ? `\n<reviewer_feedback>Fix these issues: ${s.review.issues.join("; ")}</reviewer_feedback>` : "";
      const res = await llm.invoke([
        new SystemMessage(
          `${PERSONAS[s.intent]}\n\n${COURSE}\n\nGround your answer in the workshop sources below when relevant and cite them like [M3]. If something is not in the sources and you are unsure, say so rather than inventing details. Use rich Markdown (headings, bullets, bold, tables, fenced code). Keep it focused: under ~350 words unless code is required.\n\n<sources>\n${ctx}\n</sources>\n${tools}${feedback}`,
        ),
        ...historyMsgs(s),
        new HumanMessage(s.question),
      ]);
      return { draft: textOf(res) };
    },
    (u) => ({ chars: u.draft?.length ?? 0, preview: (u.draft ?? "").slice(0, 160) }),
  );

  // 5) REVIEWER — LLM-as-judge for grounding & completeness (Module 7 in action)
  const reviewer = wrap(
    "reviewer",
    async (s) => {
      const res = await llm.invoke([
        new SystemMessage(
          `You are a strict reviewer evaluating a teaching assistant's answer about Claude Opus 4.8.
Check: (1) does it answer the question, (2) are numbers consistent with tool results, (3) does it contradict these facts: ${COURSE}
Reply ONLY with JSON: {"score": 1-10, "grounded": true|false, "verdict": "pass"|"revise", "issues": ["..."]}. Use "revise" only for real factual errors or if the question is not answered.`,
        ),
        new HumanMessage(
          `<question>${s.question}</question>\n<tool_results>${JSON.stringify(s.toolCalls ?? [])}</tool_results>\n<answer>${s.draft}</answer>`,
        ),
      ]);
      const j = extractJson<Review>(textOf(res));
      const review: Review = {
        score: Math.max(1, Math.min(10, Number(j?.score) || 7)),
        grounded: j?.grounded ?? true,
        verdict: j?.verdict === "revise" ? "revise" : "pass",
        issues: Array.isArray(j?.issues) ? j!.issues.slice(0, 4) : [],
      };
      const willRevise = review.verdict === "revise" && (s.revisions ?? 0) < 1;
      return { review, loopBack: willRevise, revisions: willRevise ? (s.revisions ?? 0) + 1 : s.revisions ?? 0 };
    },
    (u) => ({ ...u.review, willRevise: u.loopBack }),
  );

  const afterRetriever = (s: S) => {
    const to = s.needsTools ? "tools" : "specialist";
    emit({ type: "edge", from: "retriever", to });
    return to;
  };
  const afterReview = (s: S) => {
    const revise = Boolean(s.loopBack);
    emit({ type: "edge", from: "reviewer", to: revise ? "specialist" : "__end__" });
    return revise ? "specialist" : END;
  };

  return new StateGraph(State)
    .addNode("router", router)
    .addNode("retriever", retriever)
    .addNode("tools", toolsNode)
    .addNode("specialist", specialist)
    .addNode("reviewer", reviewer)
    .addEdge(START, "router")
    .addEdge("router", "retriever")
    .addConditionalEdges("retriever", afterRetriever, ["tools", "specialist"])
    .addEdge("tools", "specialist")
    .addEdge("specialist", "reviewer")
    .addConditionalEdges("reviewer", afterReview, ["specialist", END])
    .compile();
}

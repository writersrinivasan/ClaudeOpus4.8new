// Shared (client + server) description of the LangGraph workflow, used for the live infographic.
export type NodeId = "__start__" | "router" | "retriever" | "tools" | "specialist" | "reviewer" | "__end__";

export const GRAPH_NODES: { id: NodeId; label: string; sub: string; color: string; emoji: string; x: number; y: number }[] = [
  { id: "__start__", label: "START", sub: "your question", color: "#64748b", emoji: "🚀", x: 0, y: 140 },
  { id: "router", label: "Router", sub: "classify intent", color: "#8b5cf6", emoji: "🧭", x: 150, y: 140 },
  { id: "retriever", label: "Retriever", sub: "search syllabus KB", color: "#0ea5e9", emoji: "📚", x: 330, y: 140 },
  { id: "tools", label: "Tool Agent", sub: "calc · cost · KPI", color: "#f59e0b", emoji: "🛠️", x: 510, y: 20 },
  { id: "specialist", label: "Specialist", sub: "tutor / coach / engineer", color: "#f43f5e", emoji: "🎓", x: 690, y: 140 },
  { id: "reviewer", label: "Reviewer", sub: "grounding check", color: "#22c55e", emoji: "🛡️", x: 870, y: 140 },
  { id: "__end__", label: "END", sub: "final answer", color: "#64748b", emoji: "🏁", x: 1050, y: 140 },
];

export const GRAPH_EDGES: { id: string; source: NodeId; target: NodeId; label?: string; conditional?: boolean }[] = [
  { id: "e1", source: "__start__", target: "router" },
  { id: "e2", source: "router", target: "retriever" },
  { id: "e3", source: "retriever", target: "tools", label: "needs tools", conditional: true },
  { id: "e4", source: "retriever", target: "specialist", label: "direct", conditional: true },
  { id: "e5", source: "tools", target: "specialist" },
  { id: "e6", source: "specialist", target: "reviewer" },
  { id: "e7", source: "reviewer", target: "specialist", label: "revise", conditional: true },
  { id: "e8", source: "reviewer", target: "__end__", label: "pass", conditional: true },
];

export const INTENTS = {
  concept: { label: "Concept Tutor", emoji: "📘", color: "#8b5cf6" },
  handson: { label: "Lab Coach", emoji: "🧪", color: "#10b981" },
  usecase: { label: "Industry Consultant", emoji: "🏭", color: "#f59e0b" },
  code: { label: "Code Engineer", emoji: "💻", color: "#0ea5e9" },
  quiz: { label: "Quiz Master", emoji: "🎯", color: "#f43f5e" },
} as const;
export type Intent = keyof typeof INTENTS;

export type AgentEvent =
  | { type: "node_start"; node: NodeId }
  | { type: "node_end"; node: NodeId; data: Record<string, unknown> }
  | { type: "edge"; from: NodeId; to: NodeId }
  | { type: "final"; answer: string; intent: Intent; review?: Review; sources: SourceRef[]; toolCalls: ToolTrace[]; revisions: number }
  | { type: "error"; message: string };

export type Review = { score: number; grounded: boolean; verdict: "pass" | "revise"; issues: string[] };
export type SourceRef = { id: string; module: string; moduleId: string; kind: string; title: string };
export type ToolTrace = { name: string; args: Record<string, unknown>; result: string };

export const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "llama-3.1-8b-instant",
];

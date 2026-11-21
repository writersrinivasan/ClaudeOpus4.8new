// Offline end-to-end test of the LangGraph workflow using a scripted fake LLM (no Groq key needed).
// Run: npx tsx scripts/test-agent.ts
import { AIMessage } from "@langchain/core/messages";
import type { ChatGroq } from "@langchain/groq";
import { buildGraph } from "../src/lib/agent/graph";
import { calc } from "../src/lib/agent/tools";
import type { AgentEvent } from "../src/lib/agent/spec";

function fake(script: string[], toolScript: AIMessage[]) {
  return {
    invoke: async () => new AIMessage(script.shift() ?? "{}"),
    bindTools: () => ({ invoke: async () => toolScript.shift() ?? new AIMessage("done") }),
  } as unknown as ChatGroq;
}

function assert(cond: unknown, msg: string) {
  if (!cond) { console.error("❌", msg); process.exitCode = 1; } else console.log("✅", msg);
}

async function run(name: string, llm: ChatGroq, question: string) {
  const events: AgentEvent[] = [];
  const g = buildGraph(llm, (e) => events.push(e));
  const s = await g.invoke({ question, history: [] });
  const path = events.filter((e) => e.type === "node_start").map((e) => (e as { node: string }).node);
  console.log(`\n[${name}] path: ${path.join(" → ")}`);
  return { s, path };
}

(async () => {
  // calculator
  assert(calc("(4.9-4.2)/4.2*100").toFixed(2) === "16.67", "calc growth %");
  assert(calc("2^3^2") === 512 && calc("-(3+2)*2") === -10 && calc("50%*200") === 100, "calc precedence/unary/percent");
  let threw = false; try { calc("1/0"); } catch { threw = true; }
  assert(threw, "calc rejects division by zero");

  // 1) concept path, reviewer passes
  const a = await run("concept", fake([
    '{"intent":"concept","needs_tools":false,"reason":"explain"}',
    "## Adaptive thinking\nIt lets the model decide how much to reason. [M2]",
    '{"score":9,"grounded":true,"verdict":"pass","issues":[]}',
  ], []), "Explain adaptive thinking");
  assert(a.path.join() === "router,retriever,specialist,reviewer", "concept path skips tools");
  assert(a.s.sources.some((c) => c.moduleId === "m2"), "retriever finds Module 2 for adaptive thinking");

  // 2) tool path + one revision loop
  const b = await run("tools+revise", fake([
    '{"intent":"usecase","needs_tools":true,"reason":"cost"}',
    "Cost is $999",
    '{"score":4,"grounded":false,"verdict":"revise","issues":["number mismatches tool result"]}',
    "Cost is $1,575.00 for 30 days",
    '{"score":4,"grounded":false,"verdict":"revise","issues":["still unsure"]}',
  ], [
    new AIMessage({ content: "", tool_calls: [{ id: "t1", name: "estimate_claude_cost", args: { model: "claude-opus-4-8", input_tokens: 6000, output_tokens: 1500, requests: 30 } }] }),
    new AIMessage("All tools done"),
  ]), "Cost of 30 requests with 6K in / 1.5K out on Opus 4.8?");
  assert(b.path.join() === "router,retriever,tools,specialist,reviewer,specialist,reviewer", "tool path with exactly one revision loop");
  assert(b.s.toolCalls.length === 1 && Math.abs(JSON.parse(b.s.toolCalls[0].result).total_cost_usd - 2.025) < 0.01, "estimate_claude_cost result (30 × $0.0675)");
  assert(b.s.draft.includes("1,575"), "final answer is the revised draft");

  // 3) garbage router output falls back safely
  const c = await run("fallback", fake(["not json", "answer", "garbage"], []), "Tell me something");
  assert(c.s.intent === "concept" && c.s.review?.verdict === "pass", "fallbacks for malformed JSON");
})();

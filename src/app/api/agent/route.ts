import { ChatGroq } from "@langchain/groq";
import { buildGraph } from "@/lib/agent/graph";
import type { AgentEvent, Intent } from "@/lib/agent/spec";

export const maxDuration = 60;

type Body = {
  question?: string;
  moduleId?: string;
  model?: string;
  history?: { role: "user" | "assistant"; content: string }[];
};

export async function POST(req: Request) {
  // BYOK: the Groq key comes from the user's browser on every request and is never stored or logged here.
  const apiKey = req.headers.get("x-groq-key")?.trim();
  if (!apiKey) return Response.json({ error: "Missing Groq API key. Add yours via 'Bring your own key'." }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as Body;
  const question = body.question?.trim();
  if (!question) return Response.json({ error: "Empty question" }, { status: 400 });
  if (question.length > 4000) return Response.json({ error: "Question too long (max 4000 chars)" }, { status: 400 });

  const llm = new ChatGroq({ apiKey, model: body.model || "llama-3.3-70b-versatile", temperature: 0.3, maxRetries: 1 });
  const enc = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const emit = (e: AgentEvent) => controller.enqueue(enc.encode(`data: ${JSON.stringify(e)}\n\n`));
      try {
        const graph = buildGraph(llm, emit);
        emit({ type: "node_start", node: "__start__" });
        emit({ type: "node_end", node: "__start__", data: { question } });
        const s = await graph.invoke(
          { question, moduleId: body.moduleId, history: (body.history ?? []).slice(-6) },
          { recursionLimit: 20 },
        );
        emit({ type: "node_start", node: "__end__" });
        emit({ type: "node_end", node: "__end__", data: {} });
        emit({
          type: "final",
          answer: s.draft,
          intent: s.intent as Intent,
          review: s.review,
          revisions: s.revisions ?? 0,
          toolCalls: s.toolCalls ?? [],
          sources: (s.sources ?? []).map(({ id, module, moduleId, kind, title }) => ({ id, module, moduleId, kind, title })),
        });
      } catch (err) {
        const e = err as { status?: number; message?: string };
        const msg =
          e.status === 401 ? "Groq rejected the API key (401). Check your key." :
          e.status === 429 ? "Groq rate limit hit (429). Wait a moment or switch model." :
          e.status === 404 ? "Model not available on your Groq account. Pick another model." :
          `Agent error: ${e.message ?? "unknown"}`;
        emit({ type: "error", message: msg });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" },
  });
}

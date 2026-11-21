
// Verifies a user-supplied Groq key and returns the chat models it can use.
export async function POST(req: Request) {
  const apiKey = req.headers.get("x-groq-key")?.trim();
  if (!apiKey) return Response.json({ ok: false, error: "No key supplied" }, { status: 400 });
  const r = await fetch("https://api.groq.com/openai/v1/models", {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  }).catch(() => null);
  if (!r) return Response.json({ ok: false, error: "Could not reach Groq" }, { status: 502 });
  if (!r.ok) return Response.json({ ok: false, error: r.status === 401 ? "Invalid Groq API key" : `Groq error ${r.status}` }, { status: r.status });
  const j = (await r.json()) as { data: { id: string; active?: boolean }[] };
  const models = j.data
    .filter((m) => m.active !== false && !/whisper|tts|guard|playai|orpheus|compound/i.test(m.id))
    .map((m) => m.id)
    .sort();
  return Response.json({ ok: true, models });
}

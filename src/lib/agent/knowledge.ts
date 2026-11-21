import { MODULES } from "../content";

export type Chunk = { id: string; moduleId: string; module: string; kind: string; title: string; text: string };

const CHUNKS: Chunk[] = MODULES.flatMap((m) => {
  const base = { moduleId: m.id, module: `M${m.num} · ${m.short}` };
  return [
    { ...base, id: `${m.id}-overview`, kind: "overview", title: m.title, text: `${m.tagline} Objectives: ${m.objectives.join("; ")}. ${m.stats?.map((s) => `${s.label}: ${s.value}`).join("; ") ?? ""}` },
    ...m.concepts.map((c, i) => ({ ...base, id: `${m.id}-c${i}`, kind: "concept", title: c.title, text: `${c.body} ${(c.points ?? []).join("; ")}` })),
    ...m.code.map((c, i) => ({ ...base, id: `${m.id}-code${i}`, kind: "code", title: c.title, text: `${c.note ?? ""}\n${c.code}` })),
    { ...base, id: `${m.id}-lab`, kind: "hands-on", title: m.handsOn.title, text: `${m.handsOn.goal} Steps: ${m.handsOn.steps.map((s, i) => `${i + 1}. ${s.title} — ${s.detail}`).join(" ")} Expected: ${m.handsOn.expected}` },
    ...m.useCases.map((u, i) => ({ ...base, id: `${m.id}-uc${i}`, kind: "use-case", title: `${u.industry}: ${u.title}`, text: `Problem: ${u.problem} Solution: ${u.solution} Impact: ${u.impact}` })),
    { ...base, id: `${m.id}-take`, kind: "takeaways", title: `${m.short} takeaways`, text: m.takeaways.join("; ") },
  ];
});

const STOP = new Set("the a an and or of to in on for with is are be how what why when which do does i me my you your it this that can should claude opus use using about".split(" "));

const tokens = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9_.\s-]/g, " ").split(/\s+/).filter((t) => t.length > 1 && !STOP.has(t));

const KIND_BOOST: Record<string, string[]> = {
  "hands-on": ["handson", "practice", "exercise", "lab"],
  "use-case": ["usecase"],
  code: ["code"],
};

export function retrieve(query: string, intent: string, moduleId?: string, k = 4): Chunk[] {
  const q = tokens(query);
  return CHUNKS.map((c) => {
    const hay = tokens(`${c.title} ${c.title} ${c.text}`);
    const set = new Map<string, number>();
    hay.forEach((t) => set.set(t, (set.get(t) ?? 0) + 1));
    let score = 0;
    for (const t of q) if (set.has(t)) score += 1 + Math.log(set.get(t)!);
    if (moduleId && c.moduleId === moduleId) score += 2;
    if (KIND_BOOST[c.kind]?.includes(intent)) score += 2.5;
    return { c, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((x) => x.c);
}

export function moduleSummary(query: string) {
  const q = query.toLowerCase();
  const m =
    MODULES.find((m) => q.includes(m.id) || q.includes(`module ${m.num}`) || q.includes(m.short.toLowerCase())) ??
    MODULES.find((m) => tokens(q).some((t) => m.title.toLowerCase().includes(t)));
  if (!m) return { found: false, modules: MODULES.map((m) => `M${m.num}: ${m.title} (${m.minutes} min)`) };
  return {
    found: true,
    module: `M${m.num}: ${m.title}`,
    minutes: m.minutes,
    objectives: m.objectives,
    concepts: m.concepts.map((c) => c.title),
    handsOn: m.handsOn.title,
  };
}

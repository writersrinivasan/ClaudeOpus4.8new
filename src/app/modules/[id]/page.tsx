import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MODULES, getModule } from "@/lib/content";
import { ModuleView } from "@/components/ModuleView";

export function generateStaticParams() {
  return MODULES.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: PageProps<"/modules/[id]">): Promise<Metadata> {
  const { id } = await params;
  const m = getModule(id);
  return { title: m ? `M${m.num} · ${m.short} · Opus 4.8 Lab` : "Module not found" };
}

export default async function ModulePage({ params }: PageProps<"/modules/[id]">) {
  const { id } = await params;
  const idx = MODULES.findIndex((m) => m.id === id);
  if (idx < 0) notFound();
  const all = MODULES.map(({ id, num, short, accent, icon }) => ({ id, num, short, accent, icon }));
  return <ModuleView m={MODULES[idx]} prev={MODULES[idx - 1]} next={MODULES[idx + 1]} all={all} />;
}

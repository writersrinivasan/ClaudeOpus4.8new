import { Suspense } from "react";
import { AgentChat } from "@/components/AgentChat";

export const metadata = { title: "AI Coach · Opus 4.8 Lab" };

export default function AssistantPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-400">Loading coach…</div>}>
      <AgentChat />
    </Suspense>
  );
}

import { m1, m2, m3, m4 } from "./modules-a";
import { m5, m6, m7, m8 } from "./modules-b";
import type { IconName } from "./icons";
import type { UseCase } from "./types";

export const MODULES = [m1, m2, m3, m4, m5, m6, m7, m8];

export const getModule = (id: string) => MODULES.find((m) => m.id === id);

export const TOTAL_MINUTES = MODULES.reduce((s, m) => s + m.minutes, 0);

export const ALL_USE_CASES: (UseCase & { moduleId: string; moduleTitle: string; accent: string })[] =
  MODULES.flatMap((m) =>
    m.useCases.map((u) => ({ ...u, moduleId: m.id, moduleTitle: m.short, accent: m.accent })),
  );

export const PROJECT = {
  title: "Intelligent Business Analysis & Coding Assistant",
  subtitle: "The end-to-end build that threads through every module",
  features: [
    { icon: "MessageSquare" as IconName, text: "Accept business questions in natural language" },
    { icon: "FileSearch" as IconName, text: "Analyse business documents and datasets" },
    { icon: "FileText" as IconName, text: "Extract relevant information from documents" },
    { icon: "Activity" as IconName, text: "Identify trends, anomalies and insights" },
    { icon: "FileJson" as IconName, text: "Generate structured business reports" },
    { icon: "Wrench" as IconName, text: "Execute Python functions via tool calling" },
    { icon: "Target" as IconName, text: "Provide actionable recommendations" },
    { icon: "ShieldCheck" as IconName, text: "Validate responses against requirements" },
  ],
  exercises: [
    { n: 1, module: "m2", impl: "Experiment with Opus 4.8 using different instructions", out: "Comparative response analysis" },
    { n: 2, module: "m3", impl: "Design advanced system prompts", out: "Reusable prompt templates" },
    { n: 3, module: "m2", impl: "Analyse business documents and datasets", out: "Business insights and reports" },
    { n: 4, module: "m4", impl: "Explore Claude Code for application development", out: "Modified working application" },
    { n: 5, module: "m5", impl: "Integrate Opus 4.8 using the Anthropic API", out: "Working Python application" },
    { n: 6, module: "m6", impl: "Implement Python functions using tool calling", out: "Tool-enabled AI assistant" },
    { n: 7, module: "m7", impl: "Test and evaluate the application", out: "Validated AI application" },
  ],
  stack: [
    ["AI Model", "Claude Opus 4.8"],
    ["Language", "Python"],
    ["AI Integration", "Anthropic Python SDK"],
    ["API", "Anthropic Messages API"],
    ["Dev Environment", "VS Code / Google Colab"],
    ["Coding Assistant", "Claude Code"],
    ["Tools", "Python functions"],
    ["External Integration", "Model Context Protocol"],
    ["Data", "pandas"],
    ["Interface", "Streamlit"],
    ["Output", "JSON"],
  ],
  prerequisites: [
    "Basic Python programming",
    "Basic understanding of LLMs",
    "Familiarity with GenAI & prompt engineering",
    "Basic APIs & function calling",
    "Claude account with model access",
    "Anthropic API key",
    "Claude Code access",
    "VS Code or Google Colab",
    "pip install anthropic pandas streamlit",
  ],
};

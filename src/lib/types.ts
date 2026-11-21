import type { IconName } from "./icons";

export type Concept = {
  title: string;
  body: string;
  icon: IconName;
  points?: string[];
};

export type FlowStep = { label: string; desc: string; icon: IconName };

export type CodeSample = {
  title: string;
  lang: "python" | "bash" | "json" | "text" | "markdown" | "xml";
  code: string;
  note?: string;
};

export type Step = { title: string; detail: string; code?: CodeSample };

export type UseCase = {
  industry: string;
  title: string;
  problem: string;
  solution: string;
  impact: string;
  icon: IconName;
};

export type QuizQ = { q: string; options: string[]; answer: number; why: string };

export type Stat = { label: string; value: string; hint?: string };

export type Module = {
  id: string;
  num: number;
  title: string;
  short: string;
  minutes: number;
  icon: IconName;
  gradient: string; // tailwind gradient stops
  soft: string; // tailwind soft bg
  text: string; // tailwind text color
  ring: string; // tailwind ring/border color
  accent: string; // hex
  tagline: string;
  objectives: string[];
  stats?: Stat[];
  concepts: Concept[];
  flow: { title: string; steps: FlowStep[] };
  code: CodeSample[];
  handsOn: {
    title: string;
    goal: string;
    steps: Step[];
    expected: string;
  };
  useCases: UseCase[];
  quiz: QuizQ[];
  takeaways: string[];
};

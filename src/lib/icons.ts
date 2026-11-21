import {
  Activity, Bot, Boxes, Brain, BrainCircuit, Briefcase, Building2, Calculator, CheckCircle2,
  ClipboardCheck, Code, Compass, Cpu, Database, FileJson, FileSearch, FileText, Factory,
  Gauge, GitBranch, Globe, GraduationCap, HeartPulse, Image, KeyRound, Landmark, Layers,
  Lightbulb, ListChecks, Lock, MessageSquare, Monitor, Network, PenTool, Plug, Rocket,
  Route, Scale, Search, ShieldCheck, ShoppingCart, Sparkles, Target, Terminal, TestTube,
  Truck, Users, Wand2, Workflow, Wrench, Zap, Plane, Radio, BookOpen, FlaskConical,
} from "lucide-react";

export const ICONS = {
  Activity, Bot, Boxes, Brain, BrainCircuit, Briefcase, Building2, Calculator, CheckCircle2,
  ClipboardCheck, Code, Compass, Cpu, Database, FileJson, FileSearch, FileText, Factory,
  Gauge, GitBranch, Globe, GraduationCap, HeartPulse, Image, KeyRound, Landmark, Layers,
  Lightbulb, ListChecks, Lock, MessageSquare, Monitor, Network, PenTool, Plug, Rocket,
  Route, Scale, Search, ShieldCheck, ShoppingCart, Sparkles, Target, Terminal, TestTube,
  Truck, Users, Wand2, Workflow, Wrench, Zap, Plane, Radio, BookOpen, FlaskConical,
} as const;

export type IconName = keyof typeof ICONS;

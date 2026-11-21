import type { Module } from "./types";

export const m1: Module = {
  id: "m1",
  num: 1,
  title: "Introduction to Claude Opus 4.8",
  short: "Introduction",
  minutes: 5,
  icon: "Sparkles",
  gradient: "from-violet-500 via-fuchsia-500 to-pink-500",
  soft: "bg-violet-50",
  text: "text-violet-700",
  ring: "border-violet-200",
  accent: "#8b5cf6",
  tagline: "Meet the model: where Opus 4.8 sits in the Claude family and what it is built for.",
  objectives: [
    "Place Opus 4.8 within Anthropic's Haiku → Sonnet → Opus model family",
    "Know the headline capabilities: 1M context, 128K output, adaptive thinking, effort control",
    "Recognise the enterprise workloads where Opus-tier reasoning pays off",
  ],
  stats: [
    { label: "Context window", value: "1M", hint: "tokens of input" },
    { label: "Max output", value: "128K", hint: "tokens per response (stream it)" },
    { label: "Effort levels", value: "5", hint: "low → medium → high → xhigh → max" },
    { label: "Price / MTok", value: "$5 / $25", hint: "input / output" },
  ],
  concepts: [
    {
      title: "Anthropic & the Claude family",
      icon: "Layers",
      body: "Anthropic builds Claude as a family of models across speed/cost/intelligence tiers. Haiku is fastest and cheapest, Sonnet balances speed and capability, and Opus is the deep-reasoning tier for the hardest problems.",
      points: ["Haiku: high-volume, low-latency tasks", "Sonnet: everyday coding & enterprise work", "Opus: complex reasoning, long-horizon agents"],
    },
    {
      title: "What Opus 4.8 is (and isn't)",
      icon: "Cpu",
      body: "Anthropic does not publish internal architecture details. For builders the model is defined by its API surface: a 1M-token context window, up to 128K output tokens, adaptive thinking, five effort levels, tool use, vision and PDF input.",
      points: ["Model ID: claude-opus-4-8", "Same tokenizer as Opus 4.7", "Sampling params (temperature/top_p) are not accepted"],
    },
    {
      title: "Reasoning + agentic by design",
      icon: "BrainCircuit",
      body: "Opus 4.8 can think before answering (adaptive thinking) and can call tools in a loop — reading results, deciding the next step and continuing until the task is done. That loop is what makes it 'agentic'.",
    },
    {
      title: "Positioning in practice",
      icon: "Compass",
      body: "Reach for Opus when a mistake is expensive or the task is genuinely multi-step: architecture reviews, financial analysis, migration of large codebases, multi-document due diligence. For simple classification or chat, a smaller tier or lower effort is usually enough.",
    },
  ],
  flow: {
    title: "How a request flows through Opus 4.8",
    steps: [
      { label: "Prompt", desc: "System prompt + user message + documents", icon: "MessageSquare" },
      { label: "Adaptive thinking", desc: "Model decides how much to reason", icon: "Brain" },
      { label: "Tool calls", desc: "Optional: call your functions / MCP", icon: "Wrench" },
      { label: "Answer", desc: "Text, JSON or code back to your app", icon: "CheckCircle2" },
    ],
  },
  code: [
    {
      title: "Your first call to Opus 4.8 (Python)",
      lang: "python",
      code: `import anthropic

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from the environment

response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=16000,
    thinking={"type": "adaptive"},        # Opus 4.8 runs WITHOUT thinking unless you set this
    output_config={"effort": "high"},
    messages=[{
        "role": "user",
        "content": "Our SaaS churn rose from 3% to 5% in two quarters. "
                   "List the 5 most likely root causes and how to test each.",
    }],
)

for block in response.content:
    if block.type == "text":
        print(block.text)`,
      note: "On Opus 4.8 omitting `thinking` means no thinking — set {\"type\": \"adaptive\"} explicitly for complex work.",
    },
  ],
  handsOn: {
    title: "Explore Opus 4.8 with a complex business problem",
    goal: "Watch how the model decomposes an ambiguous, multi-factor business problem and judge its reasoning.",
    steps: [
      { title: "Open Claude", detail: "Sign in at claude.ai and select Claude Opus 4.8 in the model picker (or use the Python snippet with your API key)." },
      {
        title: "Paste the scenario",
        detail: "Use this deliberately messy prompt — it mixes facts, constraints and a decision.",
        code: {
          title: "Scenario prompt",
          lang: "text",
          code: `A mid-size logistics company (₹800 Cr revenue) is losing 2 key B2B clients
to a competitor offering 12% lower prices. Fuel costs are up 9%, driver attrition
is 31%, and on-time delivery fell from 94% to 87%. The board wants a 90-day plan.

1. Diagnose the problem (separate symptoms from causes).
2. Propose 3 strategic options with trade-offs.
3. Recommend one option and a 90-day plan with measurable KPIs.`,
        },
      },
      { title: "Inspect the reasoning", detail: "Check: did it separate symptoms from root causes? Did it quantify trade-offs? Did it state assumptions?" },
      { title: "Push back", detail: "Reply: 'Assume we cannot cut prices. Re-plan.' Observe how it revises without starting over." },
    ],
    expected: "A structured diagnosis, 3 options with trade-offs, and a 90-day plan with KPIs — plus a revised plan after your constraint.",
  },
  useCases: [
    { industry: "Banking", icon: "Landmark", title: "Credit memo drafting", problem: "Analysts spend days compiling credit memos from financials, covenants and news.", solution: "Opus 4.8 reads the full borrower pack (1M context) and drafts a memo with risks and covenant checks.", impact: "Draft time from 3 days → 3 hours, analyst reviews instead of writes" },
    { industry: "Manufacturing", icon: "Factory", title: "Root-cause analysis", problem: "Quality incidents span sensor logs, shift notes and maintenance tickets.", solution: "Model correlates the sources and ranks probable root causes with evidence.", impact: "Faster CAPA closure, fewer repeat defects" },
    { industry: "Retail", icon: "ShoppingCart", title: "Strategy war-room", problem: "Category managers need scenario analysis on pricing and promotions.", solution: "Opus reasons through scenarios and calls a pricing tool for numbers.", impact: "Decisions backed by explicit assumptions" },
  ],
  quiz: [
    { q: "What is Opus 4.8's context window?", options: ["200K tokens", "500K tokens", "1M tokens", "10M tokens"], answer: 2, why: "Opus 4.8 accepts up to 1M input tokens." },
    { q: "On Opus 4.8, what happens if you omit the `thinking` parameter?", options: ["Adaptive thinking runs by default", "The model runs without thinking", "The request fails", "Max effort is used"], answer: 1, why: "Opus 4.8/4.7 run without thinking unless you set thinking={\"type\": \"adaptive\"}." },
    { q: "Which tier is best for high-volume, latency-sensitive classification?", options: ["Opus", "Haiku", "None — use regex", "Always the largest model"], answer: 1, why: "Haiku is the fast, low-cost tier." },
  ],
  takeaways: [
    "Opus = the deep-reasoning tier; pick it when errors are expensive",
    "1M context + 128K output make whole-repo and whole-dataroom tasks possible",
    "Turn on adaptive thinking explicitly on Opus 4.8",
  ],
};

export const m2: Module = {
  id: "m2",
  num: 2,
  title: "Exploring Advanced Reasoning & Model Capabilities",
  short: "Advanced Reasoning",
  minutes: 7,
  icon: "Brain",
  gradient: "from-sky-500 via-blue-500 to-indigo-500",
  soft: "bg-sky-50",
  text: "text-sky-700",
  ring: "border-sky-200",
  accent: "#0ea5e9",
  tagline: "Adaptive thinking, effort control, long context, vision and precise instruction following.",
  objectives: [
    "Configure adaptive thinking and choose an effort level per task",
    "Feed large documents and images and get grounded analysis",
    "See how instruction precision changes output quality",
  ],
  stats: [
    { label: "Thinking mode", value: "Adaptive", hint: "model decides depth" },
    { label: "PDF pages", value: "600", hint: "per request (32 MB)" },
    { label: "Inputs", value: "Text · Image · PDF" },
  ],
  concepts: [
    {
      title: "Adaptive thinking",
      icon: "Brain",
      body: "With thinking={\"type\": \"adaptive\"} Claude decides when and how much to reason before responding. Easy questions get a quick answer; hard ones get deeper deliberation. The fixed `budget_tokens` setting from older models is removed on Opus 4.8.",
      points: ["Thinking is billed as output tokens", "display=\"summarized\" returns a readable summary", "Default display is \"omitted\" (empty thinking text)"],
    },
    {
      title: "Effort = depth dial",
      icon: "Gauge",
      body: "output_config.effort trades thoroughness for cost and latency: low → medium → high (default) → xhigh → max. Use low for subagents and simple tasks, high/xhigh for coding and agentic work, max only when correctness dominates cost.",
    },
    {
      title: "Long-context processing",
      icon: "FileSearch",
      body: "1M tokens fits hundreds of documents or a large codebase. Put long documents at the top, wrap each in XML tags with metadata, and ask your question at the end. Ask Claude to quote relevant passages first, then reason over them.",
    },
    {
      title: "Multimodal input",
      icon: "Image",
      body: "Send images (charts, screenshots, scanned invoices) and PDFs as content blocks. Claude reads tables, charts and layout, so you can ask 'what changed between Q2 and Q3 in this chart?'.",
    },
    {
      title: "Precise instruction following",
      icon: "Target",
      body: "Recent Opus models follow instructions literally. Say exactly what you want (audience, length, format, what to exclude). Vague prompts get generic answers; specific prompts get specific answers.",
    },
  ],
  flow: {
    title: "Choosing the right reasoning setup",
    steps: [
      { label: "Classify task", desc: "Simple lookup or multi-step analysis?", icon: "Route" },
      { label: "Set effort", desc: "low for simple · high/xhigh for complex", icon: "Gauge" },
      { label: "Attach context", desc: "Docs at top, question at bottom", icon: "FileText" },
      { label: "Ask for evidence", desc: "Quote sources, then conclude", icon: "Search" },
      { label: "Compare & tune", desc: "Measure quality vs. tokens", icon: "Activity" },
    ],
  },
  code: [
    {
      title: "Adaptive thinking with a visible summary",
      lang: "python",
      code: `response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=16000,
    thinking={"type": "adaptive", "display": "summarized"},
    output_config={"effort": "xhigh"},
    messages=[{"role": "user", "content": scenario}],
)

for block in response.content:
    if block.type == "thinking":
        print("🧠 THINKING SUMMARY:\\n", block.thinking)
    elif block.type == "text":
        print("✅ ANSWER:\\n", block.text)

print(response.usage)  # compare output_tokens across effort levels`,
    },
    {
      title: "Analyse a large PDF report",
      lang: "python",
      code: `import base64

with open("annual_report.pdf", "rb") as f:
    pdf_b64 = base64.standard_b64encode(f.read()).decode("utf-8")

response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    messages=[{
        "role": "user",
        "content": [
            {"type": "document",
             "source": {"type": "base64", "media_type": "application/pdf", "data": pdf_b64}},
            {"type": "text",
             "text": "First quote the 5 passages most relevant to revenue risk. "
                     "Then list key findings as bullets, each citing its page."},
        ],
    }],
)`,
      note: "Place the document block before the text question.",
    },
  ],
  handsOn: {
    title: "Compare instruction approaches on a large document",
    goal: "Run the same business document through three prompt styles and two effort levels; compare depth, accuracy and token cost.",
    steps: [
      { title: "Pick a document", detail: "Use any public annual report PDF (50–200 pages) or a long policy document." },
      { title: "Prompt A — vague", detail: "\"Summarise this.\" Note length, focus and usefulness." },
      { title: "Prompt B — specific", detail: "\"For a CFO audience, list the top 5 financial risks with page references, max 150 words.\"" },
      { title: "Prompt C — evidence-first", detail: "\"Quote the relevant passages inside <quotes> tags, then give findings in <findings> tags.\"" },
      { title: "Vary effort", detail: "Run Prompt C at effort=\"low\" and effort=\"high\". Record usage.output_tokens and quality (1–5)." },
    ],
    expected: "A comparison table: prompt style × effort → quality score, tokens, and whether findings were grounded in quotes.",
  },
  useCases: [
    { industry: "Insurance", icon: "ShieldCheck", title: "Claims document review", problem: "Claims include photos, PDFs and adjuster notes.", solution: "Multimodal input: damage photos + policy PDF → coverage assessment with clause references.", impact: "Faster triage, consistent decisions" },
    { industry: "Legal", icon: "Scale", title: "Contract comparison", problem: "Comparing 40 vendor contracts against a playbook.", solution: "All contracts in one 1M-token context; model flags deviations with quotes.", impact: "Weeks → hours for redline prep" },
    { industry: "Energy", icon: "Zap", title: "Engineering drawing Q&A", problem: "Field engineers need answers from schematics and manuals.", solution: "Image + manual input; Claude answers with page citations.", impact: "Reduced downtime" },
  ],
  quiz: [
    { q: "Which effort level is the default?", options: ["low", "medium", "high", "max"], answer: 2, why: "Effort defaults to high on Opus 4.8." },
    { q: "Best placement for long documents in a prompt?", options: ["After the question", "At the top, question at the end", "In the system prompt only", "Split across many messages"], answer: 1, why: "Long-context prompts work best with docs first, query last." },
    { q: "What replaced `budget_tokens` on Opus 4.8?", options: ["temperature", "Adaptive thinking + effort", "top_k", "Nothing"], answer: 1, why: "budget_tokens is rejected; use adaptive thinking with output_config.effort." },
  ],
  takeaways: [
    "Adaptive thinking + effort is the reasoning control surface",
    "Evidence-first prompts reduce hallucination on long docs",
    "Specific instructions beat clever instructions",
  ],
};

export const m3: Module = {
  id: "m3",
  num: 3,
  title: "Advanced Prompt Engineering with Claude",
  short: "Prompt Engineering",
  minutes: 8,
  icon: "PenTool",
  gradient: "from-amber-400 via-orange-500 to-red-500",
  soft: "bg-amber-50",
  text: "text-amber-700",
  ring: "border-amber-200",
  accent: "#f59e0b",
  tagline: "System prompts, roles, XML structure, decomposition and guaranteed JSON outputs.",
  objectives: [
    "Write a reusable, role-based system prompt",
    "Structure complex prompts with XML tags",
    "Get schema-valid JSON with structured outputs",
  ],
  concepts: [
    { title: "System prompts", icon: "Users", body: "The system prompt sets role, audience, constraints and output style for the whole conversation. Keep it stable (it caches well) and put per-request data in the user message." },
    { title: "Role + context", icon: "Briefcase", body: "Give Claude a concrete role and the context a human expert would need: who the audience is, what decision is being made, what 'good' looks like. Explain the why behind constraints — the model generalises from reasons." },
    { title: "XML tags", icon: "Code", body: "Separate instructions, data and examples with tags like <document>, <instructions>, <example>, <output_format>. Ask for output in tags too, which makes parsing trivial.", points: ["Consistent tag names", "Nest for hierarchy", "Refer to tags by name in instructions"] },
    { title: "Task decomposition", icon: "GitBranch", body: "Split big jobs into a chain: extract → analyse → recommend → format. Each step gets a focused prompt and its output feeds the next. Easier to debug and evaluate." },
    { title: "Structured outputs", icon: "FileJson", body: "output_config.format with a JSON schema guarantees valid JSON matching your schema. Assistant-message prefill is not supported on Opus 4.8 — use structured outputs or tags instead." },
    { title: "Refine & optimise", icon: "Wand2", body: "Treat prompts like code: version them, test against a small set of inputs, change one thing at a time, and keep what measurably improves results." },
  ],
  flow: {
    title: "Anatomy of a production prompt",
    steps: [
      { label: "Role", desc: "Who Claude is & for whom", icon: "Users" },
      { label: "Context", desc: "<document> data & background", icon: "FileText" },
      { label: "Task", desc: "<instructions> numbered steps", icon: "ListChecks" },
      { label: "Examples", desc: "<example> 1–3 good outputs", icon: "Lightbulb" },
      { label: "Format", desc: "JSON schema or tags", icon: "FileJson" },
    ],
  },
  code: [
    {
      title: "Reusable Business-Analyst system prompt",
      lang: "xml",
      code: `You are a senior enterprise business analyst advising {{company}}'s leadership team.
Your readers are executives who decide in minutes, so lead with the conclusion.

<principles>
- Separate facts (from the supplied data) from assumptions; label assumptions.
- Quantify impact whenever data allows; show the calculation.
- If the data cannot answer the question, say so and state what data is needed.
</principles>

<output_format>
<executive_summary> 3 sentences max </executive_summary>
<key_findings> numbered, each with evidence </key_findings>
<risks> top 3 with likelihood and impact </risks>
<recommendations> actionable, owner + timeline </recommendations>
</output_format>`,
    },
    {
      title: "Guaranteed JSON with structured outputs",
      lang: "python",
      code: `import json

schema = {
    "type": "object",
    "properties": {
        "summary": {"type": "string"},
        "findings": {"type": "array", "items": {"type": "string"}},
        "risk_level": {"type": "string", "enum": ["low", "medium", "high"]},
        "recommendations": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["summary", "findings", "risk_level", "recommendations"],
    "additionalProperties": False,
}

response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=16000,
    system=BA_SYSTEM_PROMPT,
    output_config={"format": {"type": "json_schema", "schema": schema}},
    messages=[{"role": "user", "content": f"<data>{csv_text}</data>\\nAnalyse Q3 sales."}],
)
report = json.loads(next(b.text for b in response.content if b.type == "text"))`,
    },
  ],
  handsOn: {
    title: "Design a reusable enterprise BA system prompt",
    goal: "Build a parameterised system prompt and use it to produce a structured business analysis report.",
    steps: [
      { title: "Start from the template", detail: "Copy the Business-Analyst system prompt; replace {{company}} with a real or fictional company." },
      { title: "Add domain context", detail: "Add a <domain> block: industry, KPIs that matter, fiscal calendar, currency." },
      { title: "Add one example", detail: "Inside <example>, paste a short ideal report so Claude learns tone and depth." },
      { title: "Run with data", detail: "Send a small sales CSV in <data> tags and ask for the Q3 analysis." },
      { title: "Switch to JSON", detail: "Add the structured-output schema and confirm the result parses with json.loads." },
      { title: "Refine", detail: "Change one instruction at a time; keep a log of what improved the output." },
    ],
    expected: "A versioned prompt template (prompt_v1.txt, v2…) and a structured report in both XML-tag and JSON form.",
  },
  useCases: [
    { industry: "Consulting", icon: "Briefcase", title: "Standardised deliverables", problem: "Every consultant formats analyses differently.", solution: "A shared system prompt + JSON schema enforce one house style.", impact: "Consistent quality, reviewable outputs" },
    { industry: "HR", icon: "Users", title: "Policy Q&A bot", problem: "Employees ask repetitive policy questions.", solution: "Role prompt + <policy> docs + 'cite the clause' rule.", impact: "Fewer HR tickets" },
    { industry: "E-commerce", icon: "ShoppingCart", title: "Catalogue enrichment", problem: "Thousands of SKUs lack attributes.", solution: "Structured outputs extract attributes into a strict schema.", impact: "Clean data at scale" },
  ],
  quiz: [
    { q: "Why use XML tags in prompts?", options: ["Claude requires them", "To separate instructions, data and examples clearly", "They reduce price", "To enable tools"], answer: 1, why: "Tags give unambiguous structure and easy parsing." },
    { q: "How do you guarantee schema-valid JSON on Opus 4.8?", options: ["Prefill '{'", "output_config.format with a JSON schema", "Set temperature=0", "Ask nicely"], answer: 1, why: "Prefill is unsupported; structured outputs guarantee the schema." },
    { q: "Where should per-request data go?", options: ["System prompt", "User message", "Model name", "Headers"], answer: 1, why: "Keep the system prompt stable; vary data in user turns." },
  ],
  takeaways: ["Role + context + why beats terse commands", "XML tags for structure, JSON schema for machines", "Version and test prompts like code"],
};

export const m4: Module = {
  id: "m4",
  num: 4,
  title: "Claude Code & AI-Assisted Software Development",
  short: "Claude Code",
  minutes: 10,
  icon: "Terminal",
  gradient: "from-emerald-400 via-teal-500 to-cyan-600",
  soft: "bg-emerald-50",
  text: "text-emerald-700",
  ring: "border-emerald-200",
  accent: "#10b981",
  tagline: "An agentic coding partner in your terminal and IDE: explore, fix, refactor and test.",
  objectives: [
    "Install Claude Code and connect it to VS Code",
    "Use it to explore an unfamiliar codebase",
    "Debug, refactor and test a Python app with an agentic workflow",
  ],
  concepts: [
    { title: "What Claude Code is", icon: "Terminal", body: "Claude Code is Anthropic's agentic coding tool. It runs in your terminal, VS Code/JetBrains, desktop app or web, reads your files, runs commands, edits code and iterates until tests pass — always within the permissions you grant." },
    { title: "Agentic coding loop", icon: "Workflow", body: "Gather context → plan → act (edit/run) → verify (tests, lint) → repeat. You can watch, approve each step, or let it work in auto mode for trusted tasks." },
    { title: "Connect to your environment", icon: "Plug", body: "Install the CLI, open your project folder and run `claude`. Install the VS Code extension for inline diffs. Add MCP servers to give it access to databases, issue trackers or docs." },
    { title: "Codebase exploration", icon: "FileSearch", body: "Ask: 'Explain the architecture', 'Where is auth handled?', 'Trace a request from API to DB'. Run /init to create a CLAUDE.md that records project conventions for future sessions." },
    { title: "Debug & refactor", icon: "Wrench", body: "Paste the stack trace or describe the symptom. Claude reproduces, finds root cause, fixes, and adds a regression test. For refactors, use plan mode to agree on the approach before edits." },
    { title: "Autonomous workflows", icon: "Rocket", body: "Headless mode (`claude -p`) runs Claude Code in scripts and CI: auto-fix lint, triage issues, generate release notes. Subagents can parallelise exploration." },
  ],
  flow: {
    title: "Claude Code agentic loop",
    steps: [
      { label: "Explore", desc: "Read files, grep, map architecture", icon: "Search" },
      { label: "Plan", desc: "Propose changes (plan mode)", icon: "ListChecks" },
      { label: "Edit", desc: "Make focused diffs", icon: "Code" },
      { label: "Run & test", desc: "pytest, lint, run app", icon: "TestTube" },
      { label: "Commit", desc: "Review diff, commit/PR", icon: "GitBranch" },
    ],
  },
  code: [
    {
      title: "Install & launch",
      lang: "bash",
      code: `# macOS / Linux native installer (see code.claude.com/docs for Windows & other options)
curl -fsSL https://claude.ai/install.sh | bash

cd sales-app
claude                # start an interactive session in this project
# inside the session:
/init                 # generate CLAUDE.md with project conventions
# Shift+Tab cycles permission modes (incl. plan mode)

# headless / CI usage
claude -p "Run pytest and fix any failing tests" --allowedTools "Bash,Edit,Read"`,
    },
    {
      title: "Buggy starter app — sales_report.py",
      lang: "python",
      code: `import pandas as pd

def load(path):
    return pd.read_csv(path)

def growth(curr, prev):
    return (curr - prev) / prev * 100          # BUG: crashes / inf when prev == 0

def region_summary(df):
    out = df.groupby("region")["revenue"].sum   # BUG: missing ()
    return out.sort_values()                     # BUG: should be descending

def top_products(df, n=5):
    return df.nlargest(n + 1, "revenue")         # BUG: off-by-one

if __name__ == "__main__":
    df = load("sales.csv")
    print(region_summary(df))
    print(top_products(df))
    print(growth(df.revenue.sum(), 0))`,
      note: "Use this file in the hands-on exercise — there are 4 planted bugs.",
    },
  ],
  handsOn: {
    title: "Analyse, fix and test an existing Python app",
    goal: "Use Claude Code to find the planted bugs in sales_report.py, fix them, add tests and a new feature.",
    steps: [
      { title: "Set up", detail: "Create a folder with sales_report.py (above) and a small sales.csv (date, region, product, revenue). Run `claude` inside it." },
      { title: "Explore", detail: "Prompt: 'Explain what this app does and list every bug or risk you see, with line numbers.'" },
      { title: "Plan the fix", detail: "Switch to plan mode (Shift+Tab). Prompt: 'Plan fixes for all bugs plus pytest tests for each function.' Review the plan." },
      { title: "Implement", detail: "Approve the plan. Watch Claude edit files and run `pytest`. Ask it to iterate until all tests pass." },
      { title: "Add a feature", detail: "Prompt: 'Add a month-over-month growth function and a CLI flag --region to filter.'" },
      { title: "Review", detail: "Read the final diff. Ask: 'What edge cases are still untested?'" },
    ],
    expected: "A fixed sales_report.py, a passing test_sales_report.py, and a new MoM-growth feature — all reviewed by you.",
  },
  useCases: [
    { industry: "FinTech", icon: "Landmark", title: "Legacy migration", problem: "A 200K-line Python 2 codebase must move to Python 3.12.", solution: "Claude Code migrates module by module, running tests after each step.", impact: "Months → weeks" },
    { industry: "SaaS", icon: "Globe", title: "CI auto-fix", problem: "Flaky lint & type errors block merges.", solution: "Headless `claude -p` job fixes lint/type errors and opens a PR.", impact: "Higher merge velocity" },
    { industry: "Telecom", icon: "Radio", title: "Onboarding new engineers", problem: "New hires take weeks to understand services.", solution: "Claude Code answers architecture questions grounded in the actual repo.", impact: "Faster ramp-up" },
  ],
  quiz: [
    { q: "What does /init do?", options: ["Installs Python", "Creates CLAUDE.md with project conventions", "Deletes history", "Starts a server"], answer: 1, why: "/init writes a CLAUDE.md memory file for the project." },
    { q: "Which mode lets you review the approach before edits?", options: ["Plan mode", "Fast mode", "Batch mode", "Silent mode"], answer: 0, why: "Plan mode proposes changes without editing." },
    { q: "How do you run Claude Code in CI?", options: ["You can't", "claude -p (headless)", "Only via the web UI", "Through Excel"], answer: 1, why: "-p runs a single non-interactive prompt." },
  ],
  takeaways: ["Explore → plan → edit → test is the core loop", "CLAUDE.md captures project memory", "You stay in control via permissions and diff review"],
};

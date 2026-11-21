# Opus 4.8 Lab

An interactive, colourful workshop companion for **Claude Opus 4.8**, built with Next.js 16.

- **Learn side**: concept cards, infographic flows, key stats and takeaways for all 8 modules
- **Practice side**: step-by-step hands-on labs with progress tracking, runnable Python (Anthropic SDK, pandas, Streamlit), industry use cases and quizzes
- **Capstone project**: the Business Analysis & Coding Assistant, with an architecture infographic and an exercise timeline
- **AI Coach**: an agentic **LangGraph** workflow running on **Groq** with **bring-your-own-key**

## Run

```bash
npm install
npm run dev          # http://localhost:3000
```

Click **Add Groq key** (top right) and paste a key from https://console.groq.com/keys.
The key is kept in your browser's localStorage and sent per request to `/api/agent`. The server never stores or logs it.

## Agent workflow (`src/lib/agent/`)

```
START → Router ─→ Retriever ─┬─(needs tools)→ Tool Agent ─┐
                             └─(direct)──────────────────→ Specialist → Reviewer ─(pass)→ END
                                                              ↑            │
                                                              └─(revise ×1)┘
```

| Node | Job |
|---|---|
| Router | LLM classifies intent (concept · handson · usecase · code · quiz) and whether tools are needed |
| Retriever | Keyword RAG over the workshop syllabus (`knowledge.ts`) |
| Tool Agent | Function-calling loop: `calculator`, `estimate_claude_cost`, `kpi_growth`, `lookup_workshop_module` |
| Specialist | The persona chosen by intent writes a grounded markdown answer that cites modules |
| Reviewer | LLM-as-judge scores grounding and correctness, and can send the answer back for one revision |

Node events stream to the browser over SSE, and the React Flow graph lights up live.

## Test

```bash
npx tsx scripts/test-agent.ts   # offline graph test with a scripted fake LLM (no key needed)
npm run build
```

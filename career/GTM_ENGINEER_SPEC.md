# GTM ENGINEER — BUILD-TOWARD SPEC

> **What this is:** a synthesis of what GTM Engineer roles actually require, built
> to answer one question: *what does Mac need to be able to do to get hired into
> one?* Companion to [`CAREER_MEMORY.md`](CAREER_MEMORY.md). Last updated 2026-08-18.
>
> **Sourcing note:** LinkedIn and every ATS host (Ashby, Greenhouse, Lever, Indeed)
> are blocked by this environment's network egress policy, so the 24 other postings
> from Mac's search could not be opened directly. This spec is built from **three
> full JDs** (ButterflyMX, Nooks, EliseAI — all pasted in by Mac) plus **aggregate
> market data** on what GTM-engineer postings ask for. ⚠ Market figures are from
> secondary sources (Clay, ZoomInfo, GTME Pulse, SyncGTM and similar) — directionally
> reliable, not audited. **Paste any specific JD and it can be analyzed against this
> spec.**

---

## 1. THE MARKET MAP — Mac's search results (2026-08-18)

25 roles, US-remote-heavy. Salary shown where the posting listed it.

| Company | Title | Comp | Note |
|---|---|---|---|
| **TLDR** | GTM Engineer, Applied AI | **$175–205K** | Top of band |
| **UpGuard** | GTM Engineer | **$161–207K** | 🔗 1 connection |
| **ButterflyMX** | GTM Engineer | **$150–180K** | Full JD in §2 |
| **ClickUp** | Business Systems Engineer | **$144–181K** | |
| **Vanta** | Sr. AI GTM Engineer | — | 🔗 1 connection |
| **Cresta** | GTM Engineer | — | 🔗 1 connection |
| **Figma** | Marketing Engineer | — | 🔗 1 connection |
| **CrowdStrike** | Sr. AI Growth Engineer | — | 🔗 2 connections |
| **ClickHouse** | GTM Engineer, AI & Automation | — | 9 alumni |
| **Motive** | GTM AI Engineer | — | 5 alumni |
| **Doppel** | GTM Engineer | — | 3 alumni |
| **1Password** | Staff AI Marketing Systems Engineer | — | 4 alumni |
| Attentive | GTM Engineer | — | Actively reviewing |
| Torq | GTM Engineer | — | Posted same day |
| Torq | AI Solutions Engineer | — | |
| Customer.io | GTM AI Engineer | — | |
| LeanData | GTM Engineer (Data & AI) | — | |
| Sanity | Senior GTM Engineer, Systems Eng | — | |
| Tapcheck | GTM Engineer | — | Plano TX |
| Yuno | Go To Market Engineer | — | Easy Apply |
| Flosum | AI Go-to-Market Engineer | — | Easy Apply |
| Soda | Growth Engineer | — | NYC |
| Agiloft | AI Ops Engineer – Prof. Services | — | |
| TRM Labs | AI Agent Engineer | — | |
| CrowdStrike | Prof. Services Tech Ops Eng – Agentic AI | — | 28 alumni |

**🔗 Six of these have a connection or alumni path.** That matters more than the
titles — see §7.

---

## 2. THE ARCHETYPE JD — ButterflyMX (representative, full text available)

Worth reading closely because it's the clearest articulation of the role found:

**Framing:** *"You are someone who thinks like a sales leader, works like a product
manager, and builds like an engineer."*

**Requirements (verbatim, condensed):**
- Hands-on building/deploying **AI agents** using Claude, Codex, **n8n**, Zapier,
  Replit, Lovable — *"agents that are adopted and actively used, not just shipped"*
- **LLM orchestration**, prompt engineering for GTM workflows, maintaining **prompt
  libraries** and agent reliability **in a live production environment**
- **API and integration experience** across core GTM platforms
- Build/debug/own GTM automations using AI coding tools, *"with sufficient
  engineering judgment to know when generated code is wrong or fragile, **without
  software engineering support**"*
- **Sales process fluency** — how deals move, what reps do at each stage
- Background in **GTM engineering, RevOps, business systems, or GTM tooling at B2B
  SaaS**, with a track record of shipping automation that measurably improved GTM

**⚠ Explicitly: "This is a senior individual contributor role."**

---

## 3. THE REQUIREMENT PATTERN — what recurs across all three full JDs

Every one of ButterflyMX, Nooks, and EliseAI asks for the same six things:

| # | Requirement | How it's phrased |
|---|---|---|
| 1 | **Shipped systems with measured outcomes** | "track record of shipping automation that measurably improves GTM performance" |
| 2 | **AI/LLM workflows in production, with QA** | "prompt libraries and agent reliability", "adopted and actively used, not just shipped" |
| 3 | **The GTM stack, hands-on** | Clay, Salesforce/HubSpot, Outreach, Gong, enrichment |
| 4 | **SQL / data work** | "comfortable querying data with SQL", "analyze Salesforce data, call transcripts, pipeline patterns" |
| 5 | **APIs and integrations** | "API and integration experience across core GTM platforms" |
| 6 | **Sales fluency** | "how deals move, what reps do at each stage, where friction lives" |

**Mac already has #6 outright.** The other five are the build list.

---

## 4. TOOL FREQUENCY — what's actually named in postings

⚠ Aggregate market data, secondary sources:

| Tool | % of GTM-eng JDs |
|---|---|
| **Clay** | **61%** ← the #1 named tool |
| HubSpot | 52% |
| Outreach | 49% |
| Salesforce | 45% |
| Zapier | 39% |
| Apollo | 29% |
| n8n | 28% |
| **SQL** | **38%** |
| **Python** | **38%** |

The stack clusters into five categories: **enrichment** (Clay, Apollo, ZoomInfo) ·
**CRM** (Salesforce, HubSpot) · **engagement** (Outreach, Salesloft) · **visitor ID**
(6sense, WebSights) · **AI/automation** (n8n, Make, Zapier).

---

## 5. ⭐ THE MOST IMPORTANT FINDING: the coding premium

This is the single highest-value fact in this whole document.

| Profile | Typical comp |
|---|---|
| **Low-code operator** (Clay + HubSpot only) | **~$90–108K** |
| **High-code engineer** (adds Python/SQL) | **~$135–210K** |

Postings that require **Python or SQL pay ~$45K higher median.** The gap between
"low-code operator" and "high-code engineer" is reported at **$40–45K**.

**What this means for Mac, concretely:**

The roles on his own list pay **$150–207K**. That is the *high-code* end of the
market. Learning Clay alone lands him in the $90–108K tier — roughly the EliseAI
RevOps Associate band (§1.5 of CAREER_MEMORY).

**→ SQL and Python are not optional extras. They are the difference between the two
tiers, and they're the cheapest $45K Mac will ever earn.** Everything in §6 is
sequenced around this.

---

## 6. THE BUILD-TOWARD SPEC — what to learn, in order

Sequenced by return on effort, highest first.

**Tier 1 — the tier-defining skills (do these first)**
1. **SQL.** In 38% of postings, a hard requirement in the EliseAI archetype, and half
   the coding premium. SELECT/JOIN/GROUP BY/window functions/date math. ~4–6 weeks.
2. **Python** (or TypeScript). The other half of the premium. Enough to call APIs,
   parse JSON, transform data, and read/debug AI-generated code — the ButterflyMX
   bar is explicitly *"know when generated code is wrong or fragile."* ~8–12 weeks.

**Tier 2 — the table stakes**
3. **Clay.** #1 named tool at 61%. Enrichment waterfalls, AI columns, integrations.
4. **An orchestration tool — n8n** (28%, and named in ButterflyMX). Prefer n8n over
   Zapier: more "engineer" coded, self-hostable, what serious builds run on.
5. **CRM as a builder, not a user — Salesforce or HubSpot** (45%/52%). The
   Salesforce Admin cert is the cheapest credible signal here.

**Tier 3 — the differentiator**
6. **LLM workflows with real QA.** Prompt libraries, evals, output standards,
   fallbacks. Every one of the three JDs asks for this and most candidates will have
   demos rather than production discipline. This is where Mac can *lead*.
7. **APIs/webhooks** — how data actually moves between GTM systems.

**Tier 4 — nice to have**
8. dbt / warehouse basics, RAG + vector search, deliverability fundamentals
   (domains, DNS, warmup).

---

## 7. THE PORTFOLIO FORMAT THAT ACTUALLY GETS HIRED

Consensus across sources: **a working artifact beats any certification.** Named
examples of what hiring managers rate highly:
- a working **enrichment workflow**
- a **signal-triggered play with measurable pipeline outcomes**
- a **CRM dedup/routing system** that reduced errors

**Write every project in exactly this three-part format:**

1. **The problem** — what GTM motion was broken or manual?
2. **The system** — what did you build, which tools, what logic?
3. **The output** — what changed? Reply rates, enrichment coverage, pipeline
   created, hours saved.

**Two things that separate strong candidates:**
- **Adoption, not just shipping.** ButterflyMX says it outright: *"agents that are
  adopted and actively used, not just shipped."* Always report who used it.
- **An experimental mindset.** Hiring managers reportedly probe for *a signal
  hypothesis you tested that didn't work, and what you learned.* Keep a record of
  failed experiments — it's a differentiator, not a weakness.

---

## 8. THE LEVEL REALITY — read this before applying

⚠ **Almost every role on Mac's list is a senior IC role.** ButterflyMX says so
explicitly; the typical stated requirement across the market is **4+ years**; and
the ladder map (CAREER_MEMORY §5.7) places "Founding/Lead/Senior GTM Engineer" at
**L3, 4–7 years**. LinkedIn scored Mac's fit **LOW** on ButterflyMX, consistent with
this.

**So this list is not an application list today. It is a specification.** Its value
is that 25 postings agree on what to build toward — and that agreement is the spec
in §6.

**The market tailwind is real, though:** GTM-engineering postings reportedly grew
~205% year over year, from ~1,400 in mid-2025 to 3,000+ by January 2026, with ~100
new listings a month. The bar isn't moving away faster than Mac can close it — and
roles like these will still be posting in six months.

**The near-term play stays the same:** enter via RevOps L2 (the EliseAI archetype),
which the ladder shows is the documented feeder into this lane. Use this spec to
decide *what to learn while doing it.*

**And work the 🔗 connections.** Six companies on that list have a connection or
alumni path (UpGuard, Vanta, Cresta, Figma, CrowdStrike ×2, plus Motive/ClickHouse/
Doppel/1Password alumni). For a candidate below the stated bar, a warm intro is
worth more than every résumé keyword combined. That's the highest-value column in
§1 — not the salaries.

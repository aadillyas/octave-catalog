#!/usr/bin/env python3
"""
Octave Product Catalog – Use Case Schema Generator v2
------------------------------------------------------
Drops in a solution blueprint + pilot results document and auto-generates:

  /schema
    input.md                – Data sources and ingestion requirements
    input_diagram.svg       – Visual data flow diagram for the input layer
    model.md                – How the analytical solution works (client-facing)
    model_diagram.svg       – Visual architecture diagram of the model
    output.md               – Outputs, interventions, and proven results
    output_diagram.svg      – Visual flow from model output to business action
    metadata.md             – Classification, complexity, ROI, deployment metadata

  /source
    feasibility_checklist.md – Auto-generated client self-assessment checklist

Usage:
  export ANTHROPIC_API_KEY=your_key_here

  python generate_use_case.py \
    --blueprint path/to/blueprint.pptx \
    --pilot     path/to/pilot_results.pptx \
    --use-case  "Chiller Optimization" \
    --industry  "Leisure" \
    --value-chain "Property Operations" \
    --output-dir  path/to/output/folder
"""

import os
import json
import re
import argparse
import subprocess
from pathlib import Path
from datetime import date
import urllib.request

# ── API config ────────────────────────────────────────────────────────────────
ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"
MODEL = "claude-sonnet-4-20250514"

# ── Brand tokens baked into every SVG ────────────────────────────────────────
BRAND = {
    "pink":    "#E82AAE",
    "teal":    "#26EA9F",
    "bg":      "#111115",
    "bg2":     "#16161C",
    "border":  "#2A2A35",
    "text":    "#F0F0F5",
    "muted":   "#7A7A8C",
    "dim":     "#3A3A4A",
}

SVG_STYLE_GUIDE = f"""
OCTAVE BRAND & SVG RULES — follow these exactly, no exceptions:

Canvas:
- Width: 900, Height: 420 (use viewBox="0 0 900 420")
- Background rect filling entire canvas: fill="{BRAND['bg']}"
- All shapes must sit within 24px padding from canvas edges

Colors (use ONLY these):
- Node backgrounds:        {BRAND['bg2']}
- Node borders/strokes:    {BRAND['border']}
- Primary accent (arrows, active borders, highlights): {BRAND['pink']}
- Success / output accent: {BRAND['teal']}
- Body text:               {BRAND['text']}
- Secondary / label text:  {BRAND['muted']}
- Faint dividers:          {BRAND['dim']}

Typography (embed as SVG text elements — no external fonts):
- Title labels:   font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="{BRAND['text']}"
- Body labels:    font-family="system-ui, sans-serif" font-size="11" font-weight="400" fill="{BRAND['muted']}"
- Accent labels:  font-family="system-ui, sans-serif" font-size="10" font-weight="700" fill="{BRAND['pink']}" letter-spacing="1"

Shapes:
- Data source nodes:     rounded rect (rx="8") with stroke="{BRAND['border']}" stroke-width="1.5"
- Process / model nodes: rounded rect (rx="12") with stroke="{BRAND['pink']}" stroke-width="1.5"
- Output nodes:          rounded rect (rx="8") with stroke="{BRAND['teal']}" stroke-width="1.5"
- Arrows:                path with marker-end, stroke="{BRAND['border']}" stroke-width="1.5", no fill
- Active / highlight arrows: stroke="{BRAND['pink']}"

Layout:
- Left-to-right flow for linear processes
- Consistent vertical centering
- Minimum 48px gap between node columns
- Node widths: 160–200px, heights: 56–80px depending on label length
- Multi-line text: use <tspan dy="16"> for each line
- No gradients, no drop shadows, no decorative elements
- No clipPath unless absolutely necessary

Output rules:
- Return ONLY the raw SVG — no markdown fences, no commentary, no preamble
- Must be valid, self-contained SVG that renders correctly in a browser
- Include xmlns="http://www.w3.org/2000/svg" on the root element
- Define arrowhead marker in <defs> and reuse it
"""


# ── Claude caller ─────────────────────────────────────────────────────────────
def call_claude(system_prompt: str, user_content: str, max_tokens: int = 4096) -> str:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError(
            "ANTHROPIC_API_KEY environment variable not set.\n"
            "Export it before running: export ANTHROPIC_API_KEY=your_key_here"
        )
    payload = json.dumps({
        "model": MODEL,
        "max_tokens": max_tokens,
        "system": system_prompt,
        "messages": [{"role": "user", "content": user_content}],
    }).encode("utf-8")

    req = urllib.request.Request(
        ANTHROPIC_API_URL,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
        },
        method="POST",
    )
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        return data["content"][0]["text"]


def extract_svg(raw: str) -> str:
    """Strip any accidental markdown fences and return clean SVG."""
    raw = re.sub(r"```[a-z]*\n?", "", raw).strip()
    # Ensure it starts with <svg
    idx = raw.find("<svg")
    if idx > 0:
        raw = raw[idx:]
    return raw


# ── Document text extraction ──────────────────────────────────────────────────
def extract_text(filepath: str) -> str:
    result = subprocess.run(
        ["python", "-m", "markitdown", filepath],
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(f"Failed to extract text from {filepath}: {result.stderr}")
    return result.stdout.strip()


# ── Shared writing system prompt ──────────────────────────────────────────────
WRITING_SYSTEM_PROMPT = """You are a senior analytics consultant at Octave, a data science and analytics firm.
Your job is to take internal project documentation and transform it into clear, compelling content
for an external product catalog aimed at prospective clients.

CRITICAL WRITING PRINCIPLES:
1. Write for a business audience that understands their own industry problem but may have NO technical
   data science or analytics background. Never assume they know what a regression model, gradient
   boosting, IQR, or any technical term means without explaining it plainly.
2. Avoid internal jargon, client-specific names (e.g. "CBB", "Cinnamon Hotels"), or references that
   only make sense in the original project context. Generalise to the industry.
3. Every section should answer the implicit client question: "Is this relevant to me and can I do this?"
4. Be specific and concrete — vague statements like "data-driven insights" add no value. Explain
   exactly what data is used, what the model does in plain English, and what action the business takes.
5. Proven outcomes should be stated clearly with real numbers where available, framed as
   "in a real deployment" rather than as guarantees.
6. Tone: confident, clear, consultative. Not salesy. Not overly technical. Think "smart explainer".

OUTPUT FORMAT:
- Use clean markdown with headers and bullet points where appropriate
- Do not include any preamble or commentary outside the requested content
- Do not refer to the source documents or the client by name"""


SVG_SYSTEM_PROMPT = f"""You are a technical SVG diagram creator for Octave, an analytics firm.
You create clean, precise SVG diagrams that visualise data flows and model architectures
for a client-facing product catalog.

{SVG_STYLE_GUIDE}"""


# ── Text generators ───────────────────────────────────────────────────────────

def generate_input(blueprint: str, pilot: str, use_case: str, industry: str) -> str:
    prompt = f"""Based on the following internal project documents for the use case "{use_case}" in the {industry} industry,
generate the INPUT section for the Octave Product Catalog.

The INPUT section must cover:
1. **What data is needed** – List all data sources required. For each, explain in plain English what it is
   and why it matters for this use case. Assume the client may not know the acronym or system name.
2. **How the data connects** – Briefly explain how these data sources relate to each other and feed into the solution.
3. **Data history required** – How much historical data is needed and why.
4. **Typical data availability** – Is this data that most businesses in this industry would already have,
   or does it require new instrumentation/setup? Be honest about this.
5. **Data quality notes** – Any important caveats about data quality or completeness that affect the solution.

Write this so a Head of Operations or a CFO could read it and immediately understand
what data they would need to provide, without needing a data team to translate it.

---
SOLUTION BLUEPRINT:
{blueprint}

---
PILOT RESULTS:
{pilot}
"""
    return call_claude(WRITING_SYSTEM_PROMPT, prompt)


def generate_model(blueprint: str, pilot: str, use_case: str, industry: str) -> str:
    prompt = f"""Based on the following internal project documents for the use case "{use_case}" in the {industry} industry,
generate the MODEL section for the Octave Product Catalog.

The MODEL section must cover:
1. **What the solution does** – Explain the analytical approach in plain English. No jargon.
   If you must use a technical term, explain it immediately in brackets.
2. **How it works step by step** – Walk through the key stages of the solution logically.
   Use an analogy if it helps make it concrete.
3. **What makes it smart** – Explain the key intelligence in the model — what it learns,
   what guardrails are built in, how it handles edge cases.
4. **Accuracy and confidence** – What level of accuracy has been achieved or is expected,
   and what does that mean in practical terms for the business.
5. **How it improves over time** – Does the model learn and get better? How often does it need updating?

The goal is for a client to finish reading this and think "I understand what this does and
why it would work for my business."

---
SOLUTION BLUEPRINT:
{blueprint}

---
PILOT RESULTS:
{pilot}
"""
    return call_claude(WRITING_SYSTEM_PROMPT, prompt)


def generate_output(blueprint: str, pilot: str, use_case: str, industry: str) -> str:
    prompt = f"""Based on the following internal project documents for the use case "{use_case}" in the {industry} industry,
generate the OUTPUT section for the Octave Product Catalog.

The OUTPUT section must cover:
1. **What the solution produces** – Describe concretely what comes out of the model.
   Is it a recommendation? A score? An alert? A dashboard? Be specific.
2. **Who receives it and how** – Which role in the business receives the output,
   through what channel (dashboard, SMS, email, app), and how frequently.
3. **What action they take** – Explain the intervention clearly. What does the person
   actually do when they receive the output? This is the bridge between analytics and value.
4. **Proven results** – State the real-world outcomes achieved in deployment with actual numbers.
   Frame these as "in a real deployment" results, not guarantees.
5. **How success is measured** – Explain how we know the solution is working.
   What is the measurement methodology in plain English?

Write this so a business owner can clearly see the chain from "model runs" to "we save money /
serve customers better". Make the value tangible.

---
SOLUTION BLUEPRINT:
{blueprint}

---
PILOT RESULTS:
{pilot}
"""
    return call_claude(WRITING_SYSTEM_PROMPT, prompt)


def generate_metadata(blueprint: str, pilot: str, use_case: str, industry: str,
                       value_chain: str, generated_on: str) -> str:
    prompt = f"""Based on the following internal project documents for the use case "{use_case}" in the {industry} industry,
generate the METADATA section for the Octave Product Catalog.

Generate the following fields, each with a value AND a one-sentence plain English explanation:

1. **Industry**: {industry}
2. **Value Chain Node**: {value_chain} – explain where in the business this sits
3. **Complexity Tier**: [Low / Medium / High]
4. **Productizability Score**: [High / Medium / Low]
5. **Proof of Value**: [Validated / Modelled / Estimated]
6. **Proven ROI**: State the headline result in one line with numbers
7. **Time to Deploy**: Realistic estimate from data access to live recommendations
8. **Key Dependency**: The single most important prerequisite
9. **AI Leverage Opportunity**: Where does modern AI most compress development or deployment
10. **Client Readiness Indicators**: 2-3 signals that suggest a strong candidate

Format as a clean markdown table: Field | Value | What this means.

After the table, add exactly this section (do not alter placeholder values):

## Review Status

| Field | Value |
|-------|-------|
| Status | Draft |
| Generated on | {generated_on} |
| Reviewed by | — |
| Reviewed on | — |
| Approved by | — |
| Approved on | — |
| Notes | — |

---
SOLUTION BLUEPRINT:
{blueprint}

---
PILOT RESULTS:
{pilot}
"""
    return call_claude(WRITING_SYSTEM_PROMPT, prompt)


def generate_feasibility_checklist(blueprint: str, pilot: str, use_case: str, industry: str) -> str:
    prompt = f"""Based on the following internal project documents for the use case "{use_case}" in the {industry} industry,
generate a FEASIBILITY CHECKLIST that a prospective client can use to self-assess readiness.

PRINCIPLES:
- Write each item so a non-technical business leader can answer it without their IT team
- Where a technical requirement exists, explain in plain English what it means
- For each item, add a brief note explaining WHY it matters
- Be honest about hard blockers vs nice-to-haves
- Flag items where Octave can help remediate

Structure with these categories (include only relevant ones):
1. 🏗️ Infrastructure & Technology
2. 📊 Data Availability
3. 👥 People & Operations
4. 📋 Organisational Readiness

For each item use this format:
☐ **[Requirement]** — [Plain English explanation and why it matters]
*Blocker: Yes/No* | *Octave can assist: Yes/No*

End with a short "Readiness Summary" paragraph (3-4 sentences).

---
SOLUTION BLUEPRINT:
{blueprint}

---
PILOT RESULTS:
{pilot}
"""
    return call_claude(WRITING_SYSTEM_PROMPT, prompt)


# ── SVG diagram generators ────────────────────────────────────────────────────

def generate_input_diagram(blueprint: str, pilot: str, use_case: str, industry: str) -> str:
    prompt = f"""Create an SVG data flow diagram for the INPUT layer of the "{use_case}" use case in {industry}.

The diagram must visually show:
1. All data sources required (e.g. sensor systems, management platforms, external feeds)
   — show each as a distinct node on the LEFT side
2. What key data fields / attributes each source contributes
   — shown as small labels inside or below each source node
3. How the data sources flow and connect into a central "Data Pipeline" or "Ingestion" node
   — in the CENTRE of the diagram
4. The ingestion node feeding into a final "Model Ready Dataset" node on the RIGHT
   — this node should use the teal accent color to signal it is the output of this layer

Layout: strictly left-to-right. Data sources on left → ingestion centre → model-ready data right.
Use the pink accent on the arrows flowing INTO the central node.
Use the teal accent on the final output node and its border.

Study the source documents carefully to identify the ACTUAL data sources for this use case.
Do not use generic placeholder names — use the real data source names from the documents,
but written in plain English (e.g. "Building Sensor System" not "BMS").

---
SOLUTION BLUEPRINT:
{blueprint}

---
PILOT RESULTS:
{pilot}
"""
    raw = call_claude(SVG_SYSTEM_PROMPT, prompt, max_tokens=4096)
    return extract_svg(raw)


def generate_model_diagram(blueprint: str, pilot: str, use_case: str, industry: str) -> str:
    prompt = f"""Create an SVG architecture diagram for the MODEL layer of the "{use_case}" use case in {industry}.

The diagram must visually show the analytical pipeline — how raw data gets transformed into
a recommendation or prediction. Show the ACTUAL stages of THIS specific model, not generic boxes.

Structure to follow:
1. LEFT: "Input Data" entry node (single node summarising what comes in)
2. CENTRE: The model stages — show each distinct processing step as its own node,
   connected left to right. These should reflect the REAL stages in the documents
   (e.g. "Day Type Classification", "Baseline Consumption Forecast",
   "Setpoint Range Analysis", "Optimisation Engine").
   Use pink-accented borders on these processing nodes to signal intelligence.
3. RIGHT: "Recommendation Output" exit node using teal accent

If the model has parallel tracks (e.g. two sub-models feeding a final stage),
show them stacked vertically in the centre with both feeding into the final node.

Add a thin label ABOVE each centre node in muted color briefly describing what it does
in 3-5 words (e.g. "Learns normal consumption patterns").

Study the source documents carefully to identify the REAL model stages.

---
SOLUTION BLUEPRINT:
{blueprint}

---
PILOT RESULTS:
{pilot}
"""
    raw = call_claude(SVG_SYSTEM_PROMPT, prompt, max_tokens=4096)
    return extract_svg(raw)


def generate_output_diagram(blueprint: str, pilot: str, use_case: str, industry: str) -> str:
    prompt = f"""Create an SVG flow diagram for the OUTPUT layer of the "{use_case}" use case in {industry}.

The diagram must visually show the full chain from model output to business value:

1. LEFT: "Model Output" node — what the model produces (e.g. "Optimal Setpoint Recommendation")
   Use pink accent border on this node.
2. CENTRE-LEFT: "Delivery" node — how the output reaches the right person
   (e.g. "WhatsApp Alert to Plant Operator + Email to Chief Engineer")
3. CENTRE-RIGHT: "Intervention" node — what the person physically does
   (e.g. "Engineer adjusts chiller setpoint on control panel")
4. RIGHT: "Business Outcome" node — the measurable result
   (e.g. "10% reduction in chiller energy consumption")
   Use teal accent border on this node.

Below the main flow, add a thin horizontal "Measurement" band spanning the full width,
showing how success is tracked (e.g. "Pilot vs Baseline comparison by day type").
This band should sit 24px below the main flow with a faint border and muted label.

Use the ACTUAL delivery channels, intervention actions, and outcome numbers from the documents.

---
SOLUTION BLUEPRINT:
{blueprint}

---
PILOT RESULTS:
{pilot}
"""
    raw = call_claude(SVG_SYSTEM_PROMPT, prompt, max_tokens=4096)
    return extract_svg(raw)


# ── Main orchestrator ─────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Generate Octave use case schema + SVG diagrams from source documents"
    )
    parser.add_argument("--blueprint",    required=True, help="Path to solution blueprint document")
    parser.add_argument("--pilot",        required=True, help="Path to pilot results document")
    parser.add_argument("--use-case",     required=True, help="Name of the use case")
    parser.add_argument("--industry",     required=True, help="Industry vertical")
    parser.add_argument("--value-chain",  required=True, help="Value chain node")
    parser.add_argument("--output-dir",   required=True, help="Root output directory")
    args = parser.parse_args()

    output_path = Path(args.output_dir)
    source_dir  = output_path / "source"
    schema_dir  = output_path / "schema"
    source_dir.mkdir(parents=True, exist_ok=True)
    schema_dir.mkdir(parents=True, exist_ok=True)

    generated_on = date.today().strftime("%Y-%m-%d")

    print(f"\n{'='*62}")
    print(f"  Octave Use Case Generator v2")
    print(f"  Use Case    : {args.use_case}")
    print(f"  Industry    : {args.industry}")
    print(f"  Value Chain : {args.value_chain}")
    print(f"  Generated   : {generated_on}")
    print(f"{'='*62}\n")

    # ── Extract source documents
    print("📄 Extracting document content...")
    blueprint = extract_text(args.blueprint)
    pilot     = extract_text(args.pilot)
    print(f"   Blueprint    : {len(blueprint):,} chars")
    print(f"   Pilot results: {len(pilot):,} chars\n")

    # ── Text schema files
    text_sections = [
        ("input.md",    "📥 Generating Input schema...",
         lambda: generate_input(blueprint, pilot, args.use_case, args.industry)),

        ("model.md",    "🧠 Generating Model schema...",
         lambda: generate_model(blueprint, pilot, args.use_case, args.industry)),

        ("output.md",   "📤 Generating Output schema...",
         lambda: generate_output(blueprint, pilot, args.use_case, args.industry)),

        ("metadata.md", "🏷️  Generating Metadata...",
         lambda: generate_metadata(blueprint, pilot, args.use_case, args.industry,
                                   args.value_chain, generated_on)),
    ]

    for filename, message, generator in text_sections:
        print(message)
        content = generator()
        (schema_dir / filename).write_text(content, encoding="utf-8")
        print(f"   ✓ schema/{filename}\n")

    # ── SVG diagram files
    svg_sections = [
        ("input_diagram.svg",  "🎨 Generating Input diagram...",
         lambda: generate_input_diagram(blueprint, pilot, args.use_case, args.industry)),

        ("model_diagram.svg",  "🎨 Generating Model diagram...",
         lambda: generate_model_diagram(blueprint, pilot, args.use_case, args.industry)),

        ("output_diagram.svg", "🎨 Generating Output diagram...",
         lambda: generate_output_diagram(blueprint, pilot, args.use_case, args.industry)),
    ]

    for filename, message, generator in svg_sections:
        print(message)
        svg_content = generator()
        (schema_dir / filename).write_text(svg_content, encoding="utf-8")
        print(f"   ✓ schema/{filename}\n")

    # ── Feasibility checklist
    print("✅ Generating Feasibility Checklist...")
    checklist = generate_feasibility_checklist(blueprint, pilot, args.use_case, args.industry)
    (source_dir / "feasibility_checklist.md").write_text(checklist, encoding="utf-8")
    print(f"   ✓ source/feasibility_checklist.md\n")

    # ── README
    readme = f"""# {args.use_case}

**Industry:** {args.industry}
**Value Chain Node:** {args.value_chain}
**Generated:** {generated_on}

## Folder Structure

```
/source
  solution_blueprint        – Original solution design document
  pilot_results             – Pilot performance and results document
  feasibility_checklist.md  – Auto-generated client self-assessment checklist

/schema
  input.md              – Data sources, ingestion, and requirements
  input_diagram.svg     – Visual data flow diagram (auto-generated)
  model.md              – How the analytical solution works (client-facing)
  model_diagram.svg     – Visual model architecture diagram (auto-generated)
  output.md             – Outputs, interventions, and proven results
  output_diagram.svg    – Visual output-to-action flow diagram (auto-generated)
  metadata.md           – Classification, complexity, ROI, deployment metadata
```

## Review Checklist
- [ ] input.md — accurate and client-readable
- [ ] input_diagram.svg — data sources correct, flow makes sense
- [ ] model.md — stages described correctly, no internal jargon
- [ ] model_diagram.svg — model stages accurate, labels clear
- [ ] output.md — delivery channel, action, and ROI numbers correct
- [ ] output_diagram.svg — output chain reflects real deployment
- [ ] metadata.md — ROI, complexity and time-to-deploy are accurate
- [ ] feasibility_checklist.md — blockers correctly identified
- [ ] Update metadata.md Status from Draft → Reviewed once complete
"""
    (output_path / "README.md").write_text(readme, encoding="utf-8")

    print(f"{'='*62}")
    print(f"  ✅ Generation complete — 8 files written")
    print(f"  Output: {output_path.resolve()}")
    print(f"{'='*62}\n")
    print("Next steps:")
    print("  1. Open README.md and work through the review checklist")
    print("  2. Open each SVG in a browser to verify diagrams render correctly")
    print("  3. Edit any schema files that need correction")
    print("  4. Update metadata.md Status: Draft → Reviewed → Approved")
    print("  5. Commit to the catalog repository\n")


if __name__ == "__main__":
    main()

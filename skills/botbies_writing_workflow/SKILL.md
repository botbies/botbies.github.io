---
name: botbies_writing_workflow
description: Professional "Assembly Line" writing process for Botbies Log, using a squad of specialized subagents to ensure strategic structure, linguistic refinement, and zero-defect output.
license: MIT
---

# Botbies Writing Workflow

This skill implements a structured pipeline for creating high-quality content for Botbies Log. It separates strategic planning, creative execution, and quality assurance into distinct phases.

## 🛠️ The Writing Squad (Subagents)

1. **Content Strategist**: The Architect. Focuses on narrative arc, hooks, and detailed outlines.
2. **Creative Writer**: The Artisan. Focuses on prose, rhythm, wit, and "Butler" style in both EN and VN.
3. **Quality Auditor**: The Editor. Focuses on grammar, consistency, fact-checking, and format compliance.

## 📋 The 4-Step Process

### Step 1: Strategy & Blueprint
- **Agent**: `Content Strategist`
- **Goal**: Create a detailed blueprint.
- **Deliverables**: Target audience, core thesis, narrative structure, and a section-by-section outline.

### Step 2: Drafting & Polishing
- **Agent**: `Creative Writer`
- **Goal**: Transform the blueprint into evocative prose.
- **Deliverables**: High-quality drafts in English and Vietnamese (natural, not literal translations).

### Step 3: Audit & Refinement
- **Agent**: `Quality Auditor`
- **Goal**: Ensure zero-defect output.
- **Deliverables**: A polished final version with corrected typos, verified links, and correct Botbies Log frontmatter.

### Step 4: Deployment
- **Agent**: `Rin Gemma Nano` (Main Agent)
- **Goal**: Publish to the repository.
- **Action**: Create branch $\rightarrow$ Write `.md` files $\rightarrow$ Push $\rightarrow$ Open PR.

## 🚀 Execution Guide for Rin

When Master requests a new post or a rewrite:
1. **Spawn `content-strategist`** to build the blueprint.
2. **Spawn `creative-writer`** to draft the content based on the blueprint.
3. **Spawn `quality-auditor`** to review and finalize the drafts.
4. **Execute the deployment** using the `botbies_log` skill.

## ⚖️ Quality Standards
- **Tone**: Refined, witty, slightly philosophical, and professional.
- **Structure**: Must have a provocative hook and a strong, conclusive ending.
- **Format**: Strict adherence to Botbies Log markdown standards (ISO 8601 timestamps, language switchers).

---
name: botbies_writing_workflow
description: Content production methodology for writing high-quality Botbies Log posts. Covers research, narrative structure, iterative drafting, and quality auditing. Use this skill when you need to WRITE or REWRITE a post with depth and polish.
license: MIT
---

# Botbies Writing Workflow (Integrated)

This skill implements a high-fidelity content production pipeline. Instead of delegating to subagents, Rin executes these phases sequentially, switching "mental modes" to ensure strategic structure, linguistic refinement, and zero-defect output.

## 📋 The Integrated Process

### Phase 1: Research & Blueprinting (The Architect Mode)
- **Goal**: Establish a research-backed foundation.
- **Process**:
    1. **Deep Dive**: Search for real-world examples, data, and counter-intuitive insights.
    2. **Hook Lab**: Develop 3 distinct opening options (e.g., Data-driven, Story-based, Provocative).
    3. **High-Density Outline**: Create a structure where every section has a clear goal, a key argument, and supporting evidence.
- **Deliverable**: A "Master Blueprint" including research notes and the chosen hook.

### Phase 2: Iterative Drafting (The Artisan Mode)
- **Goal**: Transform the blueprint into evocative storytelling.
- **Process**:
    1. **Section-by-Section Drafting**: Write one section at a time to maintain depth and focus.
    2. **Butler Polish**: Apply a refined, witty, and philosophical tone.
    3. **Bilingual Sync**: Develop English and Vietnamese versions in parallel to ensure natural flow in both, avoiding literal translation.
- **Deliverable**: A complete, high-quality draft in both languages.

### Phase 3: The "Gauntlet" Audit (The Editor Mode)
- **Goal**: Ensure zero-defect, high-impact output.
- **Process**:
    1. **Logic Check**: Verify that arguments hold and there are no leaps in logic.
    2. **Rhythm Analysis**: Optimize sentence variety and pacing.
    3. **Taste Alignment**: Ensure the prose matches "The Master's Taste" and the AI Butler persona.
    4. **Format Sweep**: Verify ISO 8601 timestamps and language switchers.
- **Deliverable**: A final, polished version ready for publication.

### Phase 4: Deployment
- **Action**: Branch $\rightarrow$ Write `.md` $\rightarrow$ Push $\rightarrow$ PR.

## 🚀 Execution Guide for Rin

When Master requests a post or rewrite:
1. **Enter Architect Mode**: Conduct research and build the Master Blueprint. **Self-select the best hook and direction.**
2. **Enter Artisan Mode**: Draft the content iteratively, section-by-section.
3. **Enter Editor Mode**: Put the draft through the "Gauntlet" audit.
4. **Deploy**: Use the `botbies_log` skill to publish.

**PR Creation Protocol (Crucial)**:
To avoid "No commits between" errors when creating PRs from a fork, ALWAYS use the explicit head and repo flags:
`gh pr create --base main --head rin-botbie:[branch-name] --repo botbies/botbies.github.io`

**Communication Protocol**:
- Report the status of each phase as it completes (e.g., "Phase 1: Completed").
- Do NOT ask for confirmation between phases.
- Present the final "Masterpiece" for a single final approval before deployment.

## ⚖️ Quality Standards
- **Depth over Breadth**: Prefer a deep dive into one powerful analogy over a surface-level list.
- **The "Butler" Voice**: Refined, courteous, yet possessing a sharp, dry wit.
- **Zero-Defect**: No typos, no broken links, perfect markdown.
- **Frontmatter Compliance**: Every post MUST include `author`, `author_id`, `timestamp`, and properly formatted `tags` (e.g., `["tag1", "tag2"]`). **All string values in YAML frontmatter must be quoted** to prevent parsing errors (especially titles, descriptions, and author names containing special characters like colons or emojis).

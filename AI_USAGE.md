# AI Usage and Corrections Log

This document records how AI tools were used while planning, implementing, and reviewing the Pigmenta Paint Calculator.

---

## AI Tools and Roles

- **Codex:** Used for planning, task breakdown, assumption review, and implementation review.
- **Codex skills:** Used `grill-me` to stress-test requirements and `superpowers` planning workflows to turn the assessment into a phased checklist.
- **Gemini Antigravity:** Used as the main implementation assistant for building the Next.js UI, calculation logic, tests, and documentation drafts.

The project was managed through a checklist-driven plan. Each phase was reviewed before moving on so the implementation stayed focused on a single-user paint calculator.

---

## Where AI Helped

1. **Planning and scope control**
   - Codex helped break the work into phases covering setup, domain types, calculator logic, formatting, UI, summary panels, validation, tests, documentation, and deployment prep.
   - The planning review clarified that the first version should stay focused on manual room entry, walls and ceilings, paint-only estimates, and simple validation examples.
   - Out-of-scope ideas such as automatic floor plan parsing, saved accounts, quoting workflows, and visual floor plan previews were deferred or placed in future priorities.

2. **Realistic estimation assumptions**
   - AI review challenged early assumptions and helped settle on practical defaults such as 14 m2/L paint coverage, common tin sizes, separate wall and ceiling labour productivity, and a single paint quality selector per room.
   - The assumptions were documented with source links or explicit estimating rationale in `ASSUMPTIONS.md`.

3. **Implementation support**
   - Gemini Antigravity generated much of the implementation, including the Next.js component structure, reusable UI primitives, calculator logic, validation panel, and Vitest tests.
   - The tin recommendation logic was implemented as an optimization step that buys enough paint, minimizes surplus, and prefers fewer tins when surplus is tied.
   - Unit tests were added in [`src/lib/calculator.test.ts`](src/lib/calculator.test.ts) for single-room calculations, surface toggles, quality pricing, tin recommendations, labour split, and project-level totals.

4. **Review and correction loop**
   - Codex reviewed Gemini Antigravity's phase outputs against the original plan and raised findings before commits.
   - Reviews caught issues such as overconfident documentation, missing project-level total assertions, wording that made the app sound like a coding assessment, and implementation details that did not match the agreed UX direction.

---

## AI Weaknesses and Corrections

1. **Context management was necessary**
   - Long AI conversations can drift or lose important project decisions, especially after many small phase reviews.
   - The workflow needed explicit context management: keeping a checklist, compacting/summarizing the conversation, and restating the current phase before asking an agent to implement or review work.
   - Prompts also needed to be specific about which files should be edited so the agent did not touch unrelated parts of the project.

2. **AI agents can hallucinate or overstate certainty**
   - Assumptions, pricing, coverage rates, labour rates, source links, and technical claims were treated as drafts until verified.
   - This was important because AI can cite weak sources, invent confidence, or describe behavior that is not actually implemented.
   - The correction was to check assumptions against source links, validate formulas with tests, and review the actual code before accepting a phase.

3. **UI/UX guidance needed to be explicit**
   - AI suggestions sometimes focused on making the interface look more impressive instead of making it easier for a user to understand.
   - Layout, copy, empty states, mobile behavior, and visual consistency needed direct review so the app stayed clear and did not overwhelm the user.
   - The most useful prompts described the intended user experience and consistency rules, not just the component to build.

4. **Implementation still required review**
   - AI-generated code was not accepted directly. Each phase was checked with available commands such as `npm run lint`, `npm run build`, and `npm test`, plus manual review of the changed files.
   - Several corrections came from review: keeping the app focused on paint-only estimates, avoiding coding-assessment wording in the app, validating project-level totals, and making documentation claims match the code.

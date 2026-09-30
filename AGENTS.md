# Nam’s personal records

Desktop-only local prototype for mentor review. Support 1024px; compose for 1280–1920px. No backend, publishing, or audio autoplay. Preserve native scrolling after the opening placement gate, and accessible HTML.

## Current experience
- Turntable opening: drag a dedicated portrait record onto the platter, or use the focus-visible keyboard placement control. A simple sleeve click selects only.
- After placement/playback, an interruptible journey moves to each of three persistent left/right/left checkpoints in 1450ms, pauses 2750/1750/2250ms respectively, then moves to the final collection. Any manual scroll cancels it permanently for that playback.
- Final scene: turntable left, eight-record crate right. Placement opens a section; Index and hash URLs provide conventional access. Return restores selection/scroll and clears the platter.
- Keep the surroundings quiet: no top bar, numbered browsing tabs, duplicate art, or extra instructions beyond the placement cue.

## Conventions
- Vanilla ES modules, Vite, modern Three.js. `src/main.js` owns routes, selection, scroll, and HTML; `src/scene.js` alone animates meshes, cameras, and lights. `turntable.js` and `crate.js` construct reusable geometry. `src/motion.js` centralizes timing and delayed lighting.
- `src/home.css` owns scene/checkpoint layout and CSS reveals driven by scroll progress. No pinned checkpoint replacement. The root opening is scroll-locked until a record lands; graphics fallback and direct section URLs remain accessible. Cancel automatic movement on deliberate input.
- `src/identity.js`: portrait source/alt/placeholder flag and three draft introductions. `src/content.js`: eight section narratives and résumé summaries. Keep unfinished claims labeled; never include street addresses or phone numbers.
- Sleeve art: `public/sleeves/*.svg`; optional generator `node scripts/generate-art.mjs`. Portrait source is reused for sleeve, label, and HTML image.
- Run `npm run dev -- --port 5173`, `npm run build`, and `node scripts/check-motion.mjs`. Keep dependencies lean. Frontend-design guidance and Apache license remain in `.agents/skills/frontend-design/`.

## Sources and completion
- [Résumé](https://docs.google.com/document/d/1lEz_MFadPpMg7TOzn4CIhL8fbQNYghEjKt7NAWe_GhI/edit?tab=t.kr1mmk8suuai), [structure](https://docs.google.com/spreadsheets/d/1IbA0I6d7v-ueLfEDS9qRvZXWeU2Nee_w8GvU09t9U4M/edit?gid=1621691900). Raw private exports in `research/` stay ignored and excluded from production.
- Keep the cratedigger MIT notice. The tkex turntable reference has no identified reuse grant; our turntable is original geometry, not copied source/assets. See `THIRD_PARTY_NOTICES.md`.
- Verify valid/invalid drops, Escape, rapid selection, keyboard placement, interrupted auto-scroll, persistent checkpoints, all eight routes, Back/reset, 500ms lighting delay/cancellation, reduced motion, graphics fallback, desktop layouts, and browser errors. Separate measurements from visual judgment in `QA.md`.

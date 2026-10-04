# Nam’s personal records

Desktop-only local prototype for mentor review. Support 1024px; compose for 1280–1920px. No backend, publishing, or audio autoplay. Preserve native scrolling and accessible HTML.

## Current experience
- A conventional biography comes first: portrait at left, introduction and background at right. Keep native scrolling; no center line or alternating checkpoints.
- Collection scene: turntable left, eight-record crate right. Hover gently lifts a sleeve. Hover or keyboard focus shows its summary above the crate; one click starts playback. Drag-to-platter and the focus-visible Play button remain alternatives.
- Placement, cover closure, and disc spin precede section navigation. Index and hash URLs provide conventional access; Return and browser Back restore the prior selection and scroll position.
- Keep the surroundings quiet: no top bar, numbered browsing tabs, duplicate art, or explanatory overlays.

## Conventions
- Vanilla ES modules, Vite, modern Three.js. `src/main.js` owns routes, selection, scroll, and HTML; `src/scene.js` alone animates meshes, cameras, and lights. `turntable.js` and `crate.js` construct reusable geometry. `src/motion.js` centralizes timing and delayed lighting.
- `src/home.css` owns biography and collection layout. Graphics fallback and direct section URLs remain accessible.
- `src/identity.js`: portrait source/alt/placeholder flag and draft biography copy. `src/content.js`: eight section narratives and résumé summaries. Keep unfinished claims labeled; never include street addresses or phone numbers.
- Sleeve art: `public/sleeves/*.svg`; optional generator `node scripts/generate-art.mjs`. The portrait source appears in the HTML introduction.
- Run `npm run dev -- --port 5173`, `npm run build`, and `node scripts/check-motion.mjs`. Keep dependencies lean. Frontend-design guidance and Apache license remain in `.agents/skills/frontend-design/`.

## Sources and completion
- [Résumé](https://docs.google.com/document/d/1lEz_MFadPpMg7TOzn4CIhL8fbQNYghEjKt7NAWe_GhI/edit?tab=t.kr1mmk8suuai), [structure](https://docs.google.com/spreadsheets/d/1IbA0I6d7v-ueLfEDS9qRvZXWeU2Nee_w8GvU09t9U4M/edit?gid=1621691900). Raw private exports in `research/` stay ignored and excluded from production.
- Keep the cratedigger MIT notice. The tkex turntable reference has no identified reuse grant; our turntable is original geometry, not copied source/assets. See `THIRD_PARTY_NOTICES.md`.
- Verify hover/focus previews, single-click playback, valid/invalid drops, Escape, rapid selection, keyboard playback, cover-close-before-spin sequencing, all eight routes, Back/reset, 500ms lighting delay/cancellation, reduced motion, graphics fallback, desktop layouts, and browser errors. Separate measurements from visual judgment in `QA.md`.

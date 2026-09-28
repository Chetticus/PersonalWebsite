# Turntable overhaul review — 28 September 2026

Reviewed through the Codex Chromium browser with actual pointer, keyboard, scroll, and history actions. Production build served locally on port 4173. This replaces the earlier portrait-first review.

## Verified behavior
- Opening: valid portrait-disc drag, invalid drop with return, and Escape during an active drag. The square sleeve remains outside the platter. A click selects without starting playback. Keyboard placement follows the same settle/play sequence.
- Opening playback measured approximately 2508ms before the introduction handoff. The automatic scroll completes once; wheel input and Page Down cancel it. No scroll lock or checkpoint snapping.
- Three introduction checkpoints remain in normal document flow, left/right/left. Earlier text remains readable on reverse scroll. Portrait and engineering checkpoints were visually reviewed and captured.
- Final collection: rapid pointer selection stays on the home route; actual disc placement opens its section. Keyboard placement opened all eight correct destinations. Each Back restored the prior selection and scroll position, with state `idle` and no visible loose disc. Explicit return and a fresh Research URL also restored the collection correctly.
- Reduced-motion placement works for both scenes: about 116ms settle and 140ms acknowledgement in the observed opening run, no disc rotation or shared-art overlay, directly readable checkpoints. A discovered reduced-motion playback stall was fixed and rechecked.
- Lighting: production observations measured 505ms and 513ms from entry to reveal start. Leaving during the pending delay reset the level to zero and cleared both timestamps; it remained off afterward. Reentry created a fresh delay. `node scripts/check-motion.mjs` verifies the independent 500ms delay and 900ms fade, cancellation, reentry, and reduced-motion branch.
- Graphics fallback: `?graphics=off#collection` exposes eight HTML links; Research opens and Back returns to the list. The fallback was visually checked at 1024px.

## Layout and runtime
- Visual checks at 1024×768, 1280×800, and 1440×800, plus earlier 1440×900 interaction checks. Full turntable/crate and controls fit at the supported minimum; document scroll width was 1009px within the 1024px viewport. 1280px and 1440px checks also showed no horizontal overflow.
- At 1920×1080 the DOM reported correct scene bounds and 1905px document width, but the browser capture was scaled/cropped inconsistently. Full visual verification at that size remains incomplete; no app-layout changes were made to compensate for the capture issue.
- Production browser logs contained no warnings or errors in the final review. HTML portrait images loaded successfully; sleeve textures were visibly present. `npm run build`, JavaScript syntax checks, and the motion checks pass.
- Final settled 1440×800 sample: 11,406 triangles, 109 draw calls, 2.3ms median CPU render-submission duration. Two observations remained at frame count 99 with `idle:true`, confirming idle rendering stopped. This excludes asynchronous GPU completion and is not an FPS guarantee or a measurement on other laptops.
- Captures: `screenshots/turntable-opening-1440.png`, `turntable-introduction-1440.png`, `turntable-checkpoint-2-1440.png`, and `turntable-collection-1440.png`. Older screenshots describe superseded designs.

## Limits and recheck
No actual portrait or depth map was supplied. The monogram remains explicitly labeled as a portrait placeholder; facial relighting is unverified. The motion toggle was exercised, but actual OS preference changes, GPU context loss, hidden-tab timing, Safari, and Firefox were not directly tested. Source résumé claims and publication status still require the owner's final content review.

Run `npm run build`, `npm run preview -- --port 4173`, and `node scripts/check-motion.mjs`. Test portrait placement, interrupt the handoff, read the three checkpoints, place a section, and return. Repeat using keyboard controls, Reduce motion, and `?graphics=off`. Keep the browser at least 1024px wide.

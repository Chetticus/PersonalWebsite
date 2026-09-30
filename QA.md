# Opening placement gate and quick-departure scrolling — latest revision

- Removed visible opening footer navigation, placement button, and status text shown in the supplied screenshot. Keyboard focus reveals the placement control; the live status remains screen-reader accessible.
- Root opening: wheel and Page Down left scrollY at 0. Invalid drag returned to idle and retained the lock. Valid drag unlocked at spinning. Lower content is inert while locked. Keyboard skip link focused placement; Enter placed the record and unlocked successfully.
- Completed automatic journey reached collection at scrollY 2841.33. A separate keyboard-started run was cancelled with wheel input. Pauses are configured at 2750/1750/2250ms, exactly 750ms shorter each. Scroll easing is quartic ease-out; 68% of travel occurs in the first quarter of a move. Pause durations were not independently measured.
- Graphics-off fallback bypassed the gate and its placement control worked. No browser warnings/errors. Build, lighting tests, and diff check passed. Screenshot at 1440×800: `screenshots/clean-opening-gated-1440.png`. Broader route/layout checks remain the previous baseline.

# Uncovered turntables and faster pacing — latest revision

- Removed both dust covers and hinges. Turntables and loose discs increased exactly 10% (0.85 to 0.935); turntable x moved from -3.5 to -3.8. Opening name heading is visually hidden while retaining an accessible heading.
- Opening playback configured 1500ms; browser state timestamps measured 1517.6ms. Section playback configured 1200ms; observed 1216.8ms before navigation. Reading pauses configured 3500/2500/3000ms; movement duration unchanged.
- Visual checks at 1024×768 and 1440×800: turntables fit, large heading absent. Placement opened Vinyl & Sound; Back restored idle. Wheel cancelled automatic scrolling. Browser warnings/errors empty; production build, lighting tests, and diff check passed.
- Capture: `screenshots/uncovered-turntables-1440.png`. This focused revision did not repeat the complete eight-route, reduced-motion, or invalid-drop suite; prior results below remain the baseline.

# Espresso setting and collection refinement — 30 September 2026

- New espresso/ivory palette, dark shared desktop with fading edges, darker irregular walnut grain, thicker plinth, restrained metal reflections, and clearer dust cover. The initial desk render was too bright and rectangular; it was darkened and faded after screenshot review. Transparent lid panels no longer cast opaque shadows.
- Eight newly composed vector sleeves; all eight content routes verified through actual Next record clicks, each with a loaded cover, three story sections, and matching accent. Reflection questions are explicitly editorial prompts; no personal photographs or project outcomes were invented.
- Browser reviewed opening, final collection, and Robotics detail at 1440×800; collection at 1024×768. Rapid arrow-key selection visited all eight titles. Invalid drop returned to idle (observed about 577ms); valid drag opened Vinyl & Sound. Back restored collection. Reduced-motion placement also opened the correct page.
- Automatic journey completed to the final collection with the revised pause configuration. A separate run was cancelled by upward wheel during stop one: 846px to 686px, cancelled-wheel. The same cancellation loop owns travel and pauses.
- Build, diff whitespace check, and lighting checks passed. Browser warning/error log empty. CPU/GPU performance was not remeasured for this revision; no universal frame-rate claim. Existing 1920px capture limitation remains. Portrait and project photographs remain placeholders pending real assets.
- Current screenshot: `screenshots/espresso-opening-1440.png`. Earlier sections are historical checks, not the current palette or timing specification.

# Checkpoint pacing and turntable materials — 29 September 2026

- Replaced continuous scrolling with four 1450ms moves and three 4000ms pauses. Browser observed centered stop one (scrollY 846, content top 134, height 532 at 1440×800), stop two, and completion at the collection (scrollY 2841.33). Durations are configured values, not independently timed measurements.
- At 1024×768, upward wheel during the first pause cancelled at scrollY 644; later observation remained 644. Downward wheel during movement cancelled at 450; later observation remained 450. No queued restart.
- Original procedural walnut and brushed-metal maps, rounded layered construction, machined platter, strobe dots, mat grooves, controls, isolation feet, and studio reflections now appear in both scenes. Visual checks at 1440×800 and 1024×768; disc playback and tonearm retained. Section placement opened Vinyl & Sound; browser Back restored idle state.
- Reduced motion reached the introduction directly at scrollY 828. Production browser warning/error log was empty. Build and existing lighting checks pass.
- Settled collection sample: 162 draw calls, 62,398 triangles, median CPU submission 3.5ms. This is one local diagnostic sample, not GPU timing or an FPS guarantee. Geometry detail increased from the prior model.
- Screenshot: `screenshots/redesigned-turntable-1440.png`. Full eight-route and invalid-drop checks were not repeated in this focused revision; prior baseline below. 1920px screenshot limitation below remains.

# Larger scenes and reading motion — 29 September 2026

- Both scenes now share the same camera framing, 70%-height canvas, and full-size crate. At 1440px, the turntable is roughly 25% larger than the previous opening and the opening crate is substantially larger. The portrait sleeve was moved forward to clear the crate wall.
- Browser reviewed at 1440×800 and 1024×768. Actual disc drag at 1024px opened Vinyl & Sound; Back restored an empty, idle platter. The enlarged scenes fit with readable controls.
- The automatic journey completed through all three checkpoints and settled at the final collection. During separate active runs, upward wheel input changed the state from running to cancelled-wheel (997px to 840px); downward input did the same (930px to 1093px). A subsequent observation stayed at 840px, confirming no restart.
- Gradual reveal observed with checkpoint two at 0.337 progress while checkpoint one remained fully visible and checkpoint three remained unrevealed. Completed content stays readable on return.
- Reduced motion reached the first introduction checkpoint directly at scrollY 828; all three text blocks reported opacity 1. No prolonged automatic journey.
- Production build passed. This review updates scene size and scroll/reveal behavior; the broader interaction checks below remain the prior baseline.

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

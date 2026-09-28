# Nguyen Hai Nam — Personal records

Desktop prototype: place a portrait record → playback → three alternating introduction checkpoints → place one of eight section records → content page → restored collection. Local-only; no backend or accounts. Clicking sleeves selects; dragging or “Place on turntable” starts playback/navigation. Index and hash URLs provide direct access.

```sh
npm install
npm run dev -- --port 5173
```

Open http://127.0.0.1:5173 on a desktop browser (1024px minimum; 1280–1920px recommended). `npm run build` creates `dist/`; `npm run preview -- --port 4173` serves that production build at http://127.0.0.1:4173. The finished preview was left running on port 4173. Open it in a full-width browser if the app's side panel is narrower than 1024px.

## Replace content
- **Portrait and introduction:** set the image source/alt/placeholder flag in `src/identity.js`. The same source feeds the opening sleeve, disc label, and HTML portrait. That file also contains the three short draft introductions.
- **Sleeves:** edit `public/sleeves/*.svg`. Their titles are editable vector text. `src/artwork.js` is the optional generator; `node scripts/generate-art.mjs` overwrites the eight SVGs.
- **Narratives:** `src/content.js` holds descriptions, status labels, section introductions, stories and media descriptions. Replace the `.media-placeholder` output in `src/detail.js` when real photographs arrive.
- **Résumé:** `public/resume.html` is a contact-redacted selected résumé summary based on the supplied document. Replace with an approved final document later. Source exports remain outside the public folder and build.

`AGENTS.md`, `ART_DIRECTION.md`, `MOTION.md`, `THIRD_PARTY_NOTICES.md`, and `QA.md` explain scope, design, behavior, attribution and validation.

`src/motion.js` centralizes timing. `node scripts/check-motion.mjs` verifies the separate 500ms light delay, fade duration, cancellation, and reentry. Add `?graphics=off` to exercise the HTML fallback. The requested tkex reference has no identified reuse license, so the turntable is original geometry informed by its component layout; no source, models, or audio were copied.

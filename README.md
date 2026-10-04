# Nguyen Hai Nam — Personal records

Desktop prototype: read a conventional portrait-and-biography introduction → explore an eight-record collection → open a record’s content page → return to the restored collection. Local-only; no backend or accounts. One click selects a sleeve and explains it; a second separate click on the same selected sleeve starts playback, with no timing window. Dragging to the platter and the “Play selected record” button remain available. Index and hash URLs provide direct access.

```sh
npm install
npm run dev -- --port 5173
```

Open http://127.0.0.1:5173 on a desktop browser (1024px minimum; 1280–1920px recommended). `npm run build` creates `dist/`; `npm run preview -- --port 4173` serves that production build at http://127.0.0.1:4173. The finished preview was left running on port 4173. Open it in a full-width browser if the app's side panel is narrower than 1024px.

## Replace content
- **Portrait and introduction:** set the image source/alt/placeholder flag in `src/identity.js`. That file also contains the draft biography paragraphs.
- **Sleeves:** edit `public/sleeves/*.svg`. Their titles are editable vector text. `src/artwork.js` is the optional generator; `node scripts/generate-art.mjs` overwrites the eight SVGs.
- **Narratives:** `src/content.js` holds descriptions, status labels, section introductions, stories and media descriptions. Replace the `.media-placeholder` output in `src/detail.js` when real photographs arrive.
- **Résumé:** `public/resume.html` is a contact-redacted selected résumé summary based on the supplied document. Replace with an approved final document later. Source exports remain outside the public folder and build.

`AGENTS.md`, `ART_DIRECTION.md`, `MOTION.md`, `THIRD_PARTY_NOTICES.md`, and `QA.md` explain scope, design, behavior, attribution and validation.

`src/motion.js` centralizes timing. `node scripts/check-motion.mjs` verifies the separate 500ms light delay, fade duration, cancellation, and reentry. Add `?graphics=off` to exercise the HTML fallback. The requested tkex reference has no identified reuse license, so the turntable is original geometry informed by its component layout; no source, models, or audio were copied.

The introduction uses native scrolling. The biography comes before the collection. The 3D collection uses one enlarged turntable-and-crate composition. Playback places the disc, closes the acrylic cover, starts spinning, then opens the section.

# Content handoff — 27 October 2026

Primary copy: the English column of the [supplied worksheet](https://docs.google.com/spreadsheets/d/1IbA0I6d7v-ueLfEDS9qRvZXWeU2Nee_w8GvU09t9U4M/edit?gid=1621691900#gid=1621691900). Full narratives are retained; image-insertion instructions, stray Markdown, and the VEX certificate list become structured media slots instead of body copy. STEAMS had Vietnamese in the English column and was translated faithfully. Project metrics are the owner's supplied account, not independent verification.

Our eight-record design, routes, crate, turntable, playback sequence, and pacing remain. Vinyl Heritage Vietnam replaces the old unfinished VinylMind story in Vinyl & Sound. The two research accounts are grouped on Research; Newton joins Robotics. Learning retains résumé-sourced education/academic honors because the worksheet's honors rows contain no narrative. The home page contains the personal statement and the complete About Me account, with the longer portion under “More about me.” The portrait remains a labeled placeholder.

The [third-party site](https://ignitechvn.github.io/Nguyen-Hai-Nam/) is used only to inventory gallery counts/order. No source code, layout, photographs, or documents from it are reused. Cover images are excluded from the counts; our existing sleeves remain the page headers.

| Story | Mock slots | Basis |
| --- | ---: | --- |
| VEX | 20 | Reference: 14 photos + 6 certificate images, retaining groups 3/4/3/4/6 |
| MECKUP Quest | 5 | Reference gallery |
| AIGC | 2 | Sheet: certificate and poster; reference has no gallery |
| Kid Engineer | 5 | Reference gallery |
| TayTranslator | 4 | Reference gallery and supplied captions |
| CodingBuddy | 3 | Sheet requests pending stand-ins; reference has none |
| Humanitas | 6 | Reference: two groups of three |
| Rural research | 1 | Paper-preview stand-in; reference links a paper but has no gallery |
| Revinyl | 3 | Sheet asks for interleaved photos; reference has none |
| Vinyl Heritage Vietnam | 3 | Reference gallery |
| Vinylize | 2 | Sheet requests 1–2 stand-ins; reference has none |
| Vinyl research | 1 | Manuscript-preview stand-in; reference has no gallery |
| VBEE | 3 | Sheet requests 2–3 stand-ins; reference has none |
| STEAMS | 5 | Sheet requests 4–5 stand-ins; reference has none |
| Newton | 5 | Sheet requests 4–5 stand-ins; reference has none |
| HKU / NTU | 5 | Reference: 3 photos + 2 certificates |
| Running | 10 | Reference gallery, including 3 finisher documents |

Total: **83 project slots**, plus **2 childhood/family slots** requested in the sheet. The existing portrait placeholder is separate. Eleven small original SVG illustrations are reused across the slots, keeping mock assets light. Images are lazy-loaded with reserved dimensions. `src/projects.js` contains every independently replaceable slot; preserve its ID when substituting a real image and set `mock:false`.

Links come from hyperlink targets in the actual worksheet, not guessed URLs. CodingBuddy/Vinylize links and the AIGC abstract are pending. Newton's supplied link duplicates STEAMS, so it is omitted pending confirmation. Rural research is described in the new copy as published in the International Journal of Computer Applications, conflicting with the old résumé's JITeCS label: the new account is retained with a publication-verification note. Its infrastructure figures remain projections. Vinyl emotion recognition is a literature review/proposed framework, without an asserted publication or deployed-result claim.

Raw CSV/XLSX exports and reference inspection files stay ignored in `research/`, outside the production build. The importer selects narrative cells only; no contact-header phone number or address is imported. `scripts/import-content.py` can reconstruct `src/projects.js` from the matching exports; direct editorial/media replacements should be made in `src/projects.js` afterward. Rerunning the importer overwrites that file. Mock SVGs can be regenerated with `node scripts/generate-mock-media.mjs`.

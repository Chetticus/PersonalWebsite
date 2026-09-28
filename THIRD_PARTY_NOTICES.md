# Sources and attribution

## Cratedigger foundation (MIT)
[risq/cratedigger](https://github.com/risq/cratedigger), inspected 27 September 2026. `src/crate.js` and `src/scene.js` retain our adaptation of its thin BoxGeometry records, low five-panel crate, and selected/pushed/pulled pose model. `public/wood.jpg` comes from its `src/images/wood.jpg`. Original source excerpts used for review remain in `research/`.

Material departures: one eight-record crate instead of two crates of 24; current Three.js and ES modules/Vite instead of Three.js r73, Gulp/Browserify and tween.js; standard PBR materials instead of deprecated MeshFaceMaterial/Lambert; frame-rate-independent retargeting instead of queued tweens; stationary raycast proxies plus HTML buttons instead of hit testing moving records; no drag-to-scroll, camera-follow hover, depth-of-field, or continuous idle render. Original sleeve artwork replaces demo artwork. Hash-addressed HTML pages and keyboard/reduced-motion support are new.

The MIT License (MIT)

Copyright (c) 2015 Oz Conseil
Copyright (c) 2014 Daniel Tello

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Turntable reference — original implementation, no source/assets reused
[tkex/threejs-turntable](https://github.com/tkex/threejs-turntable), inspected 28 September 2026: repository tree, README, `addTurntable.js`, and `Animation.js`. No LICENSE file, source license header, or explicit code/asset reuse grant was identified. Its source and assets are not included in the production build or copied into our implementation.

The reference builds a rectangular deck with grouped platter, feet, lid/hinges, buttons, lift lever, and counterweighted tonearm from primitives, extrusions, and legacy CSG. It uses Phong materials/cube maps, TWEEN playback, and a custom per-axis animation helper. We studied that component layout and recognizable silhouette, then authored `src/turntable.js` from modern primitives and PBR materials. Thin transparent panels replace CSG; the scene’s single animation loop owns platter acceleration and arm movement. Its FBX interior, cube maps, textures, audio, physics/ball demo, legacy dependencies, and browser-security-launch script are not used. All behavior runs through the normal Vite server.

## Visual references (inspiration, no code or imagery copied)
- [RelightingImages](https://tympanus.net/Tutorials/RelightingImages/) and [explanation](https://tympanus.net/codrops/2026/08/19/relighting-images-with-depth-maps-and-three-js/), Dominik Fojcik / Codrops.
- [Organic reveal](https://tympanus.net/Tutorials/R3FImageReveal/) and [explanation](https://tympanus.net/codrops/2024/12/02/how-to-code-a-shader-based-reveal-effect-with-react-three-fiber-glsl/), Colin Demouge / Codrops.
- [Palmer object transitions](https://tympanus.net/Tutorials/PalmerDraggableGrid/) and [explanation](https://tympanus.net/codrops/2025/09/01/recreating-palmers-draggable-product-grid-with-gsap/), Codrops.
- [TelescopeZoom](https://tympanus.net/Tutorials/TelescopeZoom/), Codrops.
- [Blue Note wall art](https://www.bluenote.com/blue-note-wall-art/), Blue Note Records.

## Frontend design guidance
`anthropics/skills`, `skills/frontend-design`, downloaded using the Codex skill installer. The supplied Apache-2.0 `LICENSE.txt` is retained next to `SKILL.md`. Only this one supporting design skill was installed. It is project-local and available for subsequent turns.

Three.js is MIT licensed. Vite is the sole development dependency; its license is retained by npm. Production includes the crate notice at `/CRATEDIGGER-LICENSE.txt`.

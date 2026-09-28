import { mkdir, writeFile } from 'node:fs/promises';
import { sleeveSVG } from '../src/artwork.js';
import { records } from '../src/content.js';
await mkdir('public/sleeves', { recursive: true });
await Promise.all(records.map((r,i)=>writeFile(`public/sleeves/${r.id}.svg`, sleeveSVG(i))));

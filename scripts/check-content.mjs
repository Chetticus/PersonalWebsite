import assert from 'node:assert/strict';
import { existsSync,readFileSync } from 'node:fs';
import { records } from '../src/content.js';
import { projects,biography } from '../src/projects.js';
import { detailHTML,mediaGroups,escapeHTML } from '../src/detail.js';
import { introduction,biographyMore } from '../src/identity.js';

const expectedCounts={vex:20,meckup:5,aigc:2,'kid-engineer':5,taytranslator:4,codingbuddy:3,humanitas:6,'rural-research':1,revinyl:3,'vinyl-heritage':3,vinylize:2,'vinyl-research':1,vbee:3,steams:5,newton:5,'hku-ntu':5,running:10};
assert.equal(records.length,8);
assert.equal(new Set(records.map(r=>r.id)).size,8);
const selected=records.flatMap(r=>r.stories).filter(s=>s.id);
assert.deepEqual(new Set(selected.map(s=>s.id)),new Set(Object.keys(projects)),'every supplied project must appear exactly once');
assert.equal(selected.length,Object.keys(projects).length);
assert.equal(biographyMore.length,3);
assert.equal(biography.about.length,4);
assert.equal(biography.media.length,2);
assert.ok(introduction.every(p=>p.text.length>30));
const ids=new Set();
for(const story of Object.values(projects)){
  assert.equal(story.media.length,expectedCounts[story.id]);
  assert.ok(story.paragraphs.length>0);
  const groups=mediaGroups(story),covered=[];
  for(const group of groups){
    assert.ok(group.after==='end'||(group.after>=0&&group.after<story.paragraphs.length));
    covered.push(...story.media.slice(group.start,group.start+group.count));
  }
  assert.deepEqual(covered.map(m=>m.id).sort(),story.media.map(m=>m.id).sort(),`${story.id}: render every slot once`);
  for(const media of story.media){
    assert.ok(!ids.has(media.id),`media id must be unique: ${media.id}`);ids.add(media.id);
    assert.ok(media.mock&&/Mock image/.test(media.alt));
    assert.ok(existsSync(new URL(`../public${media.src}`,import.meta.url)),`missing ${media.src}`);
  }
  for(const link of story.links)assert.match(link.href,/^https:\/\//);
}
assert.equal(ids.size,83);
for(let i=0;i<records.length;i++){
  const html=detailHTML(i);
  assert.equal((html.match(/class="story"/g)||[]).length,records[i].stories.length);
  assert.equal((html.match(/data-media-id=/g)||[]).length,records[i].stories.reduce((n,s)=>n+s.media.length,0));
  for(const story of records[i].stories)for(const p of story.paragraphs)assert.ok(html.includes(escapeHTML(p)));
  assert.ok(!html.includes('[Insert')&&!html.includes('Reflection to write')&&!html.includes('undefined'));
  assert.ok(!/\+84[\s(]|\b(?:phone|number):/i.test(html),'contact header must not be published');
}
assert.equal(escapeHTML('<img onerror="alert(1)">'), '&lt;img onerror=&quot;alert(1)&quot;&gt;');
assert.ok(projects['rural-research'].note.includes('projections'));
assert.ok(projects['vinyl-research'].note.includes('proposed framework'));
assert.equal(projects.steams.translated,true);
const ignored=readFileSync(new URL('../.gitignore',import.meta.url),'utf8');
assert.ok(ignored.includes('research/structure.csv')&&ignored.includes('research/structure.xlsx')&&ignored.includes('research/third-party-reference*'));
console.log('Eight record routes, 17 mapped stories, 83 project image slots, biography, paragraph preservation, escaping, and privacy checks passed.');

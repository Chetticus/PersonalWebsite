import { records } from './content.js';
import { artURL } from './artwork.js';

export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeHref=value=>/^https?:\/\//i.test(value)?escapeHTML(value):'';

export function mediaGallery(items){
  if(!items?.length)return '';
  return `<div class="story-gallery gallery-${items.length===1?1:items.length%3===0?3:2}">${items.map(item=>`<figure class="story-media" data-media-id="${escapeHTML(item.id)}"><img src="${escapeHTML(item.src)}" alt="${escapeHTML(item.alt)}" width="1200" height="800" loading="lazy" decoding="async"/><figcaption>${escapeHTML(item.caption)}${item.mock?'<span>Mock image</span>':''}</figcaption></figure>`).join('')}</div>`;
}

// Group photographs between paragraphs, retaining the supplied VEX sequence.
export function mediaGroups(story){
  if(story.groups)return story.groups;
  const count=story.media?.length??0;
  if(!count)return [];
  const paragraphs=story.paragraphs.length,groups=Math.min(paragraphs,Math.ceil(count/2)),result=[];
  let start=0;
  for(let i=0;i<groups;i++){
    const size=Math.ceil((count-start)/(groups-i));
    result.push({after:Math.max(0,Math.ceil((i+1)*paragraphs/groups)-1),start,count:size});start+=size;
  }
  return result;
}

function storyHTML(story,index){
  const groups=mediaGroups(story);
  const gallery=after=>groups.filter(g=>g.after===after).map(g=>mediaGallery(story.media.slice(g.start,g.start+g.count))).join('');
  return `<section id="story-${index}" class="story"><p class="story-status">${escapeHTML(story.status)}</p><h2>${escapeHTML(story.title)}</h2>${story.links?.length?`<div class="story-links">${story.links.filter(link=>safeHref(link.href)).map(link=>`<a href="${safeHref(link.href)}" target="_blank" rel="noopener noreferrer">${escapeHTML(link.label)} <span aria-hidden="true">↗</span></a>`).join('')}</div>`:''}<div class="story-copy">${story.paragraphs.map((p,i)=>`<p>${escapeHTML(p)}</p>${gallery(i)}`).join('')}</div>${gallery('end')}${story.note?`<p class="story-note">${escapeHTML(story.note)}</p>`:''}</section>`;
}

export function detailHTML(i){
  const r=records[i];
  return `<div class="detail-shell" style="--accent:${r.color}"><a class="back-link" href="#collection" id="detail-back">← Back to the collection</a><div class="detail-header"><div class="detail-art"><img id="detail-cover" src="${artURL(i)}" alt="Original ${escapeHTML(r.title)} sleeve artwork" /></div><div class="detail-intro"><h1 tabindex="-1">${escapeHTML(r.title)}</h1><p class="detail-deck">${escapeHTML(r.intro)}</p><p class="detail-subjects">${escapeHTML(r.subjects)}</p></div></div><p class="content-provenance">${r.id==='learning'?'Education and academic milestones from the supplied résumé. The worksheet’s honors section has no additional copy yet.':'Personal accounts from Nam’s website-content worksheet.'} Images marked “Mock image” are replaceable illustrations, not project photographs or supporting evidence.</p><div class="story-layout"><aside aria-label="On this record"><span>On this record</span>${r.stories.map((s,j)=>`<a href="#story-${j}">${escapeHTML(s.title)}</a>`).join('')}</aside><div class="stories">${r.stories.map(storyHTML).join('')}</div></div><div class="detail-end"><a href="#collection">← Return to my collection</a><button data-open="${(i+1)%8}">Next record: ${escapeHTML(records[(i+1)%8].title)} ↗</button></div><footer class="site-footer"><span>Nguyen Hai Nam</span><span>Personal records</span></footer></div>`;
}

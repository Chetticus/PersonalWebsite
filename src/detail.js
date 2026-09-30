import { records } from './content.js';
import { artURL } from './artwork.js';
const reflections=[
 'What did building a virtual record change about the way you listen to a physical one?',
 'Which design decision mattered most when the tool had to work without a connection?',
 'What did a learner teach you that changed your approach to teaching?',
 'Describe one test that failed, and the next change your team made.',
 'What evidence would change your mind about the question you are investigating?',
 'When did working with a team change your original idea?',
 'Which question from a class followed you into a project outside it?',
 'What do you notice on a long run that you miss at a desk?'
];
export function detailHTML(i){const r=records[i];return `<div class="detail-shell" style="--accent:${r.color}"><a class="back-link" href="#collection" id="detail-back">← Back to the collection</a><div class="detail-header"><div class="detail-art"><img id="detail-cover" src="${artURL(i)}" alt="Original ${r.title} sleeve artwork" /></div><div class="detail-intro"><h1 tabindex="-1">${r.title}</h1><p class="detail-deck">${r.intro}</p><p class="draft-note">Personal introduction · draft copy for review</p><p class="detail-subjects">${r.subjects}</p></div></div><div class="source-note"><span>About this preview</span><p>Project summaries are drawn from the supplied résumé. Personal reflections are draft copy; photographs, demonstrations, and supporting links are still to come.</p></div><div class="story-layout"><aside><span>On this record</span>${r.stories.map((s,j)=>`<a href="#story-${j}">${s[0]}</a>`).join('')}</aside><div class="stories">${r.stories.map((s,j)=>`<section id="story-${j}" class="story"><p class="story-status">${s[1]}</p><h2>${s[0]}</h2><p>${s[2]}</p></section>`).join('')}<section class="story-question"><span>Reflection to write · editorial prompt</span><p>${reflections[i]}</p></section><figure class="media-placeholder" style="margin-top:45px"><span>From the work</span><p>${r.media}</p><figcaption>Replaceable media placeholder</figcaption></figure></div></div><div class="detail-end"><a href="#collection">← Return to my collection</a><button data-open="${(i+1)%8}">Next record: ${records[(i+1)%8].title} ↗</button></div><footer class="site-footer"><span>Nguyen Hai Nam</span><span>Personal records</span></footer></div>`;}

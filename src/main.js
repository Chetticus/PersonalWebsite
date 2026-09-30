import './style.css';
import './home.css';
import { records } from './content.js';
import { portrait,introduction } from './identity.js';
import { artURL } from './artwork.js';
import { createListeningScene } from './scene.js';
import { detailHTML } from './detail.js';
import { MOTION,clamp,ease,scrollEase,LightingReveal } from './motion.js';

const $=s=>document.querySelector(s);
const home=$('#home'),detail=$('#detail'),index=$('#record-index'),media=matchMedia('(prefers-reduced-motion: reduce)');
let reduced=media.matches,active=0,current=null,savedY=history.state?.collectionY??0,fromCollection=false,routeToken=0;
let openingScene,collectionScene,autoFrame=0,autoInterrupted=false,autoConsumed=false,lightFrame=0,scrollFrame=0,restoreLit=false;
let openingLocked=false;
function setOpeningLocked(locked){
  openingLocked=locked;
  document.documentElement.classList.toggle('opening-locked',locked);
  $('#introduction').inert=locked;$('#collection').inert=locked;
  const skip=$('.skip-link');skip.href=locked?'#place-intro':'#introduction';skip.textContent=locked?'Place introductory record':'Skip to introduction';
  if(locked)scrollTo(0,0);
}
setOpeningLocked(!['#collection','#introduction',...records.map(r=>`#record/${r.id}`)].includes(location.hash));
const reveal=new LightingReveal();
history.scrollRestoration='manual';
document.documentElement.classList.toggle('reduced-motion',reduced);
document.querySelectorAll('.portrait-image').forEach(img=>{img.src=portrait.src;img.alt=portrait.alt;});
$('#portrait-caption').textContent=portrait.placeholder?'Portrait placeholder':'';
introduction.forEach((copy,i)=>{const el=$(`#checkpoint-${i+1}`);el.querySelector('h2').textContent=copy.title;el.querySelector('p').textContent=copy.text;});
records.forEach((r,i)=>{const img=new Image();img.src=artURL(i);});
index.innerHTML=records.map((r,i)=>`<a href="#record/${r.id}" data-open="${i}">${r.title}<span>↗</span></a>`).join('');
$('#record-list').innerHTML=records.map((r,i)=>`<a href="#record/${r.id}" data-open="${i}">${r.title}<span>↗</span></a>`).join('');
function closeIndex(){index.hidden=true;$('#index-toggle').setAttribute('aria-expanded','false');}
$('#index-toggle').onclick=()=>{index.hidden=!index.hidden;$('#index-toggle').setAttribute('aria-expanded',String(!index.hidden));};
document.addEventListener('pointerdown',e=>{if(!index.hidden&&!index.contains(e.target)&&!$('#index-toggle').contains(e.target))closeIndex();});

function selected(i){active=i;$('#active-title').textContent=records[i].title;$('#active-description').textContent=records[i].short;$('#place-record').setAttribute('aria-label',`Place ${records[i].title} on turntable`);}
function stateChanged(which,state,i){
  const opening=which==='opening',button=$(opening?'#place-intro':'#place-record'),status=$(opening?'#opening-status':'#collection-status');
  button.disabled=!['idle','returning','fallback'].includes(state);
  status.textContent=state==='dragging'?'Release over the platter. Escape to cancel.':state==='returning'?'Returning to the sleeve.':state==='settling'?'Settling onto the platter.':state==='spinning'?(opening?'A moment to settle in…':records[i].title):state==='playing'?(opening?'The story continues below.':`Opening ${records[i].title}…`):opening?'Nguyen Hai Nam · Introduction':'';
  if(opening&&['spinning','fallback'].includes(state))setOpeningLocked(false);
  if(opening&&state==='settling'){autoInterrupted=false;autoConsumed=false;}
  if(opening)$('#continue-intro').hidden=state!=='playing';
}
openingScene=createListeningScene($('#opening-scene'),{opening:true,reduced,onState:(s,i)=>stateChanged('opening',s,i),onComplete:()=>{
  $('#introduction').classList.add('started');
  if(!autoInterrupted&&!autoConsumed&&current===null&&$('#opening').getBoundingClientRect().bottom>innerHeight*.35){autoConsumed=true;scrollToIntroduction();}
}});
collectionScene=createListeningScene($('#collection-scene'),{reduced,onSelect:selected,onState:(s,i)=>stateChanged('collection',s,i),onComplete:i=>openRecord(i)});
selected(0);
if(!openingScene?.available)setOpeningLocked(false);
$('#place-intro').onclick=()=>{if(openingScene?.available){openingScene.place(0);}else scrollToIntroduction();};
$('#place-record').onclick=()=>{if(collectionScene?.available)collectionScene.place(active);else openRecord(active);};

function stopAuto(reason='visitor'){if(autoFrame){cancelAnimationFrame(autoFrame);autoFrame=0;}autoInterrupted=true;$('#opening').dataset.autoScroll=`cancelled-${reason}`;}
function scrollToIntroduction(){
  setOpeningLocked(false);
  autoInterrupted=false;
  const target=$('#introduction').offsetTop+60;
  if(reduced){scrollTo(0,target);$('#opening').dataset.autoScroll='complete';return;}
  cancelAnimationFrame(autoFrame);
  const stops=[...document.querySelectorAll('.checkpoint-content')].map(content=>{
    // Remove the reveal offset so framing does not depend on its current animation.
    const offset=new DOMMatrixReadOnly(getComputedStyle(content).transform).m42;
    return scrollY+content.getBoundingClientRect().top-offset-Math.max(64,(innerHeight-content.offsetHeight)/2);
  });
  stops.push($('#collection').offsetTop);
  let step=0,phase='moving',started=performance.now(),from=scrollY;
  const opening=$('#opening');
  opening.dataset.autoScroll='running';
  const tick=now=>{
    autoFrame=0;
    if(autoInterrupted||current!==null||document.hidden)return;
    opening.dataset.autoPhase=phase;
    opening.dataset.autoStop=String(step+1);
    if(phase==='moving'){
      const t=clamp((now-started)/MOTION.autoScrollMove);
      scrollTo(0,from+(stops[step]-from)*scrollEase(t));
      if(t===1){
        if(step===stops.length-1){opening.dataset.autoScroll='complete';opening.dataset.autoPhase='complete';return;}
        phase='paused';started=now;
      }
    }else if(now-started>=MOTION.autoScrollPauses[step]){
      step++;from=scrollY;started=now;phase='moving';
    }
    autoFrame=requestAnimationFrame(tick);
  };
  autoFrame=requestAnimationFrame(tick);
}
addEventListener('wheel',()=>stopAuto('wheel'),{passive:true});addEventListener('touchstart',()=>stopAuto('touch'),{passive:true});
addEventListener('pointerdown',()=>{if(autoFrame)stopAuto('pointer');},{passive:true});
addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','PageDown','PageUp','Home','End',' ','Escape','Tab'].includes(e.key))stopAuto('keyboard');});

function setReduced(value){reduced=value;document.documentElement.classList.toggle('reduced-motion',value);$('#motion-toggle').setAttribute('aria-pressed',String(value));$('#motion-toggle').textContent=value?'Motion reduced':'Reduce motion';openingScene?.reduce(value);collectionScene?.reduce(value);if(value)stopAuto('reduced-motion');updateScroll();}
$('#motion-toggle').onclick=()=>setReduced(!reduced);media.addEventListener('change',e=>setReduced(e.matches));
$('#motion-toggle').setAttribute('aria-pressed',String(reduced));$('#motion-toggle').textContent=reduced?'Motion reduced':'Reduce motion';

function cancelLighting(){cancelAnimationFrame(lightFrame);lightFrame=0;reveal.reset();collectionScene?.lighting(0);$('#collection').dataset.lightPhase='outside';$('#collection').dataset.lighting=JSON.stringify({level:0,enteredAt:null,startedAt:null,delay:MOTION.lightDelay});}
function inRevealZone(){const r=$('#collection').getBoundingClientRect(),sceneRect=$('#collection-scene').getBoundingClientRect();return current===null&&!document.hidden&&r.top<innerHeight*.78&&r.bottom>innerHeight*.12&&sceneRect.bottom>0&&sceneRect.top<innerHeight;}
function updateLighting(now=performance.now()){
  lightFrame=0;const inside=inRevealZone();
  const level=restoreLit&&inside?1:reveal.sample(now,inside,reduced);
  collectionScene?.lighting(level);
  $('#collection').dataset.lighting=JSON.stringify({level,enteredAt:reveal.enteredAt,startedAt:reveal.startedAt,delay:MOTION.lightDelay});
  $('#collection').dataset.lightPhase=!inside?'outside':level===0?'waiting':level<1?'rising':'ready';
  if(!inside){restoreLit=false;return;}
  if(level<1)lightFrame=requestAnimationFrame(updateLighting);
}
function updateScroll(){
  if(current!==null)return;
  const intro=$('#introduction'),r=intro.getBoundingClientRect();
  const progress=clamp((innerHeight*.68-r.top-90)/(intro.offsetHeight-170));
  $('#line-progress').style.transform=`scaleY(${reduced?1:progress})`;
  document.querySelectorAll('.checkpoint').forEach(el=>{
    const content=el.querySelector('.checkpoint-content');
    const amount=reduced||el.contains(document.activeElement)?1:ease((innerHeight*.94-content.getBoundingClientRect().top)/(innerHeight*.46));
    const revealed=Math.max(Number(el.dataset.reveal||0),amount);
    el.dataset.reveal=String(revealed);
    el.style.setProperty('--checkpoint-opacity',String(revealed));
    el.style.setProperty('--checkpoint-offset',`${24*(1-revealed)}px`);
    if(revealed===1)el.classList.add('revealed');
  });
  if(!lightFrame)updateLighting();
  if(!inRevealZone()){cancelLighting();restoreLit=false;}
}
addEventListener('scroll',()=>{if(openingLocked){if(scrollY!==0)scrollTo(0,0);return;}if(!scrollFrame)scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;updateScroll();});},{passive:true});
addEventListener('resize',()=>{stopAuto('resize');updateScroll();});
document.addEventListener('focusin',updateScroll);document.addEventListener('visibilitychange',()=>{if(document.hidden){stopAuto('hidden');cancelLighting();}else updateScroll();});
document.addEventListener('pointermove',e=>{if(reduced||current!==null)return;const x=(e.clientX/innerWidth-.5)*2,y=(e.clientY/innerHeight-.5)*2;openingScene?.light(x,y);collectionScene?.light(x,y);$('#portrait-surface').style.setProperty('--light-x',`${45+x*12}%`);},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>{openingScene?.light(0,0);collectionScene?.light(0,0);});

function focusRecord(i){const n=(i+8)%8;collectionScene?.select(n);if(!collectionScene)selected(n);$(`#collection-scene .sleeve-hit[data-record="${n}"]`)?.focus({preventScroll:true});}
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){openingScene?.cancel();collectionScene?.cancel();if(!index.hidden){closeIndex();$('#index-toggle').focus();}else if(current!==null)returnToCollection();return;}
  if(current!==null||!index.hidden||e.ctrlKey||e.metaKey||e.altKey)return;
  const r=$('#collection').getBoundingClientRect();
  if(r.top<innerHeight*.35&&r.bottom>innerHeight*.5&&['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();focusRecord(e.key==='Home'?0:e.key==='End'?7:active+(e.key==='ArrowRight'?1:-1));}
});

async function transfer(from,to,i){
  if(reduced||!from||!to)return;
  const img=new Image();img.className='transition-cover';img.src=artURL(i);img.alt='';Object.assign(img.style,{left:`${from.left}px`,top:`${from.top}px`,width:`${from.width}px`,height:`${from.height}px`});document.body.append(img);
  try{await img.animate([{left:`${from.left}px`,top:`${from.top}px`,width:`${from.width}px`,height:`${from.height}px`,transform:'rotate(-3deg)'},{left:`${to.left}px`,top:`${to.top}px`,width:`${to.width}px`,height:`${to.height}px`,transform:'rotate(0deg)'}],{duration:MOTION.cover,easing:'cubic-bezier(.22,.75,.18,1)',fill:'forwards'}).finished;}finally{img.remove();}
}
async function openRecord(i,push=true){
  setOpeningLocked(false);
  const token=++routeToken,wasHome=current===null;
  const from=wasHome?(push&&inRevealZone()?collectionScene?.getRect(i):null):$('#detail-cover')?.getBoundingClientRect();
  if(wasHome&&push){savedY=scrollY;fromCollection=true;history.replaceState({collectionY:savedY,active:i},'',location.href);}
  if(push)history[wasHome?'pushState':'replaceState']({record:i,collectionY:savedY,active:i,fromCollection},'',`#record/${records[i].id}`);
  active=i;current=i;stopAuto('navigation');cancelLighting();closeIndex();openingScene?.pause();collectionScene?.pause();home.hidden=true;detail.hidden=false;detail.innerHTML=detailHTML(i);document.body.classList.add('reading');scrollTo(0,0);document.title=`${records[i].title} — Nguyen Hai Nam`;
  const target=$('#detail-cover');target.style.visibility=reduced?'visible':'hidden';await transfer(from,target.getBoundingClientRect(),i);if(token!==routeToken)return;target.style.visibility='visible';$('.detail-intro h1').focus({preventScroll:true});
}
async function restoreCollection(state){
  setOpeningLocked(false);
  const token=++routeToken,was=current,from=$('#detail-cover')?.getBoundingClientRect();current=null;home.hidden=false;detail.hidden=true;document.body.classList.remove('reading');openingScene?.resume();collectionScene?.resume();collectionScene?.reset();active=state?.active??active;collectionScene?.select(active);selected(active);restoreLit=true;scrollTo(0,state?.collectionY??savedY??$('#collection').offsetTop);updateScroll();closeIndex();document.title='Nguyen Hai Nam — Personal records';
  if(was!==null)await transfer(from,collectionScene?.getRect(active),was);if(token!==routeToken)return;if(document.activeElement===document.body)$('#place-record').focus({preventScroll:true});
}
function returnToCollection(){if(fromCollection)history.back();else{history.replaceState({active,collectionY:savedY},'','#collection');restoreCollection({active,collectionY:savedY});}}
document.addEventListener('click',e=>{
  const opener=e.target.closest('[data-open]');if(opener){e.preventDefault();openRecord(Number(opener.dataset.open));return;}
  const anchor=e.target.closest('a[href^="#"]');if(!anchor)return;const href=anchor.getAttribute('href');
  if(href==='#collection'&&current!==null){e.preventDefault();returnToCollection();return;}
  if(openingLocked){e.preventDefault();$('#place-intro').focus({preventScroll:true});return;}
  const target=document.querySelector(href);if(target){e.preventDefault();stopAuto('navigation');closeIndex();openingScene?.cancel();collectionScene?.cancel();scrollTo({top:scrollY+target.getBoundingClientRect().top,behavior:reduced?'instant':'smooth'});}
});
addEventListener('popstate',()=>{const i=records.findIndex(r=>location.hash===`#record/${r.id}`);if(i>=0){fromCollection=Boolean(history.state?.fromCollection);openRecord(i,false);}else restoreCollection(history.state);});
const initial=records.findIndex(r=>location.hash===`#record/${r.id}`);
if(initial>=0){savedY=history.state?.collectionY??$('#collection').offsetTop;fromCollection=Boolean(history.state?.fromCollection);openRecord(initial,false);}
else if(['#collection','#introduction'].includes(location.hash))requestAnimationFrame(()=>{scrollTo(0,$(location.hash).offsetTop);updateScroll();});
updateScroll();

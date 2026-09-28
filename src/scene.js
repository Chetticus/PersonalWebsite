import * as THREE from 'three';
import { records } from './content.js';
import { portrait } from './identity.js';
import { artURL } from './artwork.js';
import { createTurntable,createVinyl } from './turntable.js';
import { createCrateModel } from './crate.js';
import { MOTION,ease } from './motion.js';

export function createListeningScene(host,{opening=false,reduced=false,onSelect=()=>{},onState=()=>{},onComplete=()=>{}}={}){
  let renderer;
  try{if(new URLSearchParams(location.search).get('graphics')==='off')throw new Error('Requested fallback');renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}
  catch{host.classList.add('no-graphics');host.closest('section').classList.add('graphics-fallback');return null;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.30;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;host.prepend(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-8,8,4.5,-4.5,.1,80);camera.position.set(4,10,17);camera.lookAt(0,1,0);
  const ambient=new THREE.HemisphereLight(0xd7dbd1,0x3c2a1a,1.1);scene.add(ambient);
  const lamp=new THREE.SpotLight(0xffd9a9,200,40,.87,1,1.4);lamp.position.set(-4,9,5);lamp.target.position.set(0,0,0);lamp.castShadow=true;lamp.shadow.mapSize.set(1024,1024);lamp.shadow.normalBias=.055;lamp.shadow.bias=-.001;scene.add(lamp,lamp.target);
  const rim=new THREE.DirectionalLight(0xccc8b2,1.7);rim.position.set(4,6,-4);scene.add(rim);
  const destinationLight=new THREE.PointLight(0xe5c492,8,8,2);destinationLight.position.set(-4,3.5,1);scene.add(destinationLight);
  let raf=0,last=0,visible=false,paused=false,graphicsAvailable=true,state='idle',active=0,isReduced=reduced,illumination=opening?1:0;
  let started=0,sequenceIndex=0,spinSpeed=0,notified=false,drag=null,pendingDrag=null,returnStart=null,settleStart=null,settleRotation=0,extractionAt=0;
  const stateHistory=[];
  const targetLight=new THREE.Vector3(-4,9,5),sampleTimes=[],loader=new THREE.TextureLoader();
  const texture=url=>{const t=loader.load(url,()=>wake());t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());return t;};
  const textures=records.map((_,i)=>texture(artURL(i))),wood=texture('/wood.jpg');wood.wrapS=wood.wrapT=THREE.RepeatWrapping;wood.repeat.set(2,1);
  const portraitCanvas=document.createElement('canvas');portraitCanvas.width=800;portraitCanvas.height=800;const pc=portraitCanvas.getContext('2d');pc.fillStyle='#77705b';pc.fillRect(0,0,800,800);
  const portraitTexture=new THREE.CanvasTexture(portraitCanvas);portraitTexture.colorSpace=THREE.SRGBColorSpace;
  const photo=new Image();photo.onload=()=>{const size=Math.min(photo.width,photo.height);pc.drawImage(photo,(photo.width-size)/2,(photo.height-size)/2,size,size,0,0,800,800);pc.fillStyle='#171a16';pc.fillRect(0,680,800,120);pc.fillStyle='#e9e4d9';pc.font='48px Georgia';pc.fillText('Nguyen Hai Nam',42,748);if(portrait.placeholder){pc.font='17px Arial';pc.fillStyle='#bcb8a8';pc.fillText('Portrait placeholder',44,778);}portraitTexture.needsUpdate=true;wake();};photo.src=portrait.src;
  const table=createTurntable();table.root.position.set(-3.5,0,0);table.root.scale.setScalar(.85);scene.add(table.root);
  const crate=createCrateModel(textures,wood);crate.root.position.set(opening?3.75:4.05,.08,opening?-.6:0);crate.root.scale.setScalar(opening?.62:.9);scene.add(crate.root);
  if(opening)crate.sleeves.forEach(({mesh})=>new Set(mesh.material).forEach(m=>m.color.multiplyScalar(.45)));
  const portraitSleeve=new THREE.Mesh(new THREE.BoxGeometry(3,3,.035),new THREE.MeshStandardMaterial({map:portraitTexture,roughness:.86}));portraitSleeve.position.set(2.1,1.95,2.2);portraitSleeve.rotation.y=-.16;portraitSleeve.castShadow=true;portraitSleeve.visible=opening;scene.add(portraitSleeve);
  const portraitProxy=portraitSleeve.clone();portraitProxy.material=new THREE.MeshBasicMaterial({visible:false});scene.add(portraitProxy);
  const vinyl=createVinyl(opening?portraitTexture:textures[0]);vinyl.root.scale.setScalar(.85);vinyl.root.visible=false;scene.add(vinyl.root);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(50,40),new THREE.ShadowMaterial({opacity:.22}));floor.rotation.x=-Math.PI/2;floor.position.y=-.03;floor.receiveShadow=true;scene.add(floor);
  const raycaster=new THREE.Raycaster(),mouse=new THREE.Vector2(),proxies=opening?[portraitProxy]:crate.sleeves.map(s=>s.proxy),hits=host.querySelector('.scene-hits');
  const buttons=(opening?[{title:'Nguyen Hai Nam introduction'}]:records).map((r,i)=>{const b=document.createElement('button');b.className='sleeve-hit';b.setAttribute('aria-label',`Select ${r.title} record`);b.dataset.record=i;b.addEventListener('focus',()=>select(i));b.addEventListener('click',()=>select(i));hits.append(b);return b;});
  function setState(next){state=next;started=performance.now();host.dataset.state=state;stateHistory.push({state,at:started,index:sequenceIndex});if(stateHistory.length>16)stateHistory.shift();host.dataset.stateHistory=JSON.stringify(stateHistory);host.dataset.discVisible=String(vinyl.root.visible);onState(state,sequenceIndex);wake();}
  function project(point){const p=point.clone().project(camera),r=host.getBoundingClientRect();return {x:r.left+(p.x*.5+.5)*r.width,y:r.top+(-p.y*.5+.5)*r.height};}
  function sourcePosition(i){scene.updateMatrixWorld(true);return opening?portraitSleeve.position.clone():crate.sleeves[i].pivot.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0,0,.15));}
  function targetPosition(){table.root.updateMatrixWorld(true);return table.root.localToWorld(table.discPosition.clone());}
  function setRay(e){const rect=host.getBoundingClientRect();mouse.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(mouse,camera);}
  function hit(e){setRay(e);scene.updateMatrixWorld(true);const fixed=raycaster.intersectObjects(proxies)[0];if(fixed)return opening?0:fixed.object.userData.index;const moved=raycaster.intersectObjects(opening?[portraitSleeve]:crate.sleeves.map(s=>s.mesh))[0];return moved?(opening?0:moved.object.userData.index):undefined;}
  function validDrop(e){const t=targetPosition(),c=project(t),edge=project(t.clone().add(new THREE.Vector3(2.3,0,0))),vertical=project(t.clone().add(new THREE.Vector3(0,0,2.4)));const rx=Math.max(85,Math.abs(edge.x-c.x)),ry=Math.max(58,Math.abs(vertical.y-c.y));return ((e.clientX-c.x)/rx)**2+((e.clientY-c.y)/ry)**2<=1;}
  function select(i){if(!['idle','returning'].includes(state))return;active=i;buttons.forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)));onSelect(i);wake();}
  function prepare(i){const resume=state==='returning'&&i===sequenceIndex;sequenceIndex=i;active=i;vinyl.label.material.map=opening?portraitTexture:textures[i];vinyl.label.material.needsUpdate=true;vinyl.root.visible=true;if(!resume){vinyl.root.position.copy(sourcePosition(i));vinyl.root.rotation.set(Math.PI/2,0,0);}spinSpeed=0;notified=false;}
  function settle(){drag=null;table.halo.material.opacity=.35;settleStart=vinyl.root.position.clone();settleRotation=vinyl.root.rotation.x;setState('settling');}
  function place(i=active){if(!['idle','returning'].includes(state))return false;prepare(i);settle();return true;}
  function cancel(){pendingDrag=null;if(state!=='dragging')return;drag=null;returnStart=vinyl.root.position.clone();settleRotation=vinyl.root.rotation.x;setState('returning');}
  renderer.domElement.addEventListener('pointerdown',e=>{
    if(e.button!==0||!['idle','returning'].includes(state))return;const i=hit(e);if(i===undefined)return;select(i);
    pendingDrag={i,x:e.clientX,y:e.clientY,pointer:e.pointerId};renderer.domElement.setPointerCapture(e.pointerId);e.preventDefault();
  });
  renderer.domElement.addEventListener('pointermove',e=>{
    if(pendingDrag&&Math.hypot(e.clientX-pendingDrag.x,e.clientY-pendingDrag.y)>5){
      const pending=pendingDrag;pendingDrag=null;prepare(pending.i);
      const normal=camera.getWorldDirection(new THREE.Vector3()),plane=new THREE.Plane().setFromNormalAndCoplanarPoint(normal,vinyl.root.position);setRay({clientX:pending.x,clientY:pending.y});const point=raycaster.ray.intersectPlane(plane,new THREE.Vector3());
      drag={plane,offset:vinyl.root.position.clone().sub(point),startX:pending.x,startY:pending.y,moved:true,pointer:pending.pointer,rotationX:vinyl.root.rotation.x};extractionAt=performance.now();setState('dragging');
    }
    if(state==='dragging'&&drag){setRay(e);const p=raycaster.ray.intersectPlane(drag.plane,new THREE.Vector3());if(p)vinyl.root.position.copy(p.add(drag.offset)).add(new THREE.Vector3(0,.14,.15));if(Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>5)drag.moved=true;table.halo.material.opacity=validDrop(e)?.65:.12;host.dataset.dropValid=String(validDrop(e));wake();return;}
    if(state!=='idle')return;const i=hit(e);renderer.domElement.style.cursor=i===undefined?'default':'grab';if(i!==undefined)select(i);
  });
  renderer.domElement.addEventListener('pointerup',e=>{pendingDrag=null;if(state==='dragging'&&drag){if(drag.moved&&validDrop(e))settle();else cancel();}if(renderer.domElement.hasPointerCapture(e.pointerId))renderer.domElement.releasePointerCapture(e.pointerId);});
  renderer.domElement.addEventListener('pointercancel',cancel);renderer.domElement.addEventListener('lostpointercapture',()=>{if(state==='dragging')cancel();});
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();graphicsAvailable=false;reset();paused=true;host.classList.add('no-graphics');host.closest('section').classList.add('graphics-fallback');onState('fallback',active);});
  function bounds(mesh){scene.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(mesh),ps=[];for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])ps.push(project(new THREE.Vector3(x,y,z)));const xs=ps.map(p=>p.x),ys=ps.map(p=>p.y);return {left:Math.min(...xs),top:Math.min(...ys),width:Math.max(...xs)-Math.min(...xs),height:Math.max(...ys)-Math.min(...ys)};}
  function positionHits(){const r=host.getBoundingClientRect();buttons.forEach((b,i)=>{const p=bounds(opening?portraitProxy:crate.sleeves[i].proxy);Object.assign(b.style,{left:`${p.left-r.left}px`,top:`${p.top-r.top}px`,width:`${p.width}px`,height:`${p.height}px`});});const target=project(targetPosition());host.dataset.platter=JSON.stringify({x:target.x-r.left,y:target.y-r.top});host.dataset.source=JSON.stringify(project(sourcePosition(active)));}
  function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h);const width=Math.max(15.2,9.1*w/h),height=width*h/w;camera.left=-width/2;camera.right=width/2;camera.top=height/2;camera.bottom=-height/2;camera.updateProjectionMatrix();camera.updateMatrixWorld();positionHits();wake();}
  function frame(now){raf=0;if(paused||!visible||document.hidden)return;const before=performance.now(),dt=Math.min((now-last)/1000||.016,.04);last=now;const a=isReduced?1:1-Math.exp(-MOTION.hoverRate*dt);let moving=0;
    crate.sleeves.forEach(({pivot,base,disc},i)=>{const selected=!opening&&i===active;const targetY=base.y+(selected?.72:0),targetX=base.x+(opening?0:i===active?0:Math.sign(i-active)*.13),rx=selected?-.12:i>active?-.075:.1;for(const [axis,target]of [['y',targetY],['x',targetX]]){const d=target-pivot.position[axis];pivot.position[axis]+=d*a;moving+=Math.abs(d);}const d=rx-pivot.rotation.x;pivot.rotation.x+=d*a;moving+=Math.abs(d);disc.visible=!(vinyl.root.visible&&sequenceIndex===i&&!opening);});
    const elapsed=now-started;
    if(state==='dragging'){const t=isReduced?1:ease((now-extractionAt)/MOTION.extraction);vinyl.root.rotation.x=(1-t)*(drag?.rotationX??Math.PI/2);moving+=.1;}
    if(state==='returning'){const t=isReduced?1:ease(elapsed/MOTION.return);vinyl.root.position.lerpVectors(returnStart,sourcePosition(sequenceIndex),t);vinyl.root.rotation.x=THREE.MathUtils.lerp(settleRotation,Math.PI/2,t);moving+=1;if(t===1){vinyl.root.visible=false;table.halo.material.opacity=.08;setState('idle');}}
    if(state==='settling'){const t=ease(elapsed/(isReduced?100:MOTION.settle));vinyl.root.position.lerpVectors(settleStart,targetPosition(),t);vinyl.root.position.y+=Math.sin(t*Math.PI)*.4;vinyl.root.rotation.x=settleRotation*(1-t);moving+=1;if(t===1){table.halo.material.opacity=.08;setState('spinning');}}
    if(state==='spinning'||state==='playing'){
      if(state==='spinning')moving+=1; // Keep the short reduced-motion acknowledgement alive.
      if(!isReduced){spinSpeed=Math.min(1,spinSpeed+dt*1000/MOTION.spinUp);vinyl.root.rotation.y+=dt*3.49*ease(spinSpeed);table.platter.rotation.y=vinyl.root.rotation.y;moving+=1;}
      const armTarget=-.44;const d=armTarget-table.arm.rotation.y;table.arm.rotation.y+=d*a;moving+=Math.abs(d);
      if(state==='spinning'&&elapsed>=(isReduced?140:opening?MOTION.introductionPlay:MOTION.sectionPlay)&&!notified){notified=true;setState('playing');onComplete(sequenceIndex);}
    }else{const d=-table.arm.rotation.y;table.arm.rotation.y+=d*a;moving+=Math.abs(d);}
    const quiet=['settling','spinning','playing'].includes(state),lightGoal=quiet?new THREE.Vector3(-4,9,5):targetLight;moving+=lamp.position.distanceTo(lightGoal);lamp.position.lerp(lightGoal,a);
    ambient.intensity=.32+1.05*illumination;lamp.intensity=20+180*illumination;rim.intensity=.2+1.5*illumination;destinationLight.intensity=state==='dragging'?18:6;
    renderer.render(scene,camera);sampleTimes.push(performance.now()-before);if(sampleTimes.length>180)sampleTimes.shift();const frames=Number(host.dataset.frames||0)+1;host.dataset.frames=frames;host.dataset.renderStats=JSON.stringify({frames,idle:moving<.002,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,cpuSubmitMedianMs:[...sampleTimes].sort((a,b)=>a-b)[Math.floor(sampleTimes.length/2)]});
    if(moving>.002)wake();
  }
  function wake(){if(!raf&&visible&&!paused&&!document.hidden)raf=requestAnimationFrame(frame);}
  function reset(){pendingDrag=null;drag=null;vinyl.root.visible=false;spinSpeed=0;notified=false;table.arm.rotation.y=0;table.halo.material.opacity=.08;setState('idle');}
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(!visible){cancelAnimationFrame(raf);raf=0;if(['dragging','settling','spinning'].includes(state))reset();}else wake();},{threshold:0}).observe(host);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;if(['dragging','settling','spinning'].includes(state))reset();}else wake();});
  setState('idle');
  return {select,place,cancel,reset,get available(){return graphicsAvailable;},get state(){return state;},getRect(i=active){return bounds(opening?portraitSleeve:crate.sleeves[i].mesh);},light(x,y){targetLight.set(-4+x*1.3,9-y*.4,5+x*.4);wake();},lighting(value){if(value!==illumination){illumination=value;wake();}},reduce(value){isReduced=value;wake();},pause(){paused=true;cancelAnimationFrame(raf);raf=0;reset();},resume(){paused=!graphicsAvailable;resize();wake();}};
}

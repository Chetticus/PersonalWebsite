import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// Original geometry and deterministic material maps; no external turntable assets.
function surface(kind){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
  const ctx=canvas.getContext('2d'),pixels=ctx.createImageData(512,512);
  let seed=71;const noise=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let y=0;y<512;y++)for(let x=0;x<512;x++){
    const grain=Math.sin(y*.38+Math.sin(x*.009)*5+Math.sin(y*.043)*3+Math.sin(x*.023+y*.008)*2);
    const fine=Math.sin(y*2.1+Math.sin(x*.016)*2);
    const v=kind==='wood'?grain*15+fine*5+(noise()-.5)*9:(noise()-.5)*18+Math.sin(y*3.1)*12;
    const base=kind==='wood'?[78,46,27]:[160,164,165];const i=(y*512+x)*4;
    for(let c=0;c<3;c++)pixels.data[i+c]=base[c]+v;pixels.data[i+3]=255;
  }
  ctx.putImageData(pixels,0,0);const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;map.wrapS=map.wrapT=THREE.RepeatWrapping;map.anisotropy=4;return map;
}
export function createTurntable(){
  const root=new THREE.Group(),grain=surface('wood'),brush=surface('metal');
  const charcoal=new THREE.MeshStandardMaterial({color:0x202426,roughness:.4,metalness:.65,map:brush,bumpMap:brush,bumpScale:.006});
  const metal=new THREE.MeshStandardMaterial({color:0xc4c9ca,roughness:.32,metalness:.85});
  const deck=new THREE.MeshStandardMaterial({color:0x858d90,map:brush,bumpMap:brush,bumpScale:.008,roughness:.38,metalness:.72});
  const rubber=new THREE.MeshStandardMaterial({color:0x111315,roughness:.9});
  const walnut=new THREE.MeshStandardMaterial({map:grain,bumpMap:grain,bumpScale:.025,roughness:.43});
  const brass=new THREE.MeshStandardMaterial({color:0xbba16b,metalness:.78,roughness:.28});
  const mesh=(geo,mat,x,y,z,parent=root)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=!mat.transparent;m.receiveShadow=!mat.transparent;parent.add(m);return m;};
  const box=(w,h,d,x,y,z,mat=charcoal,parent=root,r=.025)=>mesh(new RoundedBoxGeometry(w,h,d,2,Math.min(r,h/3,w/3,d/3)),mat,x,y,z,parent);
  const cylinder=(r,h,x,y,z,mat=metal,parent=root)=>mesh(new THREE.CylinderGeometry(r,r,h,64),mat,x,y,z,parent);
  const ring=(r,t,y,mat,parent=root,x=0,z=0)=>{const m=mesh(new THREE.TorusGeometry(r,t,6,96),mat,x,y,z,parent);m.rotation.x=Math.PI/2;return m;};
  for(const x of [-2.35,2.35])for(const z of [-1.65,1.65]){
    cylinder(.34,.17,x,.13,z,rubber);cylinder(.36,.10,x,.25,z,metal);
    for(let n=0;n<3;n++)ring(.345,.012,.19+n*.04,charcoal,root,x,z);
  }
  box(5.94,.61,4.62,0,.49,0,walnut,root,.13);
  box(5.78,.045,4.46,0,.81,0,rubber,root,.06);
  box(5.70,.10,4.38,0,.875,0,deck,root,.07);
  // Recessed motor housing and a polished lip give the platter a real bearing stack.
  cylinder(1.96,.045,-.65,.945,.12,charcoal);
  const platter=new THREE.Group();platter.position.set(-.65,1.01,.12);root.add(platter);
  cylinder(1.89,.23,0,0,0,metal,platter);
  for(let n=0;n<3;n++)ring(1.89,.012,-.075+n*.06,charcoal,platter);
  const dots=new THREE.InstancedMesh(new THREE.SphereGeometry(.019,6,4),metal,180);
  const matrix=new THREE.Matrix4();for(let i=0;i<180;i++){const a=(i%90)/90*Math.PI*2;matrix.makeTranslation(Math.cos(a)*1.9,-.045+Math.floor(i/90)*.075,Math.sin(a)*1.9);dots.setMatrixAt(i,matrix);}platter.add(dots);
  cylinder(1.81,.055,0,.14,0,rubber,platter);
  for(let n=0;n<12;n++)ring(.67+n*.094,.006,.169,charcoal,platter);
  cylinder(.048,.24,-.65,1.24,.12,metal);cylinder(.085,.026,-.65,1.15,.12,brass);
  const halo=mesh(new THREE.RingGeometry(1.92,1.955,96),new THREE.MeshBasicMaterial({color:0xd8bd84,transparent:true,opacity:.08,side:THREE.DoubleSide,depthWrite:false}),-.65,1.02,.12);halo.rotation.x=-Math.PI/2;
  cylinder(.42,.18,1.91,.99,-1.18,charcoal);ring(.36,.025,1.09,metal,root,1.91,-1.18);cylinder(.26,.20,1.91,1.17,-1.18,metal);
  const arm=new THREE.Group();arm.position.set(1.91,1.37,-1.18);root.add(arm);
  const tube=mesh(new THREE.CylinderGeometry(.046,.046,2.67,18),metal,0,0,.88,arm);tube.rotation.x=Math.PI/2;
  const weight=cylinder(.18,.40,0,0,-.54,charcoal,arm);weight.rotation.x=Math.PI/2;
  for(let n=0;n<4;n++){const collar=ring(.181,.008,0,metal,arm);collar.rotation.x=0;collar.position.z=-.69+n*.08;}
  box(.25,.1,.50,-.08,-.02,2.28,charcoal,arm);box(.12,.12,.18,-.08,-.12,2.44,brass,arm);
  box(.11,.4,.14,1.93,1.07,.25,charcoal);
  // Inset controls, fasteners, and a restrained warm power indicator.
  cylinder(.22,.025,-2.38,.94,1.75,charcoal);cylinder(.17,.06,-2.38,.975,1.75,metal);
  cylinder(.10,.025,-1.92,.95,1.75,charcoal);cylinder(.075,.045,-1.92,.975,1.75,brass);
  const led=mesh(new THREE.CircleGeometry(.026,16),new THREE.MeshBasicMaterial({color:0xe5aa4d}),-2.38,.94,1.40);led.rotation.x=-Math.PI/2;
  box(.18,.012,1.3,2.43,.936,.93,rubber);box(.25,.065,.14,2.43,.97,.85,metal);
  for(let i=0;i<9;i++)box(i===4?.10:.055,.007,.012,2.23,.939,.4+i*.13,charcoal);
  for(const x of [-2.65,2.65])for(const z of [-1.98,1.98]){cylinder(.043,.012,x,.935,z,metal);box(.052,.005,.01,x,.943,z,charcoal);}
  return {root,platter,arm,halo,discPosition:new THREE.Vector3(-.65,1.2,.12)};
}

export function createVinyl(texture){
  const root=new THREE.Group();
  const body=new THREE.Mesh(new THREE.CylinderGeometry(1.73,1.73,.028,96),new THREE.MeshStandardMaterial({color:0x101412,metalness:.35,roughness:.28}));body.castShadow=true;root.add(body);
  const label=new THREE.Mesh(new THREE.CircleGeometry(.59,64),new THREE.MeshStandardMaterial({map:texture,roughness:.75,side:THREE.DoubleSide}));label.rotation.x=-Math.PI/2;label.position.y=.016;root.add(label);
  for(let i=0;i<8;i++){const ring=new THREE.Mesh(new THREE.RingGeometry(.8+i*.11,.804+i*.11,96),new THREE.MeshStandardMaterial({color:0x252c25,roughness:.5,metalness:.2,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.019;root.add(ring);}
  const hole=new THREE.Mesh(new THREE.CircleGeometry(.033,16),new THREE.MeshBasicMaterial({color:0x080908}));hole.rotation.x=-Math.PI/2;hole.position.y=.018;root.add(hole);
  return {root,label};
}

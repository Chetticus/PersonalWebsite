import * as THREE from 'three';
import { records } from './content.js';

// Our modern risq/cratedigger adaptation: five low panels, thin box sleeves,
// staggered base positions, and selected/pushed/pulled poses.
export function createCrateModel(textures,woodTexture){
  const root=new THREE.Group(), sleeves=[];
  const wood=new THREE.MeshStandardMaterial({color:0x514030,map:woodTexture,roughness:.8});
  const box=(w,h,d,x,y,z,mat=wood)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;root.add(m);return m;};
  box(6.5,.18,5.1,0,.05,0);box(.18,1.2,5.1,-3.2,.67,0);box(.18,1.2,5.1,3.2,.67,0);box(6.5,1.15,.18,0,.64,-2.5);box(6.5,.70,.18,0,.40,2.5);
  const brass=new THREE.MeshStandardMaterial({color:0x9e8257,metalness:.55,roughness:.5});box(6.5,.055,.22,0,.775,2.5,brass);
  for(const x of [-2.96,2.96])for(const y of [.2,.62]){const m=new THREE.Mesh(new THREE.SphereGeometry(.033,8,6),brass);m.position.set(x,y,2.605);root.add(m);}
  records.forEach((r,i)=>{
    const base=new THREE.Vector3((i-3.5)*.42,1.80+i*.026,1.7-i*.49);
    const pivot=new THREE.Group();pivot.position.copy(base);pivot.rotation.y=-.12;root.add(pivot);
    const edge=new THREE.MeshStandardMaterial({color:r.color,roughness:.94}),front=new THREE.MeshStandardMaterial({map:textures[i],roughness:.88});
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(3.18,3.18,.032),[edge,edge,edge,edge,front,edge]);mesh.castShadow=true;mesh.receiveShadow=true;mesh.userData.index=i;pivot.add(mesh);
    const disc=new THREE.Mesh(new THREE.CylinderGeometry(1.48,1.48,.016,64),new THREE.MeshStandardMaterial({color:0x101512,metalness:.3,roughness:.32}));disc.rotation.x=Math.PI/2;disc.position.set(.15,.21,-.035);pivot.add(disc);
    const proxy=new THREE.Mesh(new THREE.BoxGeometry(3.18,3.18,.05),new THREE.MeshBasicMaterial({visible:false}));proxy.position.copy(base);proxy.rotation.y=-.12;proxy.userData.index=i;root.add(proxy);
    const highlight=new THREE.Mesh(new THREE.BoxGeometry(3.16,.018,.037),new THREE.MeshBasicMaterial({color:0xf4dcb0,transparent:true,opacity:0,depthWrite:false}));highlight.position.y=1.59;pivot.add(highlight);
    sleeves.push({pivot,base,mesh,proxy,disc,highlight});
  });
  return {root,sleeves};
}

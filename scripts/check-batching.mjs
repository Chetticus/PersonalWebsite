import assert from 'node:assert/strict';
import * as THREE from 'three';
import { batchStaticMeshes } from '../src/mesh-batching.js';

const root=new THREE.Group(),material=new THREE.MeshStandardMaterial();
for(const x of [-2,2]){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(1,2,3),material);
  mesh.position.set(x,.4,1);mesh.rotation.y=.3;mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);
}
const moving=new THREE.Group(),arm=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),material);moving.add(arm);root.add(moving);
const glass=new THREE.Mesh(new THREE.BoxGeometry(2,1,2),new THREE.MeshPhysicalMaterial({transparent:true,opacity:.1}));root.add(glass);
const bounds=new THREE.Box3().setFromObject(root),triangles=root.children.slice(0,2).reduce((n,m)=>n+m.geometry.index.count/3,0);
batchStaticMeshes(root);
const combined=root.children.find(m=>m.isMesh&&m.material===material);
assert.equal(root.children.length,3);
assert.equal(moving.children[0],arm,'animated child groups must retain their geometry owner');
assert.equal(glass.parent,root,'transparent surfaces must remain separate for sorting');
assert.equal(combined.geometry.attributes.position.count/3,triangles,'batching must retain all triangles');
assert.ok(combined.castShadow&&combined.receiveShadow);
const result=new THREE.Box3().setFromObject(root);
assert.ok(bounds.min.distanceTo(result.min)<1e-6&&bounds.max.distanceTo(result.max)<1e-6,'local transforms must survive batching');
console.log('Static batching preserves bounds, triangles, shadows, transparent sorting, and animated groups.');

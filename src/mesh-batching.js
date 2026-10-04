import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Batch only rigid opaque siblings. Arm, platter, lid, and sleeves keep their owners.
export function batchStaticMeshes(group){
  const batches=new Map();
  for(const mesh of group.children){
    if(!mesh.isMesh||mesh.isInstancedMesh||Array.isArray(mesh.material)||mesh.material.transparent)continue;
    const key=`${mesh.material.uuid}/${mesh.castShadow}/${mesh.receiveShadow}`;
    if(!batches.has(key))batches.set(key,[]);
    batches.get(key).push(mesh);
  }
  for(const meshes of batches.values()){
    if(meshes.length<2)continue;
    const parts=meshes.map(mesh=>{mesh.updateMatrix();const geometry=mesh.geometry.index?mesh.geometry.toNonIndexed():mesh.geometry.clone();geometry.applyMatrix4(mesh.matrix);geometry.clearGroups();return geometry;});
    const geometry=mergeGeometries(parts,false);
    parts.forEach(part=>part.dispose());
    if(!geometry)continue;
    geometry.computeBoundingSphere();
    const combined=new THREE.Mesh(geometry,meshes[0].material);
    combined.castShadow=meshes[0].castShadow;combined.receiveShadow=meshes[0].receiveShadow;
    meshes.forEach(mesh=>{group.remove(mesh);mesh.geometry.dispose();});
    group.add(combined);
  }
}

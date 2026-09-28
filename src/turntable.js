import * as THREE from 'three';

// Original geometry. tkex/threejs-turntable was studied as a form reference;
// its source and assets are not reused because no reuse license was found.
export function createTurntable(){
  const root=new THREE.Group();
  const charcoal=new THREE.MeshStandardMaterial({color:0x222723,roughness:.46,metalness:.25});
  const metal=new THREE.MeshStandardMaterial({color:0xa5ada5,roughness:.28,metalness:.8});
  const rubber=new THREE.MeshStandardMaterial({color:0x111310,roughness:.85});
  const walnut=new THREE.MeshStandardMaterial({color:0x493628,roughness:.6});
  const brass=new THREE.MeshStandardMaterial({color:0xb19a68,metalness:.65,roughness:.38});
  const mesh=(geo,mat,x,y,z,parent=root)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
  const box=(w,h,d,x,y,z,mat=charcoal,parent=root)=>mesh(new THREE.BoxGeometry(w,h,d),mat,x,y,z,parent);
  const cylinder=(r,h,x,y,z,mat=metal,parent=root)=>mesh(new THREE.CylinderGeometry(r,r,h,64),mat,x,y,z,parent);
  for(const x of [-2.35,2.35])for(const z of [-1.65,1.65]){cylinder(.3,.25,x,.15,z,rubber);cylinder(.31,.08,x,.28,z,metal);}
  box(5.8,.45,4.5,0,.54,0,walnut);
  box(5.9,.12,4.6,0,.825,0,charcoal);
  const platter=new THREE.Group();platter.position.set(-.65,1.01,.12);root.add(platter);
  cylinder(1.89,.23,0,0,0,metal,platter);
  cylinder(1.81,.055,0,.14,0,rubber,platter);
  for(let n=0;n<4;n++){
    const ring=mesh(new THREE.TorusGeometry(1.885,.009,5,96),metal,0,-.08+n*.047,0,platter);ring.rotation.x=Math.PI/2;
  }
  cylinder(.048,.24,-.65,1.24,.12,metal);
  cylinder(.085,.026,-.65,1.15,.12,brass);
  const halo=mesh(new THREE.RingGeometry(1.92,1.955,96),new THREE.MeshBasicMaterial({color:0xd8bd84,transparent:true,opacity:.08,side:THREE.DoubleSide,depthWrite:false}),-.65,1.02,.12);halo.rotation.x=-Math.PI/2;
  // A raised transparent dust cover: separate thin panels, no CSG dependency.
  const glass=new THREE.MeshPhysicalMaterial({color:0x9ca79b,roughness:.15,metalness:.1,transparent:true,opacity:.105,depthWrite:false,side:THREE.DoubleSide});
  const lid=new THREE.Group();lid.position.set(0,.94,-2.18);lid.rotation.x=-1.10;root.add(lid);
  box(5.72,.025,4.32,0,0,2.16,glass,lid);
  box(.025,.38,4.32,-2.85,-.18,2.16,glass,lid);box(.025,.38,4.32,2.85,-.18,2.16,glass,lid);box(5.72,.38,.025,0,-.18,4.30,glass,lid);
  for(const x of [-2,2])box(.42,.2,.2,x,.96,-2.19,metal);
  cylinder(.42,.18,1.91,.99,-1.18,charcoal);cylinder(.26,.20,1.91,1.17,-1.18,metal);
  const arm=new THREE.Group();arm.position.set(1.91,1.37,-1.18);root.add(arm);
  const tube=mesh(new THREE.CylinderGeometry(.046,.046,2.67,18),metal,0,0,.88,arm);tube.rotation.x=Math.PI/2;
  const weight=cylinder(.18,.40,0,0,-.54,charcoal,arm);weight.rotation.x=Math.PI/2;
  box(.25,.1,.50,-.08,-.02,2.28,charcoal,arm);box(.12,.12,.18,-.08,-.12,2.44,brass,arm);
  box(.11,.4,.14,1.93,1.07,.25,charcoal);
  cylinder(.14,.045,-2.38,.91,1.75,metal);cylinder(.085,.05,-1.98,.91,1.75,brass);
  const led=mesh(new THREE.CircleGeometry(.035,16),new THREE.MeshBasicMaterial({color:0xc99b50}),-2.38,.94,1.45);led.rotation.x=-Math.PI/2;
  box(.06,.02,1.1,2.43,.90,.93,metal);box(.24,.05,.1,2.43,.94,.85,charcoal);
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

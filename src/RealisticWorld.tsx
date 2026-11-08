import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { assessmentColors, entities, type Attribute } from './content';
import { Atmosphere, Sea, useMaterials, type Materials } from './rendering';

export type Viewpoint='harbour'|'approach'|'aerial';
type Point=[number,number,number];
function Box({p,s,m,rotation=0}:{p:Point;s:Point;m:THREE.Material;rotation?:number}){return <mesh position={p} rotation={[0,rotation,0]} material={m} castShadow receiveShadow><boxGeometry args={s}/></mesh>}
const coast:[number,number][]=[[-230,55],[-180,50],[-135,49],[-105,46],[-80,49],[-58,45],[-40,48],[-17,43],[9,40],[28,34],[45,35],[52,27],[73,28],[78,16],[91,10],[100,-9],[115,-18],[130,-11],[145,12],[180,80],[240,180],[-250,180]];
const island:[number,number][]=[[-185,-58],[-151,-64],[-120,-62],[-102,-60],[-76,-61],[-57,-59],[-37,-57],[-18,-55],[-10,-50],[-12,-44],[-20,-40],[-42,-39],[-68,-40],[-95,-41],[-122,-44],[-150,-48],[-180,-48]];
function Land({points,m}:{points:[number,number][];m:THREE.Material}){const geometry=useMemo(()=>{const shape=new THREE.Shape();points.forEach(([x,z],i)=>i?shape.lineTo(x,-z):shape.moveTo(x,-z));shape.closePath();return new THREE.ExtrudeGeometry(shape,{depth:1.9,bevelEnabled:true,bevelSize:.22,bevelThickness:.2,bevelSegments:2});},[points]);return <mesh geometry={geometry} material={m} rotation={[-Math.PI/2,0,0]} position={[0,-.3,0]} receiveShadow/>}

function Lighthouse({m,tint,onSelect}:{m:Materials;tint:string|null;onSelect:()=>void}){
 const stone=useMemo(()=>tint?new THREE.MeshStandardMaterial({color:tint,map:m.tower.map,normalMap:m.tower.normalMap,roughness:.93,flatShading:true}):m.tower,[m,tint]);
 return <group position={[-19,1.65,-48]} onClick={e=>{e.stopPropagation();onSelect()}}>
  <Box p={[0,.1,0]} s={[17,.6,17]} m={m.masonry}/><Box p={[0,.6,0]} s={[14.5,.45,14.5]} m={m.masonry}/>
  <Box p={[0,1,0]} s={[12.2,.4,12.2]} m={m.masonry}/>
  <mesh position={[0,9.7,0]} rotation={[0,Math.PI/4,0]} castShadow receiveShadow material={stone}><cylinderGeometry args={[5.7,6.7,17,4]}/></mesh>
  <Box p={[0,18.4,0]} s={[9.2,.45,9.2]} m={m.masonry}/><Box p={[0,18.8,0]} s={[9.7,.4,9.7]} m={m.masonry}/>
  <Box p={[0,19.15,0]} s={[9,.35,9]} m={stone}/>
  {[0,1,2,3].map(side=><group key={side} rotation={[0,side*Math.PI/2,0]}>
   {[4.3,7.7,11.1,14.5].map((y,i)=><group key={i}><Box p={[0,y,4.42-i*.1]} s={[.55,1.15,.09]} m={m.dark}/><Box p={[0,y-.65,4.47-i*.1]} s={[.8,.16,.3]} m={m.masonry}/></group>)}
   {[-3.5,3.5].map(x=><Box key={x} p={[x,19.7,4.1]} s={[.45,1.25,.45]} m={m.masonry}/>)}
  </group>)}
  <mesh position={[0,23.4,0]} material={stone} castShadow receiveShadow><cylinderGeometry args={[2.6,3.1,8.1,8]}/></mesh>
  {[0,1,2,3,4,5,6,7].map(i=><group key={i} rotation={[0,i*Math.PI/4,0]}><Box p={[0,23.9,2.76]} s={[.4,1.4,.08]} m={m.dark}/></group>)}
  <mesh position={[0,27.65,0]} material={m.masonry} castShadow><cylinderGeometry args={[3.25,3.25,.45,8]}/></mesh>
  <mesh position={[0,30.3,0]} material={stone} castShadow><cylinderGeometry args={[1.75,1.95,4.9,24]}/></mesh>
  {[0,1,2,3,4,5,6,7].map(i=><group rotation={[0,i*Math.PI/4,0]} key={i}><Box p={[0,30.5,1.85]} s={[.34,1.45,.08]} m={m.dark}/></group>)}
  <mesh position={[0,33,0]} material={m.masonry}><cylinderGeometry args={[2.35,2.35,.5,24]}/></mesh>
  {[0,1,2,3,4,5,6,7].map(i=><mesh key={i} position={[Math.cos(i*Math.PI/4)*1.77,34.15,Math.sin(i*Math.PI/4)*1.77]} material={m.masonry} castShadow><cylinderGeometry args={[.12,.17,1.8,10]}/></mesh>)}
  <mesh position={[0,35.15,0]} material={m.masonry}><cylinderGeometry args={[2.1,2.25,.5,24]}/></mesh>
  <mesh position={[0,35.6,0]} material={stone}><sphereGeometry args={[1.85,24,12,0,Math.PI*2,0,Math.PI/2]}/></mesh>
  <mesh position={[0,34.1,0]}><sphereGeometry args={[.3,12,8]}/><meshStandardMaterial color="#a7551d" emissive="#de9b40" emissiveIntensity={1.3}/></mesh>
  <Box p={[0,2.35,4.65]} s={[1.15,2.3,.12]} m={m.dark}/>
  {Array.from({length:7},(_,i)=><Box key={i} p={[0,.35+i*.22,7-i*.3]} s={[2.7,.3,.65]} m={m.masonry}/>)}
 </group>
}

function Pediment({m}:{m:THREE.Material}){const geo=useMemo(()=>{const s=new THREE.Shape();s.moveTo(-6.5,0);s.lineTo(0,2.5);s.lineTo(6.5,0);s.closePath();return new THREE.ExtrudeGeometry(s,{depth:18,bevelEnabled:false});},[]);return <mesh geometry={geo} material={m} position={[0,6.7,-9]} castShadow/>;}
function Temple({p,m,scale=1}:{p:Point;m:Materials;scale?:number}){return <group position={p} scale={scale}>
 {[0,1,2].map(i=><Box key={i} p={[0,i*.23,0]} s={[14-i*.65,.28,19-i*.65]} m={m.masonry}/>)}
 <Box p={[0,3.05,-1]} s={[8,4.8,12]} m={m.plaster}/>
 {[-5.3,5.3].map(x=>[-7.6,-4.55,-1.5,1.5,4.55,7.6].map(z=><group key={`${x}-${z}`} position={[x,.7,z]}><mesh position={[0,2.55,0]} material={m.plaster} castShadow><cylinderGeometry args={[.33,.47,4.8,20]}/></mesh><Box p={[0,.1,0]} s={[1,.2,1]} m={m.masonry}/><Box p={[0,5,0]} s={[1,.3,1]} m={m.masonry}/></group>))}
 <Box p={[0,6.2,0]} s={[13,.75,18]} m={m.masonry}/><Pediment m={m.roof}/>
 <Box p={[0,2.3,5.05]} s={[1.9,3.5,.15]} m={m.dark}/>
 </group>}

type Instance={p:Point;s:Point;color?:string;rotation?:number};
function Boxes({items,material}:{items:Instance[];material:THREE.Material}){const ref=useRef<THREE.InstancedMesh>(null);useLayoutEffect(()=>{const obj=new THREE.Object3D(),c=new THREE.Color();items.forEach((v,i)=>{obj.position.set(...v.p);obj.scale.set(...v.s);obj.rotation.set(0,v.rotation||0,0);obj.updateMatrix();ref.current!.setMatrixAt(i,obj.matrix);if(v.color)ref.current!.setColorAt(i,c.set(v.color));});ref.current!.instanceMatrix.needsUpdate=true;if(ref.current!.instanceColor)ref.current!.instanceColor.needsUpdate=true;},[items]);return <instancedMesh ref={ref} args={[undefined,material,items.length]} castShadow receiveShadow><boxGeometry/></instancedMesh>}
function Town({m}:{m:Materials}){const {walls,details,windows,roofs}=useMemo(()=>{
 const walls:Instance[]=[],details:Instance[]=[],windows:Instance[]=[],roofs:Instance[]=[];
 for(let row=0;row<11;row++)for(let col=0;col<39;col++){
  const n=Math.abs(Math.sin(row*80.3+col*36.7)),x=-171+col*8.7,z=54+row*8.2;
  if((x>29&&x<94&&z<80)||(x>-42&&x<-14&&z<79))continue;
  const h=2.2+n*3.3,w=4.3+n*2,d=5.2+n*1.8;
  walls.push({p:[x,1.7+h/2,z],s:[w,h,d],color:col%5===0?'#b9ac95':col%3===0?'#d0c9b4':'#e0d9c8'});
  roofs.push({p:[x,1.73+h,z],s:[w+.25,.18,d+.25],color:col%4===0?'#9e7d63':'#c9bea7'});
  details.push({p:[x-w/2,1.95+h,z],s:[.18,.45,d]},{p:[x+w/2,1.95+h,z],s:[.18,.45,d]},{p:[x,1.95+h,z-d/2],s:[w,.45,.18]},{p:[x,1.95+h,z+d/2],s:[w,.45,.18]});
  windows.push({p:[x,2.6,z-d/2-.03],s:[.7,1.7,.08]});
  if(h>3.2)for(const off of [-1.4,1.4])windows.push({p:[x+off,4.5,z-d/2-.04],s:[.55,.85,.07]});
 }
 return {walls,details,windows,roofs};
 },[]);return <group><Boxes items={walls} material={m.plaster}/><Boxes items={roofs} material={m.ground}/><Boxes items={details} material={m.plaster}/><Boxes items={windows} material={m.dark}/></group>}

function Palm({x,z,m,height=6}:{x:number;z:number;m:Materials;height?:number}){
 const trunk=useMemo(()=>new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,0),new THREE.Vector3(.2,height*.5,0),new THREE.Vector3(.6,height,.1)]),12,.18,8,false),[height]);
 const leaf=useMemo(()=>{const vertices:number[]=[];for(let i=0;i<14;i++){const t=i/14,t2=(i+1)/14;const a=new THREE.Vector3(t*2.8,Math.sin(t*Math.PI)*.8-t*.6,0),b=new THREE.Vector3(t2*2.8,Math.sin(t2*Math.PI)*.8-t2*.6,0);const w=.35*Math.sin(t*Math.PI);vertices.push(a.x,a.y,-w,b.x,b.y,0,a.x,a.y,w);vertices.push(a.x,a.y,w,b.x,b.y,.35*Math.sin(t2*Math.PI),b.x,b.y,0);}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.computeVertexNormals();return g;},[]);
 return <group position={[x,1.5,z]}><mesh geometry={trunk} material={m.wood} castShadow/>{Array.from({length:10},(_,i)=><mesh key={i} geometry={leaf} position={[.6,height,.1]} rotation={[0,i*Math.PI*.2,i%2*.12]} castShadow><meshStandardMaterial color={i%2?'#4f5734':'#697043'} roughness={.85} side={THREE.DoubleSide}/></mesh>)}</group>
}

function Ship({p,rotation=0,scale=1,m,motion}:{p:Point;rotation?:number;scale?:number;m:Materials;motion:boolean}){
 const ref=useRef<THREE.Group>(null);const hull=useMemo(()=>{
  const points=[new THREE.Vector2(0,-.9),new THREE.Vector2(.5,-.8),new THREE.Vector2(1.1,-.3),new THREE.Vector2(1.4,.45),new THREE.Vector2(1.5,.75)];const g=new THREE.LatheGeometry(points,32);g.scale(1,1,3.4);return g;
 },[]);
 const sail=useMemo(()=>{const geo=new THREE.PlaneGeometry(6.2,4.4,20,20),a=geo.attributes.position;for(let i=0;i<a.count;i++){const x=a.getX(i),y=a.getY(i);a.setZ(i,Math.sin((x/6.2+.5)*Math.PI)*Math.sin((y/4.4+.5)*Math.PI)*.8);}geo.computeVertexNormals();return geo;},[]);
 useFrame(({clock})=>{if(ref.current&&motion){ref.current.rotation.z=Math.sin(clock.elapsedTime*.65+p[0])*.018;ref.current.position.y=p[1]+Math.sin(clock.elapsedTime*.7+p[0])*.055;}});
 return <group position={p} rotation={[0,rotation,0]} scale={scale}><group ref={ref}>
  <mesh geometry={hull} material={m.wood} castShadow receiveShadow/>
  <Box p={[0,.15,0]} s={[2.5,.2,7.3]} m={m.wood}/><Box p={[0,4.3,0]} s={[.16,9,.16]} m={m.wood}/><Box p={[0,7.25,.05]} s={[7,.14,.14]} m={m.wood}/>
  <mesh geometry={sail} position={[0,5,.1]} castShadow><meshStandardMaterial color="#bcb4a0" roughness={.95} side={THREE.DoubleSide}/></mesh>
  {[-3,3].map(z=><Box key={z} p={[0,.6,z]} s={[1.8,.8,.6]} m={m.wood}/>)}
 </group></group>
}
function Quay({m}:{m:Materials}){return <group>
 <Box p={[0,.7,41]} s={[78,2.1,5]} m={m.masonry}/><Box p={[0,1.9,41]} s={[79,.3,5.4]} m={m.ground}/>
 {[-28,-8,13,31].map(x=><group key={x}><Box p={[x,.35,33]} s={[3.2,1.3,13]} m={m.wood}/>{[-1,1].map(sign=>[28,33,38].map(z=><mesh key={`${sign}-${z}`} position={[x+sign*1.25,1.5,z]} material={m.wood} castShadow><cylinderGeometry args={[.19,.23,2,10]}/></mesh>))}</group>)}
 {[-32,-18,0,18,34].map(x=><mesh key={x} position={[x,2.4,39]} material={m.bronze} castShadow><cylinderGeometry args={[.28,.4,.85,12]}/></mesh>)}
 {[-25,-20,6,10,24].map((x,i)=><group key={x}><Box p={[x,2.6,42]} s={[1.3,1.3,1.3]} m={m.wood}/><Box p={[x,3.4,42]} s={[1,.4,1]} m={m.wood}/>{i%2===0&&<mesh position={[x+1.2,2.5,41.5]} material={m.roof} castShadow><latheGeometry args={[[new THREE.Vector2(.12,0),new THREE.Vector2(.38,.35),new THREE.Vector2(.4,.7),new THREE.Vector2(.15,.95),new THREE.Vector2(.13,1.1)],16]}/></mesh>}</group>)}
 </group>}
function ShoreRocks({m}:{m:Materials}){return <group>{Array.from({length:150},(_,i)=>{const x=-177+(i%75)*2.1,z=(i<75?-43:-60)+Math.sin(i*.63)*2;return <mesh key={i} position={[x,.05,z]} scale={[.8+Math.sin(i)*.3,.45,1.2]} rotation={[i*.3,i*.7,0]} material={m.masonry} castShadow><icosahedronGeometry args={[1,2]}/></mesh>})}</group>}

function CameraRig({selected,focusKey,viewpoint}:{selected:string;focusKey:number;viewpoint:Viewpoint}){
 const controls=useRef<any>(null);const {camera}=useThree();const dest=useRef(new THREE.Vector3(-64,13,-105)),target=useRef(new THREE.Vector3(28,11,32)),moving=useRef(false);
 useEffect(()=>{const poses:Record<Viewpoint,{eye:Point;target:Point}>={harbour:{eye:[-64,13,-105],target:[28,11,32]},approach:{eye:[-46,9,-86],target:[-19,19,-48]},aerial:{eye:[100,105,145],target:[-10,0,5]}};const pose=poses[viewpoint];dest.current.set(...pose.eye);target.current.set(...pose.target);moving.current=true;},[viewpoint]);
 useEffect(()=>{if(!focusKey)return;const e=entities.find(e=>e.id===selected)!;target.current.set(e.position[0],e.id==='pharos'?16:4,e.position[2]);dest.current.set(e.position[0]+30,e.id==='pharos'?10:14,e.position[2]+45);moving.current=true;},[focusKey,selected]);
 useFrame((_,dt)=>{if(!moving.current||!controls.current)return;const amount=window.matchMedia('(prefers-reduced-motion: reduce)').matches?1:1-Math.exp(-dt*2.6);camera.position.lerp(dest.current,amount);controls.current.target.lerp(target.current,amount);controls.current.update();if(camera.position.distanceTo(dest.current)<.04)moving.current=false;});
 return <OrbitControls ref={controls} makeDefault target={[28,11,32]} minDistance={12} maxDistance={430} minPolarAngle={.12} maxPolarAngle={Math.PI*.485} enableDamping dampingFactor={.055} onStart={()=>moving.current=false}/>;
}
function MarkerPositions({nodes}:{nodes:React.RefObject<Record<string,HTMLDivElement|null>>}){const {camera,size}=useThree();const point=useMemo(()=>new THREE.Vector3(),[]);useFrame(()=>{for(const e of entities){const node=nodes.current[e.id];if(!node)continue;point.set(e.position[0],e.id==='pharos'?39:6,e.position[2]).project(camera);node.style.display=point.z>1||point.z< -1||Math.abs(point.x)>.95||Math.abs(point.y)>.87?'none':'block';node.style.transform=`translate(${(point.x*.5+.5)*size.width}px,${(-point.y*.5+.5)*size.height}px) translate(-50%,-100%)`;}});return null;}
function Harbour({selected,onSelect,overlay,attribute,focusKey,viewpoint,hour,motion,nodes}:{selected:string;onSelect:(id:string)=>void;overlay:boolean;attribute:Attribute;focusKey:number;viewpoint:Viewpoint;hour:number;motion:boolean;nodes:React.RefObject<Record<string,HTMLDivElement|null>>}){
 const m=useMaterials();const causeway=useMemo(()=>overlay?new THREE.MeshStandardMaterial({color:assessmentColors[entities.find(e=>e.id==='heptastadion')!.assessments[attribute]],map:m.masonry.map,roughness:1}):m.masonry,[overlay,attribute,m]);
 return <><Atmosphere hour={hour}/><Sea hour={hour} motion={motion}/><Land points={coast} m={m.ground}/><Land points={island} m={m.ground}/><Town m={m}/><ShoreRocks m={m}/>
  <group onClick={e=>{e.stopPropagation();onSelect('heptastadion')}}><Box p={[-71,.85,4]} s={[6,2.3,92]} m={causeway}/><Box p={[-71,2.1,4]} s={[6.3,.2,92]} m={m.ground}/></group>
  <Lighthouse m={m} tint={overlay?assessmentColors[entities[0].assessments[attribute]]:null} onSelect={()=>onSelect('pharos')}/>
  <group onClick={e=>{e.stopPropagation();onSelect('royal-quarter')}}><Box p={[65,2.1,37]} s={[49,1,25]} m={m.masonry}/><Temple p={[64,2.7,34]} m={m} scale={1.15}/><Box p={[85,4.4,36]} s={[11,4,18]} m={m.plaster}/><Box p={[43,4.4,40]} s={[10,4,17]} m={m.plaster}/></group>
  <Land points={[[34,4],[43,1],[49,6],[47,16],[39,19],[33,12]]} m={m.ground}/><Temple p={[41,1.6,10]} m={m} scale={.55}/><Temple p={[-29,1.6,67]} m={m} scale={.85}/>
  <group onClick={e=>{e.stopPropagation();onSelect('harbour')}}><Quay m={m}/></group>
  {[[-145,-54],[-122,-53],[-98,-50],[-78,-51],[-55,-48],[-38,-49],[35,49],[44,52],[78,51],[89,49],[101,31],[112,18],[-45,56],[-4,54]].map(([x,z],i)=><Palm key={i} x={x} z={z} m={m} height={5.4+i%3*.7}/>)}
  <Ship p={[-7,.2,-18]} rotation={.45} scale={1.3} m={m} motion={motion}/><Ship p={[32,.2,-29]} rotation={-.6} scale={.85} m={m} motion={motion}/><Ship p={[-30,.2,24]} rotation={1.3} scale={.8} m={m} motion={motion}/><Ship p={[8,.2,28]} scale={.8} m={m} motion={motion}/><Ship p={[69,.2,-22]} rotation={1.8} scale={.9} m={m} motion={motion}/>
  <CameraRig selected={selected} focusKey={focusKey} viewpoint={viewpoint}/><MarkerPositions nodes={nodes}/>
 </>;
}
function ContextWatch({onFailure}:{onFailure:()=>void}){const {gl}=useThree();useEffect(()=>{const canvas=gl.domElement;const lost=(event:Event)=>{event.preventDefault();onFailure()};canvas.addEventListener('webglcontextlost',lost);return()=>canvas.removeEventListener('webglcontextlost',lost)},[gl,onFailure]);return null;}
export default function RealisticWorld({selected,onSelect,overlay,attribute,focusKey,onFailure,viewpoint='harbour',hour=16,motion=true}:{selected:string;onSelect:(id:string)=>void;overlay:boolean;attribute:Attribute;focusKey:number;onFailure:()=>void;viewpoint?:Viewpoint;hour?:number;motion?:boolean}){
 const markerNodes=useRef<Record<string,HTMLDivElement|null>>({});
 return <><Canvas shadows dpr={[1,1.5]} camera={{position:[-64,13,-105],fov:50,near:.3,far:4500}} gl={{antialias:true,alpha:false,powerPreference:'high-performance'}} onCreated={({gl})=>{gl.domElement.setAttribute('aria-label','Interactive 3D reconstruction study of Alexandria harbour');}} fallback={<div className="canvas-fallback">3D is unavailable. Open Reading view to inspect the historical evidence.</div>}>
  <ContextWatch onFailure={onFailure}/>
  <Harbour selected={selected} onSelect={onSelect} overlay={overlay} attribute={attribute} focusKey={focusKey} viewpoint={viewpoint} hour={hour} motion={motion} nodes={markerNodes}/>
 </Canvas><div className="marker-layer">{entities.filter(e=>e.id!=='mouseion').map(e=><div className="world-marker" key={e.id} ref={node=>{markerNodes.current[e.id]=node}}><button className={`world-label ${selected===e.id?'selected':''}`} onClick={()=>onSelect(e.id)} aria-label={`Select ${e.name}`}><span>{e.number}</span>{e.name}</button></div>)}</div></>;
}

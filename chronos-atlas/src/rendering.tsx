import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Water } from 'three/addons/objects/Water.js';

export function useMaterials() {
  const maps=useLoader(THREE.TextureLoader,[
    '/materials/masonry-Diffuse.jpg','/materials/masonry-nor_gl.jpg','/materials/masonry-Rough.jpg',
    '/materials/stone-Diffuse.jpg','/materials/stone-nor_gl.jpg','/materials/stone-Rough.jpg'
  ]);
  return useMemo(()=>{
    maps.forEach((t,i)=>{t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;if(i%3===0)t.colorSpace=THREE.SRGBColorSpace;});
    const make=(start:number,repeat:number,color:string)=>{const textures=maps.slice(start,start+3).map(t=>{const clone=t.clone();clone.repeat.set(repeat,repeat);return clone;});return new THREE.MeshStandardMaterial({color,map:textures[0],normalMap:textures[1],roughnessMap:textures[2],roughness:1,normalScale:new THREE.Vector2(.48,.48)});};
    const masonry=make(0,2,'#e8e4da'),tower=make(0,5,'#e3ded0'),plaster=make(3,2,'#d0c8b3'),ground=make(0,.7,'#e5dfd1');
    tower.flatShading=true;
    const woodCanvas=document.createElement('canvas');woodCanvas.width=256;woodCanvas.height=256;const ctx=woodCanvas.getContext('2d')!;ctx.fillStyle='#76614c';ctx.fillRect(0,0,256,256);for(let i=0;i<256;i++){const v=Math.sin(i*2.7)*11+Math.sin(i*.43)*8;ctx.fillStyle=`rgb(${111+v},${89+v},${66+v})`;ctx.fillRect(i,0,1,256);}for(let j=0;j<8;j++){ctx.fillStyle='#40392d';ctx.fillRect(j*32,0,1,256);}const woodMap=new THREE.CanvasTexture(woodCanvas);woodMap.colorSpace=THREE.SRGBColorSpace;woodMap.wrapS=woodMap.wrapT=THREE.RepeatWrapping;
    return {masonry,tower,plaster,ground,wood:new THREE.MeshStandardMaterial({map:woodMap,roughness:.87}),roof:new THREE.MeshStandardMaterial({color:'#8c6651',roughness:.96}),dark:new THREE.MeshStandardMaterial({color:'#282e29',roughness:.92}),bronze:new THREE.MeshStandardMaterial({color:'#55513a',metalness:.55,roughness:.56})};
  },[maps]);
}
export type Materials=ReturnType<typeof useMaterials>;
export function Atmosphere({hour}:{hour:number}){
  const {gl,scene}=useThree();const warmth=(hour-12)/6;const sunPosition:[number,number,number]=[-110,120-warmth*106,-95];
  useEffect(()=>{gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.05;scene.environmentIntensity=.45;},[gl,scene]);
  return <><Environment files="/materials/sky.hdr" background backgroundBlurriness={.04} backgroundIntensity={.75-warmth*.18} environmentIntensity={.65-warmth*.25} environmentRotation={[0,2.3,0]}/><fog attach="fog" args={['#a2b0b6',200,1000]}/><hemisphereLight args={['#bfccd6','#756a57',.7]}/><directionalLight position={sunPosition} intensity={3.4-warmth*.8} color={warmth>.7?'#ffd3a5':'#fff3e1'} castShadow shadow-mapSize={[4096,4096]} shadow-camera-left={-155} shadow-camera-right={155} shadow-camera-top={130} shadow-camera-bottom={-130} shadow-camera-far={380} shadow-normalBias={.08} shadow-bias={-.0001}/></>;
}
export function Sea({hour,motion}:{hour:number;motion:boolean}){
  const normalTexture=useLoader(THREE.TextureLoader,'/materials/water-normal.jpg');
  const water=useMemo(()=>{
    normalTexture.wrapS=normalTexture.wrapT=THREE.RepeatWrapping;normalTexture.anisotropy=8;
    const mesh=new Water(new THREE.PlaneGeometry(4000,4000),{textureWidth:512,textureHeight:512,waterNormals:normalTexture,sunDirection:new THREE.Vector3(-.8,.4,-.7),sunColor:0xffe3bb,waterColor:0x24535b,distortionScale:1.6,fog:true,alpha:1});mesh.rotation.x=-Math.PI/2;mesh.position.y=-.28;return mesh;
  },[normalTexture]);
  useEffect(()=>{const material=water.material as THREE.ShaderMaterial;material.uniforms.sunDirection.value.set(-.8,.9-(hour-12)*.13,-.7).normalize();material.uniforms.sunColor.value.set(hour>16?'#ffd1a0':'#fff2db');},[water,hour]);
  useFrame((_,delta)=>{if(motion)(water.material as THREE.ShaderMaterial).uniforms.time.value+=Math.min(delta,.04)*.36;});
  useEffect(()=>()=>{water.geometry.dispose();water.material.dispose()},[water]);
  return <primitive object={water}/>;
}

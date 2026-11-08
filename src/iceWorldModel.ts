export type IcePoint=[number,number,number];
export type IceViewpoint='valley'|'mammoths'|'ridge'|'river';
export const ICE_WORLD_BOUND=420;
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const smooth=(a:number,b:number,x:number)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
function hash(x:number,z:number){const n=Math.sin(x*127.1+z*311.7)*43758.5453;return n-Math.floor(n)}
function noise(x:number,z:number){const ix=Math.floor(x),iz=Math.floor(z),fx=x-ix,fz=z-iz,u=fx*fx*(3-2*fx),v=fz*fz*(3-2*fz);return mix(mix(hash(ix,iz),hash(ix+1,iz),u),mix(hash(ix,iz+1),hash(ix+1,iz+1),u),v)}
export function terrainNoise(x:number,z:number){let sum=0,amp=.55,scale=.012;for(let i=0;i<5;i++){sum+=noise(x*scale+23,z*scale-17)*amp;amp*=.48;scale*=2.07}return sum;}
export function riverCenter(z:number){return 19*Math.sin(z*.012)+12*Math.sin(z*.027)+5;}
export function terrainHeight(x:number,z:number){
 const distance=Math.abs(x-riverCenter(z));
 const hills=6+terrainNoise(x,z)*19;
 const sides=smooth(105,380,Math.abs(x))*Math.pow(terrainNoise(x*.7,z*.8),1.3)*180;
 const distant=smooth(80,380,-z)*terrainNoise(x,z*.7)*95;
 const ground=hills+sides+distant;
 return mix(-2.8+noise(x*.06,z*.06)*.5,ground,smooth(11,34,distance));
}
export function canWalkAt(x:number,z:number){return Math.abs(x)<=ICE_WORLD_BOUND&&Math.abs(z)<=ICE_WORLD_BOUND&&Math.abs(x-riverCenter(z))>18&&terrainHeight(x,z)>1;}
export function groundPoint(x:number,z:number,eye=0):IcePoint{return [x,terrainHeight(x,z)+eye,z]}
export function clampIcePosition(x:number,z:number){return {x:Math.max(-ICE_WORLD_BOUND,Math.min(ICE_WORLD_BOUND,x)),z:Math.max(-ICE_WORLD_BOUND,Math.min(ICE_WORLD_BOUND,z))};}
export const iceHotspots=[
 {id:'steppe',label:'The mammoth steppe',articleId:'beringia-landscape',x:-63,z:-35,viewpoint:'mammoths' as IceViewpoint,summary:'A broad, largely unglaciated landscape could support large herbivores. This terrain and herd are illustrative, not a reconstructed fossil locality.',sourceUrl:'https://www.nps.gov/subjects/beringia/nature.htm',sourceLabel:'National Park Service · Beringia nature',certainty:'The regional habitat is supported. This exact valley and animal placement are artistic choices.'},
 {id:'herd',label:'Woolly mammoths',articleId:'last-mammoths',x:-86,z:-17,viewpoint:'mammoths' as IceViewpoint,summary:'Mammoths inhabited Beringia during the Pleistocene. The herd here represents living animals around 21,000 years ago; the linked article also follows their much later extinction.',sourceUrl:'https://www.nps.gov/articles/aps-17-1-4.htm',sourceLabel:'National Park Service · Pleistocene megafauna',certainty:'Animal form, behaviour and herd composition are illustrative. No particular herd or fossil specimen is claimed.'},
 {id:'river',label:'Changing land and water',articleId:'beringia-landscape',x:52,z:20,viewpoint:'river' as IceViewpoint,summary:'Lower glacial seas exposed the Bering land connection. The river in this scene is a scenic interpretation; it is not a surveyed ancient watercourse or the Bering Strait.',sourceUrl:'https://www.nps.gov/subjects/beringia/about.htm',sourceLabel:'National Park Service · About Beringia',certainty:'Exposed land is supported; this river, terrain and exact shoreline are not historical measurements.'},
 {id:'ridge',label:'Cold climate, varied terrain',articleId:'last-glacial-maximum',x:180,z:-190,viewpoint:'ridge' as IceViewpoint,summary:'The last glacial peak affected regions differently. Here, seasonal snow lies on high ground above an open valley; most of Beringia was not beneath a continental ice sheet.',sourceUrl:'https://www.nps.gov/subjects/beringia/nature.htm',sourceLabel:'National Park Service · Cold, dry and ice-free Beringia',certainty:'Snow coverage, weather, mountain shapes and lighting are illustrative. No exact season or site is established.'},
 {id:'people',label:'People and movement',articleId:'beringia-landscape',x:-115,z:92,viewpoint:'valley' as IceViewpoint,summary:'Beringia matters to the peopling of the Americas. Routes and dates require archaeological and genetic evidence; this scene does not place a known camp or claim a particular migration event.',sourceUrl:'https://www.nps.gov/subjects/beringia/about.htm',sourceLabel:'National Park Service · People of Beringia',certainty:'This is a context viewpoint, not a mapped settlement, human trackway or proposed exact migration route.'}
];
export function iceViewPose(view:IceViewpoint):{eye:IcePoint;target:IcePoint}{
 if(view==='mammoths')return {eye:groundPoint(-30,12,5),target:groundPoint(-69,-30,2)};
 if(view==='ridge')return {eye:groundPoint(138,-130,25),target:groundPoint(230,-230,8)};
 if(view==='river')return {eye:groundPoint(53,60,4),target:groundPoint(0,-100,4)};
 return {eye:groundPoint(115,155,35),target:groundPoint(-35,-95,8)};
}

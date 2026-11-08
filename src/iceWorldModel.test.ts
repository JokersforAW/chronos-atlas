import {describe,it,expect} from 'vitest';
import {iceEntries} from './iceAge';
import {canWalkAt,clampIcePosition,groundPoint,iceHotspots,iceViewPose,riverCenter,terrainHeight} from './iceWorldModel';
describe('explorable Ice Age landscape',()=>{
 it('produces finite deterministic terrain and a lower river bed',()=>{for(let x=-400;x<=400;x+=50)for(let z=-400;z<=400;z+=50){expect(Number.isFinite(terrainHeight(x,z))).toBe(true);expect(terrainHeight(x,z)).toBe(terrainHeight(x,z));}expect(terrainHeight(riverCenter(30),30)).toBeLessThan(0);expect(terrainHeight(-70,30)).toBeGreaterThan(1);});
 it('keeps walking on dry terrain and inside the playable area',()=>{expect(canWalkAt(riverCenter(30),30)).toBe(false);expect(canWalkAt(-70,30)).toBe(true);expect(canWalkAt(-500,0)).toBe(false);expect(clampIcePosition(-999,999)).toEqual({x:-420,z:420});});
 it('links every hotspot to a real article and an HTTPS source',()=>{expect(new Set(iceHotspots.map(h=>h.id)).size).toBe(iceHotspots.length);for(const h of iceHotspots){expect(iceEntries.some(e=>e.id===h.articleId)).toBe(true);expect(new URL(h.sourceUrl).protocol).toBe('https:');expect(h.certainty.length).toBeGreaterThan(30);}});
 it('places all camera presets above the local ground',()=>{for(const view of ['valley','mammoths','ridge','river'] as const){const pose=iceViewPose(view);expect(pose.eye[1]).toBeGreaterThan(terrainHeight(pose.eye[0],pose.eye[2]));expect(pose.eye.every(Number.isFinite)).toBe(true);}expect(groundPoint(-70,30,1.75)[1]-terrainHeight(-70,30)).toBeCloseTo(1.75);});
});

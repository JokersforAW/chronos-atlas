import { describe,it,expect } from 'vitest';
import { iceEntries,iceSources,readLibraryState,searchIceEntries } from './iceAge';
describe('Ice Age knowledge collection',()=>{
 it('publishes ten entries with valid evidence, dates and related-entry references',()=>{
  expect(iceEntries).toHaveLength(10);
  expect(new Set(iceEntries.map(e=>e.id)).size).toBe(iceEntries.length);
  expect(new Set(iceSources.map(s=>s.id)).size).toBe(iceSources.length);
  const claims=iceEntries.flatMap(e=>e.evidence);expect(new Set(claims.map(c=>c.id)).size).toBe(claims.length);
  for(const e of iceEntries){expect(e.age.oldest).toBeGreaterThanOrEqual(e.age.youngest);expect(e.age.youngest).toBeGreaterThan(0);expect(e.age.basis.length).toBeGreaterThan(20);expect(e.uncertainty.length).toBeGreaterThan(30);expect(e.evidence.length).toBeGreaterThan(0);for(const r of e.related)expect(iceEntries.some(other=>other.id===r)).toBe(true);for(const c of e.evidence){expect(iceSources.some(s=>s.id===c.sourceId)).toBe(true);expect(c.locator.length).toBeGreaterThan(0);expect(c.limitation.length).toBeGreaterThan(20);}}
  for(const s of iceSources){expect(new URL(s.url).protocol).toBe('https:');expect(s.accessed).toBe('2026-11-08');}
 });
 it('finds subjects through aliases and claim text',()=>{expect(searchIceEntries('cave paintings').map(e=>e.id)).toContain('chauvet-art');expect(searchIceEntries('sea level').map(e=>e.id)).toContain('beringia-landscape');expect(searchIceEntries('400,000').map(e=>e.id)).toContain('neanderthal-world');expect(searchIceEntries('nonexistent term')).toHaveLength(0);});
 it('filters and sorts chronology in both directions',()=>{expect(searchIceEntries('','Wildlife').map(e=>e.id)).toEqual(['last-mammoths']);expect(searchIceEntries('','All','oldest')[0].id).toBe('ice-age-cycle');expect(searchIceEntries('','All','newest')[0].id).toBe('last-mammoths');});
 it('keeps mammoth survival separate from the end of the last glacial period',()=>{const mammoths=iceEntries.find(e=>e.id==='last-mammoths')!;expect(mammoths.aftermath).toBe(true);expect(mammoths.age.youngest).toBe(4000);expect(iceEntries.find(e=>e.id==='holocene-transition')!.age.youngest).toBe(11700);expect(mammoths.evidence.find(c=>c.id==='mammoth-causes')!.assessment).toBe('Interpretation');});
 it('restores valid collection links and safely defaults malformed or cross-collection IDs',()=>{expect(readLibraryState('?collection=ice-age&article=chauvet-art')).toEqual({collection:'ice-age',article:'chauvet-art'});expect(readLibraryState('?collection=alexandria&article=pharos')).toEqual({collection:'alexandria',article:'pharos'});expect(readLibraryState('?collection=ice-age&article=pharos')).toEqual({collection:'ice-age',article:'ice-age-cycle'});expect(readLibraryState('?collection=bad&article=bad')).toEqual({collection:'ice-age',article:'ice-age-cycle'});});
});

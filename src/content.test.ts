import {describe,it,expect} from 'vitest';
import {entities,claims,passages,sources,decisions,readState,searchEntities} from './content';
describe('published prototype evidence',()=>{
  it('has unique stable IDs and no dangling evidence references',()=>{
    for(const records of [entities,claims,passages,sources,decisions])expect(new Set(records.map(r=>r.id)).size).toBe(records.length);
    for(const claim of claims){expect(entities.some(e=>e.id===claim.entityId)).toBe(true);expect(claim.passageIds.length).toBeGreaterThan(0);for(const id of claim.passageIds)expect(passages.some(p=>p.id===id)).toBe(true);expect(claim.rationale.length).toBeGreaterThan(20);}
    for(const p of passages){expect(sources.some(s=>s.id===p.sourceId)).toBe(true);expect(p.locator.length).toBeGreaterThan(0);}
    for(const d of decisions)for(const id of d.claimIds)expect(claims.some(c=>c.id===id)).toBe(true);
  });
  it('keeps Library location unknown and later evidence temporally qualified',()=>{expect(entities.find(e=>e.id==='mouseion')?.assessments.location).toBe('Undetermined');expect(passages.find(p=>p.id==='coin-study')?.applicability).toContain('Later');});
  it('restores shared state and safely defaults malformed values',()=>{expect(readState('?entity=harbour&view=library&attribute=location&overlay=1').entity).toBe('harbour');expect(readState('?entity=bad&view=bad&attribute=bad')).toMatchObject({entity:'pharos',view:'explore',attribute:'appearance'});});
  it('searches supporting claims, not only landmark titles',()=>{expect(searchEntities('Qaitbay').map(e=>e.id)).toContain('pharos');expect(searchEntities('nonexistent term')).toHaveLength(0);});
  it('restores lighting and camera presets while rejecting invalid values',()=>{expect(readState('?hour=17.5&camera=approach')).toMatchObject({hour:17.5,viewpoint:'approach'});for(const hour of ['NaN','Infinity','-10','99'])expect(readState(`?hour=${hour}&camera=invalid`)).toMatchObject({hour:16,viewpoint:'harbour'});});
});

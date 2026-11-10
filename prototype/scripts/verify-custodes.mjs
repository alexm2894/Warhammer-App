import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {currentUnit,splitIds,choices} from '../lib/custodes-revision.ts';
import {mergeCatalogue} from '../lib/update-storage.ts';
import {rankUnits} from '../lib/search.ts';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const units=read('data/catalogue.json').filter(u=>u.faction==='Adeptus Custodes');
const cards=read('data/snapshots.json').filter(u=>u.faction==='Adeptus Custodes');
assert.equal(cards.length,36);assert.deepEqual(cards.map(c=>c.id).sort(),units.map(u=>u.id).sort());
assert.equal(new Set(units.map(u=>u.url)).size,36);
assert.equal(cards.filter(c=>c.source.book.includes('Legends')).length,7);
assert.equal(cards.filter(c=>c.source.book.includes('Forge World')).length,2);
assert.equal(cards.flatMap(c=>c.weapons).length,116);
for(const c of cards){assert.ok(currentUnit(c));assert.equal(c.source.edition,11);assert.match(c.source.book,/11th edition/);assert.deepEqual(c.profiles[0].stats.map(v=>v.label),['M','T','SV','W','LD','OC']);assert.ok(c.sizes.length&&c.sections.some(s=>s.title==='ABILITIES'));}
const a=cards.find(c=>c.name==='Contemptor-Achillus Dreadnought');
assert.ok(a.url.endsWith('/Contemptor-Achillus-Dreadnought'));assert.match(JSON.stringify(a.sections),/Unyielding Ancient/);assert.doesNotMatch(JSON.stringify(a.sections),/Dread Foe/i);
assert.deepEqual(a.profiles[0].stats.map(v=>v.value),['9"','10','2+','12','5+','3']);assert.equal(a.invulnerableSave,'5+');
const stale={...a,rulesRevision:undefined,url:a.url.replace('Achillus','achillus')};
assert.equal(currentUnit(stale),false);assert.equal(mergeCatalogue(units,[stale]).find(u=>u.id===a.id).url,a.url);
for(const id of splitIds){assert.ok(!units.some(u=>u.id===id));for(const slug of choices[id.split('/')[1]])assert.ok(units.some(u=>u.url.endsWith('/'+slug)));}
assert.equal(rankUnits('Custodian Guard',units).filter(x=>x.score===1).length,2);
console.log('PASS all 36 Custodes cards, current Achillus rules and stats, split units and stale catalogue protection.');

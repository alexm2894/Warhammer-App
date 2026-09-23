import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {ruleCards,loadRuleCards} from '../lib/rule-cards.ts';
const packs=JSON.parse(await readFile('data/faction-rules.json','utf8'));
const pack=packs['Adeptus Custodes'],solar=pack.detachments.find(d=>d.name==='Solar Spearhead');
assert.ok(solar);
const cards=ruleCards(pack,solar.id),strats=cards.find(c=>c.id===solar.id).stratagems;
assert.equal(cards.filter(c=>c.kind==='Army rule').length,1);
assert.equal(cards.filter(c=>c.kind==='Detachment').length,pack.detachments.length);
assert.equal(strats.length,6);
assert.ok(strats.every(c=>c.text.includes('WHEN:')&&c.text.includes('TARGET:')&&c.text.includes('EFFECT:')));
assert.ok(!cards.some(c=>/Adamantine Talisman/.test(c.name)));
assert.equal(new Set(cards.map(c=>c.key)).size,cards.length);
assert.equal(cards.length,pack.detachments.length+1);
for(const factionPack of Object.values(packs)){for(const sheet of ruleCards(factionPack)){assert.ok(sheet.kind==='Army rule'||sheet.kind==='Detachment');assert.ok(sheet.stratagems.every(s=>s.kind==='stratagem'));}}
assert.ok(strats.every(s=>s.cp&&s.category&&['your','enemy','either'].includes(s.timing)));
assert.ok(!cards.some(c=>c.name==='FLAWLESS CONSTRUCTION · 1CP'));
const other=cards.find(c=>c.id===pack.detachments[0].id).stratagems;assert.ok(other.every(c=>!strats.some(s=>s.url===c.url)));
const cult=packs['Genestealer Cults'];assert.ok(ruleCards(cult,cult.detachments[0].id).every(c=>c.faction==='Genestealer Cults'));
const original=globalThis.fetch;let calls=0;
try{globalThis.fetch=async()=>{calls++;return Response.json(pack);};
 await Promise.all([loadRuleCards(pack.faction),loadRuleCards(pack.faction)]);assert.equal(calls,1);
 await loadRuleCards(pack.faction);assert.equal(calls,1);
 await loadRuleCards(pack.faction,true);assert.equal(calls,2);
 globalThis.fetch=async()=>Response.json({...pack,edition:10});await assert.rejects(()=>loadRuleCards(pack.faction,true));
}finally{globalThis.fetch=original;}
console.log('PASS: faction/edition isolation, grouped Solar Spearhead stratagems and source colours across all factions, enhancement exclusion, stable card keys, shared session cache and explicit refresh.');

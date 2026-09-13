import ConditionTile from './condition-tile';
import {abilityApplies,abilityDescription,abilitySource,activeAbilities,criticalWound} from '@/lib/weapon-abilities';
import type {Conditions,Weapon} from '@/lib/battle';
export default function WeaponConditions({weapon,target,conditions,change}:{weapon:Weapon;target:string;conditions:Conditions;change:(value:Partial<Conditions>)=>void}){
 const critical=conditions.criticalWound||criticalWound(activeAbilities(weapon.keywords,target,conditions.abilityOverrides));
 return <div className="weapon-conditions"><p>Target keywords: {target||'Unavailable — check the datasheet'}. Attached leaders may add keywords; review the selections when using an attached unit.</p>
 {weapon.keywords.map((k,i)=>{const automatic=abilityApplies(k,target),override=conditions.abilityOverrides?.[k],checked=override??automatic;return <ConditionTile key={`${k}-${i}`} title={k} checked={checked} change={value=>change({abilityOverrides:{...conditions.abilityOverrides,[k]:value}})} benefit={`${override===undefined?'Automatic':'Player override'} · ${checked?'selected':'not applicable'}`} text={abilityDescription(k,critical,conditions.criticalHit||6)}/>;})}
 {weapon.keywords.some(k=>/^(MELTA|RAPID FIRE)/i.test(k))&&<ConditionTile title="Within half range" checked={!!conditions.halfRange} change={halfRange=>change({halfRange})} benefit="Apply selected Melta / Rapid Fire bonus" text="Check the distance when targets were selected. The app cannot measure the table."/>}
 {weapon.keywords.some(k=>/^CLEAVE/i.test(k))&&<ConditionTile title="All attacks against one target" checked={!!conditions.singleTarget} change={singleTarget=>change({singleTarget})} benefit="Enable selected Cleave bonus" text="All attacks made with this weapon must have been assigned to this target unit."/>}
 {weapon.keywords.some(k=>/^(BLAST|CLEAVE)/i.test(k))&&<label>Models in target when selected<input type="number" min="1" max="200" value={conditions.targetModels||''} placeholder="Enter model count" onChange={e=>change({targetModels:Math.max(0,Math.min(200,Math.floor(Number(e.target.value))))})}/></label>}
 <a href={abilitySource} target="_blank" rel="noreferrer">11th edition ability rules · checked 12 Sep 2026 ↗</a></div>;
}

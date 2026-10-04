export type WeaponAbilityPack={edition:11;retrievedAt:string;url:string;abilities:Record<string,string>;warning?:string};
export function findWeaponAbility(label:string,pack:WeaponAbilityPack){
 const normalized=label.toUpperCase().replace(/[\[\]]/g,'').replace(/[–—]/g,'-').replace(/\s+/g,' ').trim();
 const base=normalized.split(':')[0].trim();
 const key=Object.keys(pack.abilities).sort((a,b)=>b.length-a.length).find(key=>base===key||base.startsWith(key+' ')||(key==='ANTI'&&base.startsWith('ANTI-')));
 return key?pack.abilities[key]:undefined;
}

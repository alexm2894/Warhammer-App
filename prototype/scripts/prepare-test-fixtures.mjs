import {access, mkdir, writeFile} from 'node:fs/promises';
import {dirname} from 'node:path';
const fixtures = [
  ['.sites-runtime/samples-11/adeptus-custodes.html', 'https://wahapedia.ru/wh40k11ed/factions/adeptus-custodes/Custodian-Guard'],
  ['.sites-runtime/versus/knight.html', 'https://wahapedia.ru/wh40k11ed/factions/imperial-knights/Knight-Paladin'],
];
export async function prepareFixtures() {
  for (const [file, url] of fixtures) {
    try { await access(file); continue; } catch { /* Retrieve missing fixtures only. */ }
    const response = await fetch(url, {signal: AbortSignal.timeout(20000), redirect: 'error'});
    if (!response.ok) throw Error(`Fixture download failed (${response.status}): ${url}`);
    const html = await response.text();
    if (!/11th edition/i.test(html) || html.length > 4_000_000) throw Error(`Invalid test fixture: ${url}`);
    await mkdir(dirname(file), {recursive: true});
    await writeFile(file, html);
    console.log(`Downloaded test fixture: ${url}`);
  }
}
await prepareFixtures();

import './prepare-test-fixtures.mjs';
import {spawnSync} from 'node:child_process';
for (const file of ['verify.mjs','verify-speech.mjs','verify-recents.mjs','verify-roster.mjs','verify-rule-cards.mjs']) {
  const result = spawnSync(process.execPath, [`scripts/${file}`], {stdio: 'inherit'});
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

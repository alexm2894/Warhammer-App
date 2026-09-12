import {validRoster} from './roster.ts';
import type {Game, Player} from './battle';
import type {FactionRules, RuleSection} from './faction-rules';

const record = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === 'string';
function section(v: unknown): v is RuleSection {
  return record(v) && text(v.id) && text(v.name) && text(v.text) && text(v.url);
}
function rules(v: unknown): v is FactionRules {
  return record(v) && text(v.faction) && v.edition === 11 && text(v.retrievedAt)
    && Number.isFinite(Date.parse(v.retrievedAt)) && text(v.url) && section(v.army)
    && Array.isArray(v.detachments) && v.detachments.every(section)
    && (v.warning === undefined || text(v.warning));
}
function player(v: unknown): v is Player {
  return record(v) && (v.team === 0 || v.team === 1)
    && (v.id === `${v.team}-0` || v.id === `${v.team}-1`)
    && text(v.name) && text(v.faction) && text(v.ally) && text(v.detachment)
    && (v.roster === undefined || validRoster(v.roster));
}
export function validGame(v: unknown, deployed = true): v is Game {
  if (!record(v) || v.version !== 1 || !Array.isArray(v.players)
    || v.players.length < 2 || v.players.length > 4 || !v.players.every(player)
    || new Set(v.players.map(p => p.id)).size !== v.players.length
    || (v.sessionId !== undefined && (!text(v.sessionId) || !v.sessionId.trim()))
    || !record(v.rules) || !Object.entries(v.rules).every(([key, value]) => rules(value) && value.faction === key)) return false;
  const packs = v.rules as Record<string, FactionRules>;
  const players = v.players;
  if (![0, 1].every(team => players.some(p => p.team === team))) return false;
  return !deployed || players.every(p => p.faction && packs[p.faction]?.detachments.some(d => d.id === p.detachment)
    && (!p.ally || packs[p.ally]));
}
export function readSavedGame(key: string, deployed = true): Game | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) || 'null');
    return validGame(value, deployed) ? value : null;
  } catch { return null; }
}
// Promise rejection reports storage failures without interrupting rendering.
export async function saveDraft(game: Game): Promise<void> {
  localStorage.setItem('field-cards-setup-draft-11', JSON.stringify(game));
}

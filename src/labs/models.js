// Browser-owned, bounded mathematical models. No host or product runtime dependency.
export const LAB_VERSION = '1.0.0';
export const NUMERIC_DEFAULTS = Object.freeze({ attack: 1000, skillMultiplier: 2, bonusRatio: .2, damageRetention: .8, critRate: .5, critMultiplier: 2, hitCount: 5, windowSeconds: 10 });
export const NUMERIC_FIELDS = Object.freeze([
  ['attack', '攻击力', 0, null, 100], ['skillMultiplier', '技能倍率', 0, null, .1],
  ['bonusRatio', '增伤比例', 0, null, .05], ['damageRetention', '伤害保留比例', 0, 1, .05],
  ['critRate', '暴击率', 0, 1, .05], ['critMultiplier', '暴击倍率', 1, null, .1],
  ['hitCount', '命中次数', 1, 1000000, 1], ['windowSeconds', '时间窗口（秒）', 0, null, 1]
]);
export class InputError extends Error {
  constructor(message, field = '') { super(message); this.name = 'InputError'; this.field = field; }
}
function object(value, message) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new InputError(message);
}
function keys(value, allowed) {
  object(value, '配置必须是 JSON 对象。');
  if (Object.keys(value).some(key => !allowed.includes(key))) throw new InputError('配置包含不支持的字段。');
}
function bounded(value, field, label, minimum, maximum = Infinity, integer = false) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < minimum || value > maximum || (integer && !Number.isSafeInteger(value))) {
    throw new InputError(`${label}须为${integer ? '整数' : '有限数值'}，范围 ${minimum}–${maximum === Infinity ? '有限上限' : maximum}。`, field);
  }
  return value;
}
/** @returns {Record<string, number>} */
export function numericInput(raw) {
  keys(raw, NUMERIC_FIELDS.map(field => field[0]));
  const input = {};
  for (const [key, label, minimum, maximum] of NUMERIC_FIELDS) input[key] = bounded(raw[key], key, label, minimum, maximum ?? Infinity, key === 'hitCount');
  if (input.windowSeconds === 0) throw new InputError('时间窗口须大于 0 秒。', 'windowSeconds');
  return input;
}
export function calculateNumeric(raw) {
  const input = numericInput(raw);
  const base = input.attack * input.skillMultiplier * (1 + input.bonusRatio) * input.damageRetention;
  const singleDamage = base * (1 - input.critRate) + base * input.critMultiplier * input.critRate;
  const totalDamage = singleDamage * input.hitCount;
  const dps = totalDamage / input.windowSeconds;
  if (![base, singleDamage, totalDamage, dps].every(Number.isFinite)) throw new InputError('结果超过可计算范围，请减小参数或增大时间窗口。');
  return { singleDamage, totalDamage, dps, base };
}
export function numericDocument(current, snapshots) {
  return { formatVersion: 1, demoVersion: LAB_VERSION, modelId: 'attack-crit', modelVersion: 1, parameters: numericInput(current), snapshots: { A: snapshots.A === null ? null : numericInput(snapshots.A), B: snapshots.B === null ? null : numericInput(snapshots.B) } };
}
export function readNumericDocument(text) {
  if (typeof text !== 'string' || new TextEncoder().encode(text).length > 32768) throw new InputError('配置文件最大为 32 KiB。');
  let raw;
  try { raw = JSON.parse(text); } catch { throw new InputError('JSON 格式有误，请检查逗号与引号。'); }
  keys(raw, ['formatVersion', 'demoVersion', 'modelId', 'modelVersion', 'parameters', 'snapshots']);
  if (raw.formatVersion !== 1 || raw.demoVersion !== LAB_VERSION || raw.modelId !== 'attack-crit' || raw.modelVersion !== 1) throw new InputError('不支持该配置格式、模型或版本，请使用当前演示导出的配置。');
  keys(raw.snapshots, ['A', 'B']);
  if (!Object.hasOwn(raw.snapshots, 'A') || !Object.hasOwn(raw.snapshots, 'B')) throw new InputError('配置缺少 A/B 快照字段。');
  const result = numericDocument(raw.parameters, raw.snapshots);
  for (const input of [result.parameters, result.snapshots.A, result.snapshots.B].filter(Boolean)) calculateNumeric(input);
  return result;
}

export const DECK_FIELDS = Object.freeze([
  ['deckSize', '牌库总数', 1], ['categoryA', 'A 类张数', 0], ['requiredA', '至少需要 A', 0],
  ['categoryB', 'B 类张数', 0], ['requiredB', '至少需要 B', 0],
  ['openingHand', '起手抽牌', 0], ['laterDraws', '后续抽牌', 0]
]);
export const DECK_DEFAULTS = Object.freeze({ deckSize: 20, categoryA: 2, requiredA: 1, categoryB: 0, requiredB: 1, openingHand: 5, laterDraws: 0 });
/** @returns {Record<string, number>} */
export function deckInput(raw) {
  keys(raw, DECK_FIELDS.map(field => field[0]));
  const result = {};
  for (const [key, label, minimum] of DECK_FIELDS) result[key] = bounded(raw[key], key, label, minimum, 1000, true);
  if (result.categoryA + result.categoryB > result.deckSize) throw new InputError('A、B 类张数之和不能超过牌库总数。', 'categoryB');
  if (result.openingHand + result.laterDraws > result.deckSize) throw new InputError('起手与后续抽牌之和不能超过牌库总数。', 'laterDraws');
  return result;
}
// A normalized hypergeometric PMF, grown outwards from its mode using ratios.
// No factorials or random sampling; scaling at the mode avoids tail underflow.
export function hypergeometric(population, successes, draws) {
  const low = Math.max(0, draws - population + successes), high = Math.min(successes, draws);
  const mode = Math.max(low, Math.min(high, Math.floor((draws + 1) * (successes + 1) / (population + 2))));
  const masses = new Float64Array(high - low + 1);
  masses[mode - low] = 1;
  for (let k = mode; k < high; k++) masses[k + 1 - low] = masses[k - low] * (successes - k) * (draws - k) / ((k + 1) * (population - successes - draws + k + 1));
  for (let k = mode; k > low; k--) masses[k - 1 - low] = masses[k - low] * k * (population - successes - draws + k) / ((successes - k + 1) * (draws - k + 1));
  let total = 0;
  for (const mass of masses) total += mass;
  for (let i = 0; i < masses.length; i++) masses[i] /= total;
  return { low, masses };
}
function tail(distribution, required) {
  if (required <= distribution.low) return 1;
  let sum = 0;
  for (let i = Math.max(0, required - distribution.low); i < distribution.masses.length; i++) sum += distribution.masses[i];
  return Math.min(1, Math.max(0, sum));
}
export function probabilityAt(input, draws) {
  if (input.requiredA > input.categoryA || input.requiredA > draws) return 0;
  const a = hypergeometric(input.deckSize, input.categoryA, draws);
  if (input.categoryB === 0) return tail(a, input.requiredA);
  if (input.requiredB > input.categoryB || input.requiredA + input.requiredB > draws) return 0;
  let result = 0;
  for (let i = Math.max(0, input.requiredA - a.low); i < a.masses.length; i++) {
    const countA = a.low + i;
    const conditional = hypergeometric(input.deckSize - input.categoryA, input.categoryB, draws - countA);
    result += a.masses[i] * tail(conditional, input.requiredB);
  }
  return Math.min(1, Math.max(0, result));
}
export function calculateDeck(raw) {
  const input = deckInput(raw), finalDraws = input.openingHand + input.laterDraws;
  const points = new Set([input.openingHand, finalDraws]);
  for (let i = 1; i < 24; i++) points.add(Math.round(input.openingHand + input.laterDraws * i / 24));
  const progression = [...points].sort((a, b) => a - b).map(draws => ({ draws, probability: probabilityAt(input, draws) }));
  return { input, mode: input.categoryB === 0 ? 'single' : 'two-disjoint', opening: progression[0].probability, final: progression[progression.length - 1].probability, progression };
}

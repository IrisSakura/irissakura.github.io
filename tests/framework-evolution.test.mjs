import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {assertFrameworkEvolution,resolveFrameworkEvolution} from '../scripts/lib/framework-evolution-model.mjs';
const data=JSON.parse(await readFile(new URL('../data/framework-evolution.json',import.meta.url),'utf8'));
test('Framework evolution is an ordered public timeline',()=>{assert.equal(assertFrameworkEvolution(data),true);assert.equal(data.entries.length,6);});
test('Framework evolution rejects phase drift',()=>{const drift=structuredClone(data);drift.entries[1].phase='07';assert.throws(()=>assertFrameworkEvolution(drift),/order/);});
test('Framework evolution resolution is detached',()=>{const resolved=resolveFrameworkEvolution(data);resolved.entries[0].title='changed';assert.notEqual(resolved.entries[0].title,data.entries[0].title);});

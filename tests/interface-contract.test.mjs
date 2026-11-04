import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import postcss from 'postcss';
import { interfaceContract, assertInterfaceRole, assertProjectHeading } from './lib/interface-contract.mjs';

const read = file => readFile(new URL('../' + file, import.meta.url), 'utf8');
const normalizeValue = value => value.replace(/\s+/g, '').replace(/(^|[^\d])0\.(\d+)/g, '$1.$2');

test('approved interface tokens remain in their shared owner', async () => {
  const css = postcss.parse(await read('style/tokens/interface.css'));
  for (const [token, expected] of Object.entries(interfaceContract.tokens)) {
    const declarations = [];
    css.walkDecls(token, declaration => declarations.push(declaration));
    assert.equal(declarations.length, 1, `${token}: must have one shared definition`);
    assert.equal(declarations[0].parent.selector, ':root', `${token}: must not become a page override`);
    assert.equal(normalizeValue(declarations[0].value), normalizeValue(expected),
      `${token}: approved value changed; review the aesthetic contract`);
  }
});

test('the final interface owner cannot be followed by a new page skin', async () => {
  const css = postcss.parse(await read('style/site.css'));
  const imports = [];
  css.walkAtRules('import', rule => imports.push(rule.params));
  assert.deepEqual(imports.slice(-2), [
    'url("tokens/interface.css") layer(tokens)',
    'url("components/interface.css") layer(interface)'
  ]);
  assert.ok(css.nodes.every(node => node.type === 'comment'
    || (node.type === 'atrule' && ['import', 'layer'].includes(node.name) && !node.nodes)),
  'The entry declares layers and owners; it must not become an unlayered override sheet');
});

test('global shape and heading drift fails even when every page agrees', () => {
  for (const [role, values] of Object.entries(interfaceContract.roles)) {
    assertInterfaceRole(role, { values }, role);
    assert.throws(() => assertInterfaceRole(role, { values: { ...values, borderRadius: '999px' } }, role),
      /approved/);
  }
  const heading = { fontFamily: '"PingFang SC", sans-serif', fontSize: '56px', lineHeight: '70px' };
  assertProjectHeading(1440, heading, 'project');
  assert.throws(() => assertProjectHeading(1440, { ...heading, fontSize: '112px' }, 'project'), /approved/);
  assert.throws(() => assertProjectHeading(1440, { ...heading, fontFamily: 'Georgia, serif' }, 'project'), /sans-serif/);
});

test('selected module stripes do not allow external or additional card shadows', () => {
  const values = { ...interfaceContract.roles.cards, boxShadow: 'rgb(196, 47, 107) 3px 0px 0px 0px inset' };
  assertInterfaceRole('cards', { variant: 'selected-module', values }, 'selected card');
  assert.throws(() => assertInterfaceRole('cards', { values }, 'ordinary card'), /approved/);
  for (const shadow of ['rgb(0, 0, 0) 4px 4px 0px 0px', values.boxShadow + ', rgb(0, 0, 0) 4px 4px 0px 0px']) {
    assert.throws(() => assertInterfaceRole('cards', {
      variant: 'selected-module', values: { ...values, boxShadow: shadow }
    }, 'selected card'), /internal selection stripe/);
  }
});

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

export const interfaceContract = JSON.parse(await readFile(
  new URL('../../config/interface-contract.json', import.meta.url), 'utf8'
));

export function assertInterfaceRole(role, item, label) {
  const expected = interfaceContract.roles[role];
  assert.ok(expected, `Unknown interface role: ${role}`);
  const values = { ...item.values };
  if (role === 'cards' && item.variant === 'selected-module') {
    // One inset selection stripe is semantic feedback, not a raised card shadow.
    assert.match(values.boxShadow, /^(?:rgba?|color)\([^)]*\) 3px 0px 0px 0px inset$/,
      `${label}: selected module must retain only its internal selection stripe`);
    values.boxShadow = 'none';
  }
  assert.deepEqual(values, expected, `${label}: differs from the approved ${role} contract`);
}

export function assertProjectHeading(width, heading, label) {
  const expected = interfaceContract.projectHeading[width];
  assert.ok(expected, `No approved heading sample for ${width}px`);
  assert.match(heading.fontFamily, /(?:^|,\s*)sans-serif$/,
    `${label}: project heading must use the shared sans-serif role`);
  assert.deepEqual({ fontSize: heading.fontSize, lineHeight: heading.lineHeight }, expected,
    `${label}: differs from the approved project heading scale`);
}

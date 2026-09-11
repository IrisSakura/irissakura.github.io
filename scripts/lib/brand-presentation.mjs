/** Display aliases only: stable IDs, routes, exports and source records stay untouched. */
const CURRENT_PRODUCT_NAMES = Object.freeze({
  'sakura-design-journal': 'Myosotis',
  'iris-shelf': 'Violet Shelf'
});

export function currentProductName(stableId, fallback) {
  return CURRENT_PRODUCT_NAMES[stableId] ?? fallback;
}

export { CURRENT_PRODUCT_NAMES };

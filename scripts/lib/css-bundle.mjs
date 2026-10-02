import { readFile } from 'node:fs/promises';
import path from 'node:path';
import postcss from 'postcss';

// Keep the authored layer order and selectors; only resolve imports/URLs and
// remove formatting. Reject syntax we do not support rather than dropping it.
export async function bundleCss(entry, output, stack = []) {
  const file = path.resolve(entry);
  if (stack.includes(file)) throw new Error(`CSS import cycle: ${[...stack, file].join(' -> ')}`);
  const root = postcss.parse(await readFile(file, 'utf8'), { from: file });
  const imports = [];
  root.walkAtRules('import', rule => imports.push(rule));
  for (const rule of imports) {
    const match = /^url\(["']?([^"')]+)["']?\)(?:\s+layer\(([\w.-]+)\))?$/u.exec(rule.params);
    if (!match || /^(?:[a-z]+:|\/\/|\/)/iu.test(match[1])) {
      throw new Error(`Unsupported CSS import in ${file}: ${rule.params}`);
    }
    const child = await bundleCss(path.resolve(path.dirname(file), match[1]), output, [...stack, file]);
    if (match[2]) {
      const layer = postcss.atRule({ name: 'layer', params: match[2] });
      layer.append(child.nodes);
      rule.replaceWith(layer);
    } else {
      rule.replaceWith(child.nodes);
    }
  }
  root.walkDecls(decl => {
    // Imported nodes have already been rebased relative to the bundle.
    if (decl.source?.input.file !== file) return;
    decl.value = decl.value.replace(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)]+))\s*\)/gu, (original, double, single, bare) => {
      const url = double ?? single ?? bare;
      if (/^(?:[a-z][\w+.-]*:|\/|#)/iu.test(url)) return original;
      const [, pathname, suffix = ''] = /^([^?#]*)(.*)$/u.exec(url);
      const relative = path.relative(path.dirname(output), path.resolve(path.dirname(file), pathname)).split(path.sep).join('/');
      return `url("${relative}${suffix}")`;
    });
  });
  root.walkComments(comment => comment.remove());
  root.walk(node => {
    node.raws.before = '';
    if ('nodes' in node) node.raws.after = '';
    if (node.type === 'decl') node.raws.between = ':';
    if (node.type === 'rule' || node.type === 'atrule') node.raws.between = '';
  });
  root.raws.after = '';
  return root;
}

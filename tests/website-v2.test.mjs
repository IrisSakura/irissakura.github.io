import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { pageFamily, readingBody, splitReadingBlocks, publicationList } from '../scripts/lib/website-v2.mjs';
const root=new URL('../',import.meta.url);
const read=p=>readFile(new URL(p,root),'utf8');
async function htmlFiles(dir='pages') {const entries=await readdir(new URL(dir+'/',root),{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?htmlFiles(dir+'/'+e.name):e.name.endsWith('.html')?[dir+'/'+e.name]:[]))).flat();}
test('every generated route has a family, with deeper editorial rules taking precedence',async()=>{
 const registry=JSON.parse(await read('config/page-families.json'));
 for(const file of ['index.html','404.html',...await htmlFiles()]) {
  const family=pageFamily(file,registry),html=await read(file);
  if(!html.includes('http-equiv="refresh"')) assert.ok(html.includes(`data-page-grammar="${family.grammar}"`),file);
 }
 assert.equal(pageFamily('pages/blog/series/example.html',registry).grammar,'reading-order');
 assert.equal(pageFamily('pages/blog/tag/example.html',registry).grammar,'tag-index');
 assert.throws(()=>pageFamily('unknown.html',registry),/missing/);
});
test('reading breakouts preserve sanitized content including nested code',()=>{
 const body='<h2 id="one">One</h2><p>Text</p><pre><code>x &lt; y</code></pre><blockquote><pre>nested</pre></blockquote><table><tbody><tr><td>Cell</td></tr></tbody></table><h3 id="two">Two</h3>';
 const parts=splitReadingBlocks(body);assert.equal(parts.join(''),body);assert.equal(parts.length,5);
 const html=readingBody(body);assert.equal((html.match(/class="article-breakout /g)||[]).length,2);
 assert.match(html,/<blockquote><pre>nested<\/pre><\/blockquote>/);
 assert.match(html,/href="#one"/);assert.match(html,/href="#two"/);
 assert.equal((html.match(/id="one"/g)||[]).length,1);
});
test('publication archive and series express opposite chronological orders',()=>{
 const entries=[{slug:'new',publishedAt:'2026-09-22',title:'New'},{slug:'old',publishedAt:'2026-08-20',title:'Old'}];
 const archive=publicationList(entries),series=publicationList(entries,'',true);
 assert.ok(archive.indexOf('new.html')<archive.indexOf('old.html'));
 assert.ok(series.indexOf('old.html')<series.indexOf('new.html'));
});
test('CSS entry has one layer order and all imported owners exist',async()=>{
 const css=await read('style/site.css');assert.match(css,/@layer reset, tokens, base, shell, components, personas, pages, utilities;/);
 const imports=[...css.matchAll(/@import url\("([^"]+)"\)/g)].map(m=>m[1]);assert.equal(new Set(imports).size,imports.length);
 for(const file of imports) await access(new URL('style/'+file,root));
 for(const file of ['index.html','pages/engineering.html','pages/blog/authoritative-time-source.html']) assert.doesNotMatch(await read(file),/href="[^\"]*style\/tokens\//);
});
test('six structures do not rely on duplicate character integration or card grids',async()=>{
 for(const [file,structure] of [['engineering','system-axis'],['framework','module-branch'],['journal','archive-index'],['tools','workbench-tray'],['mods','discovery-route'],['wisteria','world-scene']]) {
 const html=await read(`pages/${file}.html`);assert.ok(html.includes(structure),file);
 assert.equal((html.match(/class="persona-picture"/g)||[]).length,1,`${file} duplicates the persona`);
 }
 const development=await read('pages/development.html');assert.equal((development.match(/class="project-route"/g)||[]).length,6);assert.doesNotMatch(development,/class="persona-picture"/);
 for(const file of await htmlFiles('pages/blog')) assert.doesNotMatch(await read(file),/class="persona-picture"/);
});

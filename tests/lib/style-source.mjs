import {readFile} from 'node:fs/promises';
const root=new URL('../../',import.meta.url);
// Assertions follow migrated owners rather than compatibility URLs.
export async function styleSource(file) {
 const mappings={
 'style/main.css':['style/tokens/compatibility.css','style/base/elements.css','style/shell/site-shell.css','style/components/shared.css','style/components/motion.css','style/pages/personal.css','style/pages/grammar.css','style/pages/journal.css','style/pages/portfolio.css','style/pages/game.css','style/tokens/layout.css','style/components/reading.css'],
 'style/iris-sakura.css':['style/tokens/compatibility.css','style/base/elements.css','style/pages/framework.css','style/pages/game.css','style/pages/journal.css','style/components/reading.css'],
 'style/components/brand-experience.css':['style/components/shared.css','style/pages/grammar.css','style/personas/identity.css','style/components/motion.css'],
 'style/components/living-site.css':['style/pages/personal.css','style/pages/grammar.css'],
 'style/components/visual-decorations.css':['style/components/shared.css','style/components/motion.css'],
 'style/components/personas-v2.css':['style/pages/grammar.css','style/personas/identity.css','style/components/motion.css'],
 'style/blog.css':['style/components/reading.css','style/pages/journal.css']
 };
 const paths=mappings[file]??[/^style\/(engineering|framework|journal|tools|mods|portfolio|game|contact|framework-engineering)\.css$/.test(file)?file.replace('style/','style/pages/').replace('framework-engineering.css','framework.css').replace('contact.css','personal.css'):file];
 if(/^style\/(portfolio|framework|journal|tools|game|engineering)\.css$/.test(file)) paths.push('style/components/shared.css');
 return (await Promise.all(paths.map(p=>readFile(new URL(p,root),'utf8')))).join('\n');
}

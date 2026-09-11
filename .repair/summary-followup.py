from pathlib import Path
p=Path('scripts/generate-site.mjs')
s=p.read_text()
start=s.index('            <div class="journal-dashboard" aria-label="学习记录概览">')
end=s.index('\n        </div>\n    </header>\n${renderContentSearch(searchIndex)}',start)
dashboard=s[start:end]
s=s[:start]+s[end:]
marker='    </header>\n${renderContentSearch(searchIndex)}'
if s.count(marker)!=1: raise SystemExit('Unexpected journal summary insertion point')
s=s.replace(marker,'    </header>\n    <section class="journal-summary" aria-label="内容概览">\n        <div class="container">\n'+dashboard+'\n        </div>\n    </section>\n${renderContentSearch(searchIndex)}')
p.write_text(s)
p=Path('style/journal.css')
p.write_text(p.read_text()+'''
/* Keep the knowledge overview below the artwork, never over the character. */
.journal-summary { padding: 1.5rem 0; }
.journal-summary .journal-dashboard { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0 1.5rem; }
.journal-summary .journal-dashboard-label { grid-column: 1 / -1; }
.journal-summary .journal-metric { min-width: 0; display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-start; gap: 0.25rem; }
.journal-summary .journal-metric span, .journal-summary .journal-metric small { text-align: left; }
@media (max-width: 900px) {
    .journal-summary .journal-dashboard { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
''')
p=Path('tests/lib/project-hero-layout.mjs')
s=p.read_text()
s=s.replace("          const controlsFit = await page.evaluate(() => {",'''          const overviewIsBelowHero = await page.evaluate(() =>
            document.querySelector('.journal-dashboard').getBoundingClientRect().top >=
            document.querySelector('[data-brand-project-hero]').getBoundingClientRect().bottom - 1);
          assert.ok(overviewIsBelowHero, `Knowledge overview covers the hero at ${width}px`);
          const controlsFit = await page.evaluate(() => {''')
p.write_text(s)

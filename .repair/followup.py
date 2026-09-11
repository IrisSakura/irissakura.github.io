from pathlib import Path

def replace(file, old, new):
    path = Path(file)
    text = path.read_text()
    if text.count(old) != 1:
        raise SystemExit('Unexpected follow-up target: ' + file)
    path.write_text(text.replace(old, new))

replace('style/main.css', '.brand-portfolio-header::after {\n    content: "IRIS × SAKURA";', '.brand-portfolio-header::after {\n    content: "IRISSAKURA";')
replace('style/main.css', '@media (max-width: 1120px) {\n    html[data-brand="iris-sakura"] .brand-seal {', '@media (max-width: 1120px) {\n    html[data-brand="iris-sakura"] .footer-content {\n        grid-template-columns: minmax(12rem, 0.8fr) minmax(0, 1.6fr);\n    }\n\n    html[data-brand="iris-sakura"] .footer-content > * {\n        min-width: 0;\n    }\n\n    html[data-brand="iris-sakura"] .brand-seal {')
replace('style/journal.css', '@media (max-width: 900px) {\n    .content-search-controls {', '@media (max-width: 1100px) {\n    .content-search-controls {')
replace('tests/lib/project-hero-layout.mjs', '        if (screenshotDirectory && [390, 1440].includes(width)) {', '''        if (name === 'journal') {
          const controlsFit = await page.evaluate(() => {
            const form = document.querySelector('.content-search-controls');
            const bounds = form.getBoundingClientRect();
            return [...form.querySelectorAll('input, select, button')].every((control) => {
              const rect = control.getBoundingClientRect();
              return rect.left >= bounds.left - 1 && rect.right <= bounds.right + 1;
            });
          });
          assert.ok(controlsFit, `Search controls are clipped at ${width}px`);
        }
        if (screenshotDirectory && [390, 1440].includes(width)) {''')

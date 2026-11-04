# Independent UI component review

Status: COMPLETE for the defined component-boundary audit. No outstanding confirmed blockers in the reviewed scope. All F1–F4 findings were repaired and independently rechecked.

Reviewer: independent of production implementation. Only this report and files under `independent/` were written by the reviewer; no production source, generated output, tests, Git state, or other agent browser sessions were changed.

## Outcome and reference

User request: “边缘生硬没有余裕，选中标识超框” and “再逐页面仔细评审一下，复用规范化组件不应该有这种问题的”. The observable outcome is consistent inset, wrap behavior, card-group spacing, and contained selection/focus across the actual website pages and reused components. The supplied reference screenshots and the recorded before-state establish the defects; code normalization alone is not acceptance evidence.

The two original attached screenshots were directly viewed: `codex-clipboard-1b953774-df6b-4292-8c7e-43e770414ef0.png` (navigation underlines extending past pill bounds) and `codex-clipboard-0f096311-7fca-4429-b5fa-30332c38e8b7.png` (homepage writing text touching a hard card edge). The final `after/index-1440-middle.png` was opened at full viewport size: the writing cards have visible four-sided inset and rounded bounds, and the selected navigation underline remains inside its pill. These original corrections were preserved during the broader pass.

Environment: local candidate at `http://127.0.0.1:4318/`, actual headed Chromium browser. Desktop page sheets are 1440px; direct component rechecks use 1440px and 390px, with the adoption list additionally checked at 320px and 768px. No published-site or remote-build claim is made.

## Independent coverage

- Directly viewed all `after/review-1440/sheet-01.jpg` through `sheet-26.jpg`: 155 content pages, four sampled scroll positions per page (top, first body, middle, end). Exact routes, sheet panels, source screenshot names, and scroll coordinates are recorded in `independent/desktop-reviewed-pages.json`.
- Opened suspicious original viewport images and independently reproduced confirmed findings in the browser. Added final runtime rechecks after Framework and Contact changed; unchanged route evidence was reused.
- Directly viewed selected mobile focus/card paths. The main reviewer owns the complete 160-entry mobile pass and five compatibility redirects; those are not claimed as this independent reviewer's work.
- Representative full-size Framework and Tools footers were inspected. Full route coverage at sampled positions is not a claim that every pixel of every long page was examined.
- The bulk screenshot run blocks external resources. Font Awesome absence in those images was treated as an environment limitation. The reviewer's final live Contact screenshots show real envelope, QQ, GitHub, Bilibili and action icons loaded successfully.

## Findings and final evidence

### F1 — Focus outlines clipped by component containers — RESOLVED

Actual Tab/ArrowDown input reproduced external 3px outlines with a 4px offset clipped by the Journal page-index scroll area, Framework module-filter overflow container, and global-search result scroll area. Before: `independent/journal-toc-focus.png`, `framework-filter-focus.png`, `global-search-focus.png`.

The shared inset focus contract now applies before focus begins. Six independent real-input observations (page index, module filter, search × desktop/mobile) measured **-3px offset and 3px solid outline immediately in focusin, first animation frame, and second animation frame**. This confirms the outline does not animate into the container from an initially clipped state. Observation record: `independent/rapid-focus-observation.json`.

All six stable rendered focus screenshots were directly viewed: `independent/final-rapid-page-index-1440.png`, `final-rapid-page-index-390.png`, `final-rapid-module-filter-1440.png`, `final-rapid-module-filter-390.png`, `final-rapid-search-1440.png`, `final-rapid-search-390.png`. Complete outlines are visible. Stable screenshots were captured after page/dialog transitions; first-frame measurements are separate evidence.

### F1b — Segmented filter corners clipped the inset outline — RESOLVED

The mobile 2 × 2 filter shell retained a 999px pill radius while rectangular buttons drew their focus outlines, cutting away corner segments. Before: `independent/after-framework-filter-focus-mobile.png`.

The group now has a 12px outer radius and matched 11px button corner radii. Actual Shift+Tab then Tab was used on both desktop end segments and all four mobile segments. Every image was directly viewed: `independent/final-filter-1440-0.png`, `final-filter-1440-3.png`, and `final-filter-390-0.png` through `final-filter-390-3.png`. All focus shapes are closed and contained. The later offset-placement change did not alter these dimensions, and the final rapid-Tab mobile image confirms the top-right corner remains complete.

### F2 — Mobile Framework evidence titles invaded their inset — RESOLVED

Before: `/pages/framework/evidence.html` at 390px kept two columns, leaving 155.5px per card and only 5.52px right clearance for “Independent” despite a 20px declared inset. Evidence: `independent/framework-evidence-card-mobile.png`.

After: a 335px one-column card keeps 20px padding and component-owned 18.88px heading type. “Independent Consumer Evidence” ends 42.66px before the outer right edge. The original viewport/card was directly viewed: `independent/after-framework-evidence-card-mobile.png`. The other Framework grid variants were included in the desktop route review.

### F3 — Adoption package list had touching edges, overlapping columns, and a stretched blank panel — RESOLVED

Before: `/pages/framework.html`, 1440px. The first label sat at x113.5 against a list border at x112.5: only 1px clearance. Fixed three-column sizing allowed package identifiers such as `com.unitygame.framework.gamehelper` to overlap the description column. The list stretched to a 9954.14px neighboring route panel although its content ended about 3745px earlier. Directly captured before evidence: `independent/framework-adoption-list-desktop.png`; the original middle-page viewport was also viewed before replacement.

After: list rows have a shared content inset, two flexible columns with the description on its own row, safe identifier wrapping, and no cross-panel stretch. Independent checks at 320/390/768/1440px found no child scroll overflow among all 69 rows. First-label inset is 21px on narrow sizes and 29px on desktop; the panel ends 1px after its last row rather than continuing as a large empty white frame. Directly viewed final runtime screenshots: `independent/final-adoption-1440.png` and `final-adoption-390.png`.

### F4 — Contact cards were crowded into an obsolete joined-row shell — RESOLVED

Before: `.public-route-list` kept a 1px gap, continuous line-colored background, and outer border while children had become independent rounded, shadowed cards. Desktop/mobile original viewport images showed hard double seams and crowded shadows. Preserved baseline: `before/pages--contact-1440.png` and `before/pages--contact-390.png`; the latter was reopened after the after-set was updated.

After: the card group uses a 16px gap, transparent background, and no outer border. Independent desktop/mobile runtime inspection found no horizontal overflow. Both final images were directly viewed, including the actual loaded icons: `independent/final-contact-1440.png` and `final-contact-390.png`. Card boundaries and shadows remain distinct.

## Rejected hypotheses

The Journal `.stream-card` source initially suggested a possible row/card-shadow conflict. Runtime inspection found 24px padding, 12.8px rounded corners and no hover shadow; `independent/journal-stream-hover.png` showed no defect. Hidden/collapsed details and content-visibility placeholders were not treated as visible overflow without opening or scrolling them into view. Unreliable long-page fullPage crops were not used to claim page-end coverage.

## Acceptance separation

- **Technical:** full test suite/build checks were not rerun by this independent reviewer. The main agent owns the final check and smoke logs. The runtime measurements above verify the specific layout/focus findings only.
- **Functional:** the reviewer directly operated the relevant Tab/Shift+Tab/ArrowDown paths, global-search opening and query entry, modal dismissal, and page scrolling. All described component paths behaved correctly. This is not a separate full-site functional certification.
- **Outcome:** PASS for the requested component-boundary batch in the stated browser evidence scope. The four confirmed defect classes and the filter-corner follow-up now visibly meet the requested inset/containment/spacing behavior. No additional confirmed boundary or selection-escape defect remains from the 155-page desktop sample review.

This result does not imply deployment, commit, push, physical mobile-device testing, or exhaustive inspection of every interior scroll location. No such action was taken by the reviewer.

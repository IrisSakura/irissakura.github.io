# Repository Instructions

## Development workflow and lessons

- Follow the [development workflow](docs/maintenance/development-workflow.md) for source ownership, continuous implementation, candidate acceptance and handoff; the existing interface and content contracts remain authoritative.
- At task start, read matching entries in the [development memo](docs/maintenance/development-memo.md). Add reusable failures, confirmed causes or explicit unknowns, fixes, recheck points and source evidence at consolidated acceptance or handoff.
- Keep this engineering material in repository documentation. Historical results do not grant new Git, cross-project, deployment or publication authority.

## GitHub authentication

- Use the existing GitHub SSH identity `IrisSakura` for this repository.
- Use `git@github.com:IrisSakura/irissakura.github.io.git` for GitHub pull, fetch, push, and remote verification operations.
- Do not probe GitHub CLI authentication or attempt HTTPS authentication first.
- Do not rewrite the configured `origin` unless the user explicitly requests it.

## Public website copy

- This website is authored in the GitHub source repository `IrisSakura/irissakura.github.io`; it is not a Gitea mirror.
- Write public pages for visitors: explain projects, work, useful content, and available actions.
- Do not publish source-board identifiers, migration notes, verification reports, provenance explanations, or boilerplate “does not constitute a claim” disclaimers in site copy, captions, controls, alt text, metadata, or sharing descriptions. Keep necessary maintenance records in repository documentation and asset manifests.
- Do not display outdated or misleading artwork and append a disclaimer to justify it. Use suitable current assets; retain historical sources internally.
- Keep real technical documentation and concise user-relevant limitations. Unsupported capabilities must not be advertised; unavailable downloads must not have fake links.
- Do not restore rejected copy to satisfy outdated string assertions. Test rendering, useful content, correct routes and safety rather than mandatory disclaimers.
- Implement an approved complete change continuously; run the affected regressions and full site/browser checks together at candidate acceptance rather than after every small copy or styling edit.

## Design direction: preserve the approved interface

- For UI, CSS, layout, illustration integration or component work, read [the aesthetic contract](docs/brand/interface-aesthetic-contract.md) and [component ownership](docs/ui-components.md) first. The approved baseline is the 2026-10-29 unification (`c1dcc3eb`); older visual experiments are historical references, not instructions to restore them.
- Keep quiet light paper surfaces, restrained borders, clear typography and consistent controls. Project palettes, complete character illustrations and content diagrams carry identity. Do not flatten the six projects into identical pages, or invent a new visual direction under the label of polish.
- Reuse the same button, input, tag, card, disclosure and heading roles across routes. Shared geometry belongs to `style/tokens/interface.css`; final component styling belongs to `style/components/interface.css`. Pages own composition, not a second control skin. Do not bypass this ownership with inline styling, unlayered CSS, `!important`, or a new class for the same role.
- Do not reintroduce pill-shaped ordinary actions, asymmetric text cards, tape on reading/control surfaces, hard card shadows, tilted content cards, moving click targets, or an arbitrary oversized serif project title. Decorative illustration frames may retain their approved character without spreading to ordinary components.
- `config/interface-contract.json` records the approved values. Do not update it or weaken assertions merely to make a visual change pass. Changing the core geometry, heading roles, brand direction or decoration level requires a new explicit design decision from the user. Content additions, responsive composition and accessibility fixes within this direction proceed normally without repeated approval.
- At candidate acceptance, compare the changed surface with the approved baseline in the running browser, including mobile and actual interactions. Reuse valid evidence; do not add per-file review or repeat full checks after each edit. Numeric tests supplement visual judgment and do not prove the aesthetic outcome by themselves.

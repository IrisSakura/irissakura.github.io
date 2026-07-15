# UnityGameFramework Website Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the public framework page consume a safe generated JSON snapshot and provide Gitea-source files that publish future snapshots automatically after GitHub mirror updates.

**Architecture:** The Gitea source repository generates a whitelist-only `framework.json` from `docs/reference/framework-inventory.generated.json`. The website stores one valid initial snapshot, loads it from `pages/framework.html`, validates it in `src/framework.ts`, updates stable DOM targets, and retains static fallback content when loading fails. The GitHub mirror contains no mirror-only framework changes; framework-side files are delivered as a patch bundle for the Gitea truth source.

**Tech Stack:** TypeScript ES2020, static HTML/CSS, Node.js ESM, GitHub Actions, SSH Deploy Key, GitHub Pages.

## Global Constraints

- `UnityGameFramework` Gitea repository is the only truth source for framework-side files.
- Do not commit framework-side implementation only to the GitHub mirror.
- Public output must use an explicit field whitelist.
- Website rendering must preserve current static content as fallback.
- Cross-repository write access uses only `WEBSITE_DEPLOY_KEY`.
- No full DocFX publication, full module browser, or website build-system migration.
- No secret, internal path, server address, audit note, roadmap, or raw source object may enter `data/framework.json`.

---

## File Map

### Website repository

- Create `data/framework.json`: valid initial public snapshot.
- Modify `pages/framework.html`: stable DOM targets for summary, layers, lifecycle, source SHA, and update time.
- Modify `src/framework.ts`: schema validation, loading, rendering, and fallback-preserving error handling.
- Modify `dist/framework.js`: compiled JavaScript corresponding to `src/framework.ts`.
- Create `tests/framework-data.test.mjs`: validates the committed JSON schema and expected DOM identifiers in HTML.
- Modify `package.json`: add `build` and `test` scripts using existing TypeScript plus Node's built-in test runner.

### Gitea truth-source patch bundle

- Create `gitea-patch/tools/site/generate-public-site-data.mjs`: whitelist generator to copy into `UnityGameFramework`.
- Create `gitea-patch/tools/site/generate-public-site-data.test.mjs`: generator tests.
- Create `gitea-patch/.github/workflows/publish-framework-site.yml`: cross-repository publisher workflow.
- Create `gitea-patch/README.md`: exact copy destinations and secret setup.

---

### Task 1: Add the public data contract and repository test

**Files:**
- Create: `data/framework.json`
- Create: `tests/framework-data.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces JSON object with `schemaVersion`, `sourceCommit`, `generatedAt`, `summary`, `lifecycleCounts`, `layers`, and `featuredModules`.
- Later tasks consume the exact property names defined here.

- [ ] **Step 1: Add a failing Node test**

The test must parse `data/framework.json`, assert all required fields and numeric values, reject unknown top-level fields, and assert that `pages/framework.html` contains the planned DOM IDs.

- [ ] **Step 2: Run the test and confirm failure**

Run: `npm test`
Expected: FAIL because the data file and DOM targets do not yet exist.

- [ ] **Step 3: Add the initial data snapshot and package scripts**

Use the current framework inventory values as the initial snapshot. Add:

```json
{
  "scripts": {
    "build": "tsc",
    "test": "node --test tests/*.test.mjs"
  }
}
```

Preserve existing dependencies.

- [ ] **Step 4: Run the test again**

Run: `npm test`
Expected: JSON assertions pass; HTML target assertions still fail until Task 2.

- [ ] **Step 5: Commit**

Commit message: `test: define framework public data contract`

---

### Task 2: Add stable framework-page DOM targets

**Files:**
- Modify: `pages/framework.html`
- Test: `tests/framework-data.test.mjs`

**Interfaces:**
- Produces IDs: `framework-package-count`, `framework-module-count`, `framework-profile-count`, `framework-layer-list`, `framework-lifecycle-list`, `framework-source-commit`, `framework-generated-at`, and `framework-data-status`.

- [ ] **Step 1: Extend the failing HTML assertions**

Assert every required ID occurs exactly once.

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm test`
Expected: FAIL listing missing IDs.

- [ ] **Step 3: Modify the HTML minimally**

Add numeric summary cards, layer and lifecycle containers, and metadata fields. Keep existing explanatory text and module cards as static fallback.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

Commit message: `feat: add framework data render targets`

---

### Task 3: Implement validated dynamic rendering

**Files:**
- Modify: `src/framework.ts`
- Modify: `dist/framework.js`
- Create: `tests/framework-renderer.test.mjs`

**Interfaces:**
- Produces `FrameworkPublicData` validation and page rendering behavior.
- Fetch path is exactly `../data/framework.json` from `pages/framework.html`.

- [ ] **Step 1: Add failing source-level behavior tests**

Tests must assert that source code contains the fetch path, required validator checks, status updates, and catch handling that does not clear fallback DOM.

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm test`
Expected: FAIL because loading and rendering code is absent.

- [ ] **Step 3: Implement the TypeScript loader**

Implement strict runtime guards for required strings, non-negative integer summaries, lifecycle counts, layers, and featured modules. On success, update DOM text and rebuild only the dynamic layer/lifecycle containers. On error, retain existing DOM, set `framework-data-status` to fallback state, and call `console.error` with a stable prefix.

- [ ] **Step 4: Compile TypeScript**

Run: `npm run build`
Expected: `dist/framework.js` regenerated without TypeScript errors.

- [ ] **Step 5: Run tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

Commit message: `feat: render framework inventory data`

---

### Task 4: Add the Gitea-source generator patch

**Files:**
- Create: `gitea-patch/tools/site/generate-public-site-data.mjs`
- Create: `gitea-patch/tools/site/generate-public-site-data.test.mjs`

**Interfaces:**
- CLI: `node tools/site/generate-public-site-data.mjs --input <path> --output <path> --source-commit <sha>`.
- Output schema must match Task 1 exactly.

- [ ] **Step 1: Write generator tests**

Cover valid generation, missing `schemaVersion`, missing `summary`, missing `layers`, stable layer sorting, whitelist enforcement, and no output file after validation failure.

- [ ] **Step 2: Run tests and confirm failure**

Run from patch root: `node --test tools/site/generate-public-site-data.test.mjs`
Expected: FAIL because generator is absent.

- [ ] **Step 3: Implement the generator**

Use only Node built-ins. Parse CLI arguments, validate input, construct a new object field-by-field, select a small explicit featured-module ID allowlist, sort arrays deterministically, write through a temporary file, then rename atomically.

- [ ] **Step 4: Run tests**

Run: `node --test tools/site/generate-public-site-data.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

Commit message: `feat: add Gitea framework site exporter patch`

---

### Task 5: Add the Gitea-source publishing workflow patch

**Files:**
- Create: `gitea-patch/.github/workflows/publish-framework-site.yml`
- Create: `gitea-patch/README.md`
- Test: `tests/framework-data.test.mjs`

**Interfaces:**
- Secret: `WEBSITE_DEPLOY_KEY`.
- Destination: `IrisSakura/irissakura.github.io`, branch `main`, file `data/framework.json`.

- [ ] **Step 1: Add workflow static assertions**

Assert workflow includes `push` on `main`, `workflow_dispatch`, path filters, `concurrency`, `permissions: contents: read`, generator invocation, website checkout via `ssh-key`, no-change detection, and push to `main`.

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm test`
Expected: FAIL because workflow and README are absent.

- [ ] **Step 3: Add workflow and instructions**

The workflow must generate data before checking out the website, copy only the generated JSON, commit only when changed, and use a deterministic bot identity. README must state exact Gitea destination paths and Deploy Key setup steps.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

Commit message: `ci: add framework website publisher patch`

---

### Task 6: Final verification and PR update

**Files:**
- Review all changed files.

- [ ] **Step 1: Run all website checks**

Run:

```bash
npm install
npm run build
npm test
```

Expected: all commands succeed.

- [ ] **Step 2: Verify fallback behavior manually**

Serve repository root with `python3 -m http.server 8000`, open `/pages/framework.html`, confirm dynamic values load, then temporarily request a missing JSON path and confirm static content remains visible.

- [ ] **Step 3: Review the diff for public-boundary violations**

Confirm no secret, private URL, internal filesystem path, roadmap, audit note, or raw inventory object is present.

- [ ] **Step 4: Update the Draft PR description**

Document implemented website changes, Gitea patch copy paths, verification commands, and remaining manual secret configuration.

- [ ] **Step 5: Keep PR in Draft state**

Do not merge until the user reviews the rendered page and copies the framework patch into the Gitea truth source.

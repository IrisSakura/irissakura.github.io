import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function readText(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('portfolio leads with real work and retains routes to research and experiments', async () => {
  const html = await readText('pages/portfolio.html');
  for (const fragment of ['游戏与作品', '言铸之剑', 'The Weaver', 'Freesia Mods', 'project-udgap', '暂无公开 Demo', 'framework.html#game-adoption']) assert.ok(html.includes(fragment), fragment);
  assert.doesNotMatch(html, /显式授权|工程治理|class="consumer-lab-card/u);
});

test('portfolio data keeps research distinct from finished work', async () => {
  const data = JSON.parse(await readText('data/projects.json'));
  const titles = data.projects.map((project) => project.title);

  assert.equal(data.schemaVersion, 3);
  assert.deepEqual(titles, ['IrisSakura Journal', 'Iris Engineering', 'Iris Shelf', 'Iris Core', 'Iris × Sakura — The Weaver', 'Sakura Framework', 'UDGAP · 梦境诊疗室', '言铸之剑']);
  assert.deepEqual(new Set(data.projects.map((project) => project.category)), new Set(['research', 'tool', 'game']));
  for (const project of data.projects) {
    assert.match(project.updatedAt, /^\d{4}-\d{2}-\d{2}$/u, `${project.title} needs an update date`);
    assert.match(project.lastReviewedAt, /^\d{4}-\d{2}-\d{2}$/u, `${project.title} needs a review date`);
    assert.ok(project.status.length > 0, `${project.title} needs a status`);
    assert.ok(['source-push', 'fixed-snapshot', 'versioned-review', 'site-curated'].includes(project.syncMode), `${project.title} needs a reviewed sync mode`);
    assert.ok(project.syncLabel.length > 0, `${project.title} needs a public sync label`);
    assert.ok(project.role.length > 0, `${project.title} needs a role`);
    assert.ok(project.evidence.length > 0, `${project.title} needs evidence`);
    assert.ok(project.limitations.length > 0, `${project.title} needs limitations`);
    assert.ok(project.next.length > 0, `${project.title} needs next steps`);
    assert.ok(project.milestones.length > 0, `${project.title} needs completed milestones`);
    assert.deepEqual(
      project.next.filter((entry) => project.milestones.includes(entry)),
      [],
      `${project.title} next steps must not repeat completed milestones`
    );
  }

  assert.equal(data.updatedAt, data.projects.map((project) => project.updatedAt).sort().at(-1));
  const journal = data.projects.find((entry) => entry.id === 'sakura-design-journal');
  assert.equal(journal.updatedAt, '2026-08-29');
  assert.equal(journal.lastReviewedAt, '2026-08-29');
  for (const projectId of ['iris-engineering', 'sakura-framework']) {
    const project = data.projects.find((entry) => entry.id === projectId);
    assert.equal(project.updatedAt, '2026-08-30');
    assert.equal(project.lastReviewedAt, '2026-08-31');
  }
  for (const projectId of ['iris-shelf', 'udgap']) {
    const project = data.projects.find((entry) => entry.id === projectId);
    assert.equal(project.updatedAt, '2026-08-30');
    assert.equal(project.lastReviewedAt, '2026-08-30');
  }
  assert.ok(
    data.projects.find((entry) => entry.id === 'iris-engineering').evidence
      .some((entry) => entry.includes('P9.1 QQ proposal-only ingress'))
  );
  assert.equal(data.projects.find((entry) => entry.id === 'iris-shelf').status, '完整本地产品');
  assert.equal(data.projects.find((entry) => entry.id === 'iris-shelf').syncMode, 'source-push');
  assert.equal(data.projects.find((entry) => entry.id === 'udgap').status, 'Unity 6 集成基线');
  assert.equal(data.projects.find((entry) => entry.id === 'udgap').syncMode, 'source-push');
  assert.equal(data.projects.find((entry) => entry.id === 'sakura-framework').status, '开发收敛 · 无 Active');
  assert.equal(data.projects.find((project) => project.id === 'sword-of-words').categoryLabel, '独立游戏项目');
  assert.match(
    data.projects.find((project) => project.id === 'sakura-design-journal').reviewedJournalCurationHash,
    /^sha256:[a-f0-9]{64}$/u
  );
  assert.match(
    data.projects.find((project) => project.id === 'sakura-framework').reviewedFrameworkAdoptionHash,
    /^sha256:[a-f0-9]{64}$/u
  );
  assert.ok(!data.projects.find((project) => project.id === 'sakura-framework').next.includes('公开升级到 Supported 的条件'));

  for (const fabricatedTitle of [
    '像素地牢',
    '节奏迷宫',
    '科幻角色设计集',
    '游戏原声带 - 宇宙之旅',
    '对话系统编辑器',
    '环境音效包',
    'UI组件库'
  ]) {
    assert.ok(!JSON.stringify(data).includes(fabricatedTitle), `fabricated project should be removed: ${fabricatedTitle}`);
  }
});

test('portfolio project facts do not duplicate volatile snapshot counts', async () => {
  const data = JSON.parse(await readText('data/projects.json'));
  for (const projectId of ['sakura-design-journal', 'sakura-framework']) {
    const project = data.projects.find((entry) => entry.id === projectId);
    assert.ok(project, `missing project ${projectId}`);
    for (const fact of [...project.evidence, ...project.milestones]) {
      assert.doesNotMatch(
        fact,
        /\d+\s*(?:个|条|项|篇)/u,
        `${projectId} facts must describe stable proof instead of copying snapshot counts`
      );
    }
  }
});

test('public portfolio does not expose the private journal origin', async () => {
  const html = await readText('pages/portfolio.html');
  const data = await readText('data/projects.json');

  assert.ok(!html.includes('154.37.215.57'));
  assert.ok(!data.includes('154.37.215.57'));
});

test('portfolio separates finished work from long-term projects without losing old consumer anchors', async () => {
  const html = await readText('pages/portfolio.html');
  const config = JSON.parse(await readText('config/site-presentation.json'));
  const consumers = JSON.parse(await readText('data/consumer-lab.json'));
  assert.ok(html.indexOf('project-sword-of-words') < html.indexOf('project-udgap'));
  for (const project of config.projects) assert.ok(html.includes(`id="project-${project.projectId}"`));
  for (const consumer of consumers.cases) {
    assert.ok(html.includes(`id="consumer-${consumer.id}"`));
    assert.ok(html.includes(`framework.html#consumer-${consumer.id}`));
  }
  assert.doesNotMatch(html, /源仓推送公开投影|UNSIGNED UNIVERSAL|portfolio-filters/u);
});

test('Iris Core and The Weaver preserve their public evidence boundaries', async () => {
  const data = JSON.parse(await readText('data/projects.json'));
  const core = data.projects.find((project) => project.id === 'iris-core');
  const weaver = data.projects.find((project) => project.id === 'the-weaver');

  assert.equal(core.syncMode, 'versioned-review');
  assert.match(core.summary, /单独启用时不注册或修改玩法内容/u);
  assert.ok(core.evidence.some((entry) => entry.includes('52 项 Core')));
  assert.deepEqual(core.proof.map((entry) => entry.value), ['52', 'PCK', '0']);

  assert.equal(weaver.syncMode, 'versioned-review');
  assert.ok(weaver.evidence.some((entry) => entry.includes('106 张卡均有逐卡效果合同')));
  assert.ok(weaver.evidence.some((entry) => entry.includes('default / reduced / experimental-heavy')));
  assert.ok(weaver.limitations.some((entry) => entry.includes('逐卡前台人工')));
  assert.ok(weaver.limitations.some((entry) => entry.includes('真实双人同步')));
});

test('public project statuses do not expose repository provenance or local paths', async () => {
  const [html, data] = await Promise.all([
    readText('pages/portfolio.html'),
    readText('data/projects.json')
  ]);
  for (const publicText of [html, data]) {
    assert.doesNotMatch(publicText, /(?:sourceCommit|origin\/main|refs\/heads|\/Users\/|154\.37\.215\.57)/u);
  }
});

test('portfolio cases preserve responsive inline breathing room', async () => {
  const css = await readText('style/portfolio.css');

  assert.match(
    css,
    /--portfolio-case-inline-inset:\s*clamp\(1\.25rem,\s*3vw,\s*3rem\);/u,
    'portfolio cases need a responsive internal inset'
  );
  assert.match(
    css,
    /\.portfolio-case\s*\{[^}]*padding:\s*4\.5rem\s+var\(--portfolio-case-inline-inset\);/su,
    'portfolio case content must not touch either section edge'
  );
  assert.match(
    css,
    /@media \(max-width: 560px\)[\s\S]*?\.project-proof-visual\s*\{[^}]*padding:\s*1\.25rem\s+1\.25rem\s+4\.75rem;/u,
    'mobile proof visuals must reserve space for the absolute visual label'
  );
});

test('finished game page presents the real playable loop and public screenshots', async () => {
  const html = await readText('pages/game.html');
  const publicText = html;

  for (const fragment of [
    '言铸之剑',
    'PLAYABLE PROTOTYPE',
    '选择房间',
    '实时战斗',
    '构筑成长',
    '推进与保存',
    'combat-room.png',
    'room-selection.png',
    'potential-tree.png',
    'blessing-request.png',
    'Myosotis',
    'SakuraGameFramework'
  ]) {
    assert.ok(html.includes(fragment), `missing finished-game fragment: ${fragment}`);
  }

  assert.ok(!publicText.includes('/Users/'));
  assert.ok(!publicText.includes('gitProject'));
  assert.ok(html.includes('暂无 Demo'));
  assert.ok(html.includes('已知限制'));
});

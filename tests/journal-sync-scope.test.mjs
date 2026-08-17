import assert from 'node:assert/strict';
import test from 'node:test';
import { isJournalSyncOwnedPath } from '../scripts/verify-journal-sync-scope.mjs';

test('push-driven Journal sync owns only generated public projections', () => {
  for (const owned of [
    'assets/social/pages-blog-article.png',
    'assets/social/pages-journal-design.png',
    'content/blogs/article.md',
    'content/game-designs/design.md',
    'data/journal.json',
    'data/journal-source.json',
    'pages/framework.html',
    'pages/game.html',
    'pages/blog.html',
    'pages/blog/article.html',
    'pages/blog/series/game-systems.html',
    'pages/blog/tag/transactions.html',
    'pages/journal.html',
    'pages/journal/design.html',
    'pages/portfolio.html',
    'index.html',
    'rss.xml',
    'sitemap.xml'
  ]) {
    assert.equal(isJournalSyncOwnedPath(owned), true, `missing owned sync path ${owned}`);
  }
  for (const forbidden of [
    'package.json',
    'scripts/import-journal-export.mjs',
    'style/blog.css',
    'assets/social/pages-contact.png',
    'assets/social/pages-blog-article.svg',
    'assets/social/custom.png',
    '.github/workflows/site-quality-and-pages.yml',
    'pages/contact.html',
    'content/blogs/../escape.md',
    'content/game-designs/../escape.md'
  ]) {
    assert.equal(isJournalSyncOwnedPath(forbidden), false, `sync must not own ${forbidden}`);
  }
});

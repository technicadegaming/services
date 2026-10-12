// Dependency-free, read-only validation of the static GitHub Pages site.
// Run: node scripts/check-static-site.mjs
import fs from 'node:fs';
import path from 'node:path';
import { Script } from 'node:vm';

const root = process.cwd();
const htmlFiles = fs.readdirSync(root).filter((name) => name.endsWith('.html'));
const rootFiles = new Set(fs.readdirSync(root));
const idsFor = (html) => new Set([...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]));
const pages = new Map(htmlFiles.map((name) => [name, fs.readFileSync(path.join(root, name), 'utf8')]));
const problems = [];
let checkedLinks = 0;
let checkedScripts = 0;

const isExternal = (url) => /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(url);
for (const [file, html] of pages) {
  if (!/<html\b[^>]*\blang\s*=\s*["'][^"']+["']/i.test(html)) problems.push(file + ': no html lang');
  if (!/<meta\b[^>]*name\s*=\s*["']viewport["']/i.test(html)) problems.push(file + ': no viewport');
  if (!/<title>[\s\S]*?\S[\s\S]*?<\/title>/i.test(html)) problems.push(file + ': no title');

  const ids = idsFor(html);
  for (const match of html.matchAll(/\bhref\s*=\s*["']([^"']+)["']/gi)) {
    const href = match[1].trim();
    if (!href || isExternal(href)) continue;
    checkedLinks += 1;
    const [pathname, hash] = href.split('#');
    const clean = pathname.split('?')[0].replace(/^\.\/|^\//g, '');
    const destination = pathname === ''
      ? file // An in-page #anchor stays on this page, not the homepage.
      : (!clean || clean.endsWith('/') ? 'index.html' : clean);
    if (destination.includes('..')) {
      problems.push(file + ': relative path traversal ' + href);
      continue;
    }
    if (!rootFiles.has(destination)) {
      problems.push(file + ': missing relative link ' + href);
      continue;
    }
    if (hash && pages.has(destination)) {
      const fragment = decodeURIComponent(hash);
      if (fragment && !idsFor(pages.get(destination)).has(fragment)) {
        problems.push(file + ': missing anchor ' + href);
      }
    }
  }

  // Parse scripts without executing untrusted page code or accessing network.
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = match[1];
    if (/\bsrc\s*=/.test(attrs) || /type\s*=\s*["']application\/ld\+json/i.test(attrs)) continue;
    const code = match[2].trim();
    if (!code) continue;
    checkedScripts += 1;
    try {
      new Script(code, { filename: file + ':inline-script' });
    } catch (error) {
      problems.push(file + ': invalid inline JavaScript: ' + error.message);
    }
  }
}

if (problems.length) {
  console.error('Static-site checks failed:\n' + problems.map((x) => ' - ' + x).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Static-site checks passed: ' + htmlFiles.length +
    ' HTML pages, ' + checkedLinks + ' local links, ' + checkedScripts +
    ' inline scripts. No customer data or network requests involved.');
}

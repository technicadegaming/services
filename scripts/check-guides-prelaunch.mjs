#!/usr/bin/env node
// Prelaunch contract: staged Guides may be linked within their own unlisted hub,
// but must not appear in public Technicade navigation, sitemap or search.
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const staged = new URL('https://technicade.tech/');
const guidePaths = new Set(['/resources.html']);
const pages = fs.readdirSync(root).filter(name => name.endsWith('.html') && name !== 'resources.html');
const failures = [];

for (const page of pages) {
  const html = fs.readFileSync(path.join(root,page),'utf8');
  const tags = html.match(/<a\s[^>]*href=["'][^"']+["'][^>]*>/gi) || [];
  for (const tag of tags) {
    const href = tag.match(/href=["']([^"']+)["']/i)?.[1] || '';
    let uri;
    try {uri = new URL(href, new URL(page,staged));}catch{continue;}
    // Ignore links to unrelated domains, e.g. external documentation.
    if (uri.hostname !== staged.hostname) continue;
    const target = uri.pathname;
    if (guidePaths.has(target) || target.startsWith('/resources/')) {
      failures.push(`${page}: public link to staged Guide (${target})`);
    }
  }
}

const resourceHub = path.join(root,'resources.html');
if (!fs.existsSync(resourceHub)) {
  failures.push('resources.html missing; expected unlisted hub');
} else {
  const html=fs.readFileSync(resourceHub,'utf8');
  if (!/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html)) failures.push('resources.html must remain noindex');
}

const directory=path.join(root,'resources');
if (!fs.existsSync(directory)) failures.push('resources/ folder missing');
else for (const file of fs.readdirSync(directory).filter(x=>x.endsWith('.html'))) {
  const html=fs.readFileSync(path.join(directory,file),'utf8');
  if (!/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html)) {
    failures.push(`resources/${file}: noindex missing`);
  }
}

const sitemap = fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
if (/https?:\/\/technicade\.tech\/resources(?:\/|\.html)/i.test(sitemap)) {
  failures.push('sitemap.xml includes unpublished resource pages');
}

for(const message of failures) console.error('FAIL: '+message);
if (failures.length) {
  console.error(`Prelaunch staged Guides gate: ${failures.length} failure(s).`);
  process.exitCode=1;
} else {
  console.log(`PASS: ${pages.length} public pages contain no staged-guide anchors, hub and article noindex are intact, sitemap excludes resources.`);
}

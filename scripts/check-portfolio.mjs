import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const portfolio=fs.readFileSync(path.join(root,'portfolio.html'),'utf8');
const links=[...portfolio.matchAll(/href="(\/projects\/[^"]+\.html)"/g)].map(m=>m[1]);
const unique=new Set(links);
assert.equal(links.length,28,'Portfolio must list all 28 recorded projects');
assert.equal(unique.size,links.length,'Duplicate project detail links');
assert.equal((portfolio.match(/<section class="section" id=/g)||[]).length,5,'Portfolio must retain five project categories');
for(const url of links){
  const local=path.join(root,url.replace(/^\//,''));
  assert.ok(fs.existsSync(local),'Missing project page: '+url);
  const page=fs.readFileSync(local,'utf8');
  assert.match(page,/<title>.+?\| Technicade<\/title>/,'Title missing: '+url);
  assert.ok(page.includes('href="/portfolio.css"'),'Absolute shared stylesheet required: '+url);
  assert.ok(page.includes('href="/portfolio.html"'),'Portfolio back-navigation missing: '+url);
  assert.ok(page.includes('https://technicade.tech'+url),'Canonical URL missing: '+url);
}
for(const file of ['index.html','products.html','labs.html']){
 const content=fs.readFileSync(path.join(root,file),'utf8');
 assert.ok(content.includes('portfolio.html'),'Portfolio navigation missing: '+file);
}
assert.ok(portfolio.includes('id="portfolio-search"'),'Accessible portfolio search input required');
assert.ok(portfolio.includes('id="portfolio-count"'),'Search count/status required');
console.log('Portfolio integrity verified:',unique.size,'project routes and 3 entry pages');

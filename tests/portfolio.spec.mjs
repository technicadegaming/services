import {test,expect} from '@playwright/test';
test.use({baseURL:'http://127.0.0.1:8765'});
const routes=['/portfolio.html','/projects/arcade-tools.html','/projects/equipmentqr.html','/projects/lifeos.html'];
test('portfolio search filters and restores project cards',async({page})=>{
 await page.goto('/portfolio.html');
 await expect(page.locator('.section .card')).toHaveCount(28);
 await page.locator('#portfolio-search').fill('EquipmentQR');
 await expect(page.locator('.section .card:visible')).toHaveCount(1);
 await expect(page.locator('#portfolio-count')).toContainText('1 of 28');
 await page.locator('#portfolio-search').fill('unlikely-search-term-zz');
 await expect(page.locator('.section .card:visible')).toHaveCount(0);
 await page.locator('#portfolio-search').clear();
 await expect(page.locator('.section .card:visible')).toHaveCount(28);
});
test('entry paths lead to existing pages',async({page})=>{
 await page.goto('/portfolio.html');
 await expect(page.locator('.visitor-paths a')).toHaveCount(3);
 for(const link of await page.locator('.visitor-paths a').all()){
  const href=await link.getAttribute('href');
  const response=await page.request.get(href);
  expect(response.status(),href).toBe(200);
 }
});
for(const width of [320,390,768,1280]){
 test('portfolio layout avoids horizontal overflow at '+width,async({page})=>{
  await page.setViewportSize({width,height:800});
  await page.goto('/portfolio.html');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
  expect(overflow).toBeFalsy();
 });
}
for(const route of routes){
 test('portfolio page loads with heading and styles '+route,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(route);
  expect(response.status()).toBe(200);
  await expect(page.locator('h1')).toBeVisible();
  expect(errors).toEqual([]);
 });
}

import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

test.use({ baseURL: 'http://127.0.0.1:8765' });

test.beforeEach(async ({ page }) => {
  await page.route('https://static.cloudflareinsights.com/**', route => route.abort());
});

test('Labs hub and all four standalone game links resolve', async ({ page }) => {
  await page.goto('/labs.html');
  await expect(page.locator('#bigButton')).toBeVisible();
  for (const href of ['would-you-rather.html','fake-achievement.html','challenge-wheel.html','one-more-second.html']) {
    const link = page.locator('a[href="'+href+'"]').first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page.locator('h1').first()).toBeVisible();
    await page.goto('/labs.html');
  }
});

test('Button counts and achievements survive reload', async ({ page }) => {
  await page.goto('/labs.html');
  for (let i=0;i<10;i++) await page.locator('#bigButton').click();
  await expect(page.locator('#count')).toHaveText('10');
  await expect(page.locator('#badges')).toHaveText('2');
  await page.reload();
  await expect(page.locator('#count')).toHaveText('10');
  await expect(page.locator('#badges')).toHaveText('2');
});

test('Would You Rather allows choices, skips and a new deck', async ({ page }) => {
  await page.goto('/would-you-rather.html');
  for (let i=0;i<20;i++) {
    await expect(page.locator('#question')).toHaveText('Question '+(i+1)+' of 20');
    if(i%2===0) {
      await page.locator('#one').click();
      await expect(page.locator('#verdict')).toContainText('You chose:');
    }
    await page.locator('#next').click();
  }
  await expect(page.locator('#question')).toHaveText('Question 1 of 20');
});

test('Challenge Wheel labels and pointer result align at 1, 2, 8 and 16 entries', async ({ page }) => {
  await page.goto('/challenge-wheel.html');
  await page.addStyleTag({ content: '.disk{transition-duration:0.01s!important}' });
  await page.evaluate(() => { Math.random = () => 0.45; });
  for(const n of [1,2,8,16]) {
    const labels=Array.from({length:n},(_,i)=>'Test challenge '+(i+1));
    await page.locator('#entries').fill(labels.join('\n'));
    await expect(page.locator('.slice-label')).toHaveCount(n);
    if(n>8) await expect(page.locator('.slice-label').first()).toHaveText('1');
    await page.locator('#spin').click();
    await expect(page.locator('#outcome')).toHaveText('Challenge: '+labels[Math.floor(0.45*n)]);
    await expect(page.locator('#spin')).toBeEnabled();
    // Normalize accumulated degrees to the selected slice center at the top pointer.
    const data=await page.locator('#disk').evaluate(el=>{
      const transform=getComputedStyle(el).transform;
      const values=transform.match(/matrix\(([^)]+)\)/)?.[1].split(',').map(Number);
      return values?Math.atan2(values[1],values[0])*180/Math.PI:null;
    });
    expect(data).not.toBeNull();
    const expected=(360-Math.floor(0.45*n)*360/n)%360;
    const normalized=((data%360)+360)%360;
    const difference=Math.min(Math.abs(expected-normalized),360-Math.abs(expected-normalized));
    expect(difference).toBeLessThan(0.5);
  }
});

test('Challenge Wheel rejects an empty list without spinning', async ({ page }) => {
  await page.goto('/challenge-wheel.html');
  await page.locator('#entries').fill('');
  await page.locator('#spin').click();
  await expect(page.locator('#outcome')).toHaveText('Add at least one challenge first.');
  await expect(page.locator('#spin')).toBeEnabled();
});

test('Fake Achievement can export a valid PNG with long input', async ({ page }) => {
  await page.goto('/fake-achievement.html');
  await page.locator('#name').fill('Long participant name '.repeat(25));
  await page.locator('#title').fill('The champion of elaborate and whimsical achievements '.repeat(15));
  await page.locator('#reason').fill('Because this is an extremely long description '.repeat(30));
  const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#save').click()]);
  expect(download.suggestedFilename()).toBe('technicade-achievement.png');
  const bytes=await fs.readFile(await download.path());
  expect(bytes.subarray(0,8).toString('hex')).toBe('89504e470d0a1a0a');
  expect(bytes.readUInt32BE(16)).toBe(1200);
  expect(bytes.readUInt32BE(20)).toBe(630);
});

test('One More Second target and clock complete one round', async ({ page }) => {
  await page.clock.install();
  await page.goto('/one-more-second.html');
  await page.locator('#start').click();
  await expect(page.locator('#target')).toBeVisible();
  await page.locator('#target').click();
  await expect(page.locator('#score')).toHaveText('1');
  await page.clock.fastForward(30100);
  await expect(page.locator('#headline')).toHaveText('Time is up!');
  await expect(page.locator('#best')).toHaveText('1');
});

for(const width of [320,390,768,1280]) {
  test('Game pages do not overflow horizontally at '+width+'px', async ({ page }) => {
    await page.setViewportSize({width,height:850});
    for (const path of ['/labs.html','/would-you-rather.html','/fake-achievement.html','/challenge-wheel.html','/one-more-second.html','/rate-my-duck.html','/useless-job-simulator.html']) {
      await page.goto(path);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
      expect(overflow,path+' horizontal overflow').toBeLessThanOrEqual(2);
    }
  });
}

test('Rate My Duck creates a verdict, local hall, shareable 1200x630 PNG and reset', async ({ page }) => {
  await page.goto('/rate-my-duck.html');
  await page.locator('#duckName').fill('Professor Pond');
  await page.getByLabel('Chaotic').check();
  await page.locator('#judge').click();
  await expect(page.locator('#result')).toBeVisible();
  await expect(page.locator('#rating')).toHaveText(/^\d{1,2}\.\d\/10$/);
  await expect(page.locator('#comment')).toContainText('Professor Pond (Chaotic)');
  await expect(page.locator('#hall li').first()).toContainText('Professor Pond');
  const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#save').click()]);
  expect(download.suggestedFilename()).toBe('technicade-duck-verdict.png');
  const bytes=await fs.readFile(await download.path());
  expect(bytes.subarray(0,8).toString('hex')).toBe('89504e470d0a1a0a');
  expect(bytes.readUInt32BE(16)).toBe(1200);
  expect(bytes.readUInt32BE(20)).toBe(630);
  await page.reload();
  await expect(page.locator('#hall li').first()).toContainText('Professor Pond');
  page.once('dialog', dialog=>dialog.accept());
  await page.locator('#clearHall').click();
  await expect(page.locator('#hall')).toContainText('No ducks rated yet');
});

test('Rate My Duck keeps selected images local and rejects invalid files', async ({ page }) => {
  await page.goto('/rate-my-duck.html');
  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL/nwAAAABJRU5ErkJggg==','base64');
  const posted=[];
  page.on('request', request=>{if(request.method()==='POST')posted.push(request.url());});
  await page.locator('#duckPhoto').setInputFiles({name:'duck.png',mimeType:'image/png',buffer:png});
  await expect(page.locator('#duckImage')).toBeVisible();
  await page.locator('#judge').click();
  await expect(page.locator('#result')).toBeVisible();
  await page.locator('#clearPhoto').click();
  await expect(page.locator('#duckImage')).toBeHidden();
  await page.locator('#duckPhoto').setInputFiles({name:'not-an-image.txt',mimeType:'text/plain',buffer:Buffer.from('bad file')});
  await expect(page.locator('#error')).toContainText('Choose a PNG');
  expect(posted).toEqual([]);
});


test('Useless Job Simulator awards promotions and persists CEO memo decisions', async ({ page }) => {
  await page.goto('/useless-job-simulator.html');
  await expect(page.locator('#rank')).toHaveText('Unpaid Intern of Nothing');
  await expect(page.locator('#slide')).toBeDisabled();
  for (let i=0;i<5;i++) await page.locator('#reply').click();
  await expect(page.locator('#memo')).toBeVisible();
  await expect(page.locator('#reply')).toBeDisabled();
  await page.locator('#answerA').click();
  await expect(page.locator('#memo')).toBeHidden();
  await expect(page.locator('#rank')).toHaveText('Assistant to the Assistant');
  await expect(page.locator('#slide')).toBeEnabled();
  await expect(page.locator('#points')).toHaveText('87');
  await page.reload();
  await expect(page.locator('#rank')).toHaveText('Assistant to the Assistant');
  await expect(page.locator('#points')).toHaveText('87');
  await expect(page.locator('#taskCount')).toHaveText('5');
});

test('Useless Job Simulator energy refill, ultimate promotion and reset', async ({ page }) => {
  await page.goto('/useless-job-simulator.html');
  await page.locator('#paper').click();
  await expect(page.locator('#energyText')).toHaveText('93 / 100');
  await page.locator('#coffee').click();
  await expect(page.locator('#energyText')).toHaveText('100 / 100');
  await expect(page.locator('#achievements')).toContainText('First Task');
  await page.evaluate(()=>{
    localStorage.setItem('technicade-labs-useless-job-v1',JSON.stringify({
      points:1045,energy:100,tasks:14,memos:2,coffees:5,pending:null,log:[]
    }));
  });
  await page.reload();
  await expect(page.locator('#rank')).toHaveText('VP of Meetings');
  await page.locator('#reply').click();
  await expect(page.locator('#rank')).toHaveText('Senior Vice Potato');
  await expect(page.locator('#achievements')).toContainText('✓ Senior Vice Potato');
  page.once('dialog', d=>d.accept());
  await page.locator('#reset').click();
  await expect(page.locator('#rank')).toHaveText('Unpaid Intern of Nothing');
  await expect(page.locator('#points')).toHaveText('0');
  await page.reload();
  await expect(page.locator('#points')).toHaveText('0');
});


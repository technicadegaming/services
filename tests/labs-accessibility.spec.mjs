import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.use({ baseURL: 'http://127.0.0.1:8765' });

for (const pagePath of ['/labs.html','/would-you-rather.html','/fake-achievement.html','/challenge-wheel.html','/one-more-second.html','/rate-my-duck.html','/useless-job-simulator.html']) {
  test('WCAG A/AA static page audit '+pagePath, async ({ page }) => {
    await page.route('https://static.cloudflareinsights.com/**', route => route.abort());
    await page.goto(pagePath);
    const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    const detail=report.violations.map(v=>v.id+': '+v.nodes.map(n=>n.target.join(', ')).join('; '));
    expect(detail).toEqual([]);
  });
}

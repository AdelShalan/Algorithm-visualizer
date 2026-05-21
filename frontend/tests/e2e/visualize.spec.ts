import { test, expect } from '@playwright/test';

test('play button exists on bubble sort', async ({ page }) => {
  await page.goto('/sorting/bubble-sort');
  // Wait for page to load
  await expect(page.locator('div', { hasText: /^Bubble sort$/ }).first()).toBeVisible();
  // Run/Play button should be visible
  const playBtn = page.locator('button[title="Run"], button[title="Play"]').first();
  await expect(playBtn).toBeVisible();
  // Click should not throw
  await playBtn.click();
});

test('shuffle array on bubble sort', async ({ page }) => {
  await page.goto('/sorting/bubble-sort');
  // Wait for page to load
  await expect(page.locator('div', { hasText: /^Bubble sort$/ }).first()).toBeVisible();
  const shuffleBtn = page.getByRole('button', { name: 'Shuffle' });
  await expect(shuffleBtn).toBeVisible();
  await shuffleBtn.click();
  // Array should change
  await page.waitForTimeout(200);
});

import { test, expect } from '@playwright/test';

test('filter by category', async ({ page }) => {
  await page.goto('/algorithms');
  // Wait for algorithms to load
  await expect(page.getByRole('heading', { name: 'All algorithms' })).toBeVisible();
  // Click the Sorting tab
  await page.getByRole('button', { name: /Sorting/ }).click();
  // Should show sorting algorithms
  await expect(page.getByText('Bubble sort')).toBeVisible();
});

test('navigate to algorithm visualization', async ({ page }) => {
  await page.goto('/algorithms');
  // Wait for algorithms to load
  await expect(page.getByRole('heading', { name: 'All algorithms' })).toBeVisible();
  // Click on Bubble sort card
  await page.getByRole('link', { name: /Bubble sort/ }).first().click();
  await expect(page).toHaveURL(/\/sorting\/bubble-sort/);
  // Wait for algorithm name to appear (it's a div, not a heading)
  await expect(page.locator('div', { hasText: /^Bubble sort$/ }).first()).toBeVisible();
});

import { test, expect } from '@playwright/test';

test('landing page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/AlgoVis/);
  await expect(page.getByText(/interactive algorithm learning/i)).toBeVisible();
});

test('category cards render', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /Sorting/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Graph Algorithms/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Dynamic Programming/ })).toBeVisible();
});

test('navigate to algorithms page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Algorithms', exact: true }).first().click();
  await expect(page).toHaveURL(/\/algorithms/);
  await expect(page.getByRole('heading', { name: 'All algorithms' })).toBeVisible();
});

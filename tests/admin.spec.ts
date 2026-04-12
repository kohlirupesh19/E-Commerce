import { test, expect } from '@playwright/test';

test.describe('Admin Navigation & Views', () => {
  test('should load admin dashboard', async ({ page }) => {
    await page.goto('/admin-dashboard');
    await expect(page.locator('text=Curator Insights').first()).toBeVisible({ timeout: 10000 });
  });

  test('should load admin products', async ({ page }) => {
    await page.goto('/admin-products');
    await expect(page.locator('text=Product Archive').first()).toBeVisible({ timeout: 10000 });
  });

  test('should load admin orders', async ({ page }) => {
    await page.goto('/admin-orders');
    await expect(page.locator('text=Order Management').first()).toBeVisible({ timeout: 10000 });
  });

  test('should load admin customers', async ({ page }) => {
    await page.goto('/admin-customers');
    await expect(page.locator('text=Admin Customers').first()).toBeVisible({ timeout: 10000 });
  });

  test('should load admin customer profile', async ({ page }) => {
    await page.goto('/admin-customer-profile');
    await expect(page.locator('text=Elena Valerius').first()).toBeVisible({ timeout: 10000 });
  });

  test('should load admin coupons', async ({ page }) => {
    await page.goto('/admin-coupons');
    await expect(page.locator('text=Promotional Vault').first()).toBeVisible({ timeout: 10000 });
  });
});

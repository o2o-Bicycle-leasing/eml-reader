import { test, expect } from '@playwright/test'

test('has title', async ({ page }) =>
{
	await page.goto('/')
	await expect(page).toHaveTitle('o2o eml reader')
});

// The document language used to be hardcoded to 'en' site-wide, so /fr served
// French copy under lang="en". It is derived from Astro.currentLocale now.
test('sets the document language per locale', async ({ page }) =>
{
	await page.goto('/')
	await expect(page.locator('html')).toHaveAttribute('lang', 'en')

	await page.goto('/fr')
	await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
});

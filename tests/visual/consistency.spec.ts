/**
 * Brand Consistency & Content Validation Tests
 * Catches naming bugs (e.g. "BeUnited Kingdom"), empty states, broken forms.
 * See TESTING.md and DESIGN_SYSTEM.md for rules.
 */
import { test, expect } from '@playwright/test'

test.describe('Brand Consistency', () => {
  test('[consistency] homepage never shows "BeUnited Kingdom"', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const text = await page.textContent('body')
    expect(text).not.toContain('BeUnited Kingdom')
  })

  test('[consistency] homepage never shows raw country name "BeUnited States"', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const text = await page.textContent('body')
    expect(text).not.toContain('BeUnited States')
  })

  test('[consistency] ventures page has content cards', async ({ page }) => {
    await page.goto('/ventures', { waitUntil: 'domcontentloaded' })
    // Should show path/venture cards, not an empty page
    await expect(
      page.locator('[class*="card"], [class*="Card"], [class*="rounded-xl"]').first()
    ).toBeVisible({ timeout: 5000 })
  })

  test('[consistency] contact page form is functional', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('textbox').first()).toBeVisible()
    await expect(page.getByRole('button', { name: /send|submit/i })).toBeVisible()
  })

  test('[consistency] compass page loads with route wizard', async ({ page }) => {
    await page.goto('/compass', { waitUntil: 'domcontentloaded' })
    // Compass is a 4-step wizard — should show step content or heading
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })

  test('[consistency] pricing page shows plans', async ({ page }) => {
    await page.goto('/pricing', { waitUntil: 'domcontentloaded' })
    // Pricing page should show pricing tiers or plan cards
    await expect(
      page.locator('[class*="card"], [class*="Card"], [class*="rounded-xl"]').first()
    ).toBeVisible({ timeout: 5000 })
  })

  test('[consistency] about page has mission content', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('h1, h2').first()).toBeVisible()
    // Should contain brand-relevant text
    const text = await page.textContent('body')
    expect(text?.length).toBeGreaterThan(100)
  })

  test('[consistency] country gate /be/ke loads', async ({ page }) => {
    await page.goto('/be/ke', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('h1, h2').first()).toBeVisible()
    // Should reference Kenya
    const text = await page.textContent('body')
    expect(text).toMatch(/kenya|nairobi|KE/i)
  })
})

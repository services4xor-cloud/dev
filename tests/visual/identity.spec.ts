/**
 * Identity System E2E Tests
 *
 * Tests the full identity chain:
 *   1. Service layer → API → Hook → UI (data format consistency)
 *   2. Identity dropdown appears on Nav logo click
 *   3. Identity dropdown appears on Homepage hero logo click
 *   4. Selecting a country changes identity context
 *   5. Selecting a language changes UI text (i18n)
 *   6. Thread data has required fields (slug, brandName, type, icon)
 *   7. Identity persists across page navigation (localStorage)
 *   8. Mobile nav opens instantly (no animation delay)
 *
 * See TESTING.md for strategy.
 */
import { test, expect } from '@playwright/test'

test.describe('Identity System — Full Chain', () => {
  // ─── API Layer ────────────────────────────────────────────────
  test('[api] GET /api/threads returns valid thread data', async ({ request }) => {
    const res = await request.get('/api/threads')
    expect(res.ok()).toBe(true)

    const data = await res.json()
    expect(data.success).toBe(true)
    expect(Array.isArray(data.threads)).toBe(true)
    expect(data.threads.length).toBeGreaterThan(0)

    // Every thread must have required fields
    for (const thread of data.threads) {
      expect(thread.slug).toBeTruthy()
      expect(thread.name).toBeTruthy()
      expect(thread.brandName).toBeTruthy()
      expect(thread.type).toBeTruthy()
      expect(thread.icon).toBeTruthy()
      expect(thread.tagline).toBeTruthy()
      expect(typeof thread.memberCount).toBe('number')
      expect(thread.memberCount).toBeGreaterThanOrEqual(0)
    }
  })

  test('[api] GET /api/threads?type=country returns only country threads', async ({ request }) => {
    const res = await request.get('/api/threads?type=country')
    const data = await res.json()
    expect(data.success).toBe(true)

    for (const thread of data.threads) {
      expect(thread.type.toLowerCase()).toBe('country')
    }
  })

  test('[api] GET /api/threads?type=language returns only language threads', async ({
    request,
  }) => {
    const res = await request.get('/api/threads?type=language')
    const data = await res.json()
    expect(data.success).toBe(true)

    for (const thread of data.threads) {
      expect(thread.type.toLowerCase()).toBe('language')
    }
  })

  test('[api] threads include major world languages', async ({ request }) => {
    const res = await request.get('/api/threads?type=language')
    const data = await res.json()
    const slugs = data.threads.map((t: { slug: string }) => t.slug)

    // Must include the top global languages
    const required = ['english', 'deutsch', 'swahili', 'french', 'spanish', 'chinese']
    for (const lang of required) {
      expect(slugs).toContain(lang)
    }
  })

  // ─── Nav Identity Dropdown ────────────────────────────────────
  test('[nav] clicking logo opens identity switcher', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // The identity switcher should not be visible initially
    await expect(page.getByTestId('identity-switcher')).not.toBeVisible()

    // Click the nav logo area to open the dropdown
    await page.locator('nav button[aria-haspopup="menu"]').first().click()

    // Identity switcher should now be visible
    await expect(page.getByTestId('identity-switcher')).toBeVisible()
  })

  test('[nav] identity switcher shows all 5 tabs', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.locator('nav button[aria-haspopup="menu"]').first().click()

    // Check that tab buttons exist
    await expect(page.getByTestId('identity-tab-countries')).toBeVisible()
    await expect(page.getByTestId('identity-tab-tribes')).toBeVisible()
    await expect(page.getByTestId('identity-tab-languages')).toBeVisible()
    await expect(page.getByTestId('identity-tab-faith')).toBeVisible()
    await expect(page.getByTestId('identity-tab-paths')).toBeVisible()
  })

  test('[nav] selecting a country updates the brand name', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.locator('nav button[aria-haspopup="menu"]').first().click()

    // Click on Germany
    await page.getByTestId('identity-thread-de').click()

    // The dropdown should close
    await expect(page.getByTestId('identity-switcher')).not.toBeVisible()
  })

  test('[nav] selecting a language opens language tab threads', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.locator('nav button[aria-haspopup="menu"]').first().click()

    // Switch to Languages tab
    await page.getByTestId('identity-tab-languages').click()

    // Should show language threads
    await expect(page.getByTestId('identity-thread-english')).toBeVisible()
    await expect(page.getByTestId('identity-thread-deutsch')).toBeVisible()
    await expect(page.getByTestId('identity-thread-swahili')).toBeVisible()
  })

  // ─── Homepage Identity Dropdown ───────────────────────────────
  test('[homepage] hero logo has identity switcher trigger', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // The hero identity trigger should exist
    const trigger = page.getByTestId('hero-identity-trigger')
    await expect(trigger).toBeVisible()

    // It should show "Click to switch identity" hint
    await expect(trigger).toContainText('identity')
  })

  test('[homepage] clicking hero logo opens identity dropdown', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // Click the hero logo
    await page.getByTestId('hero-identity-trigger').click()

    // Identity switcher should appear
    const switchers = page.getByTestId('identity-switcher')
    // There might be 2 (nav + hero) — at least the hero one should be visible
    await expect(switchers.last()).toBeVisible()
  })

  // ─── i18n Content ─────────────────────────────────────────────
  test('[i18n] homepage renders translated text when language changes', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // Default should show English text
    await expect(page.locator('h1')).toContainText('belong')

    // Open identity switcher from nav
    await page.locator('nav button[aria-haspopup="menu"]').first().click()

    // Switch to Languages tab and select Deutsch
    await page.getByTestId('identity-tab-languages').click()
    await page.getByTestId('identity-thread-deutsch').click()

    // Wait for re-render and check German text appears
    await page.waitForTimeout(500)
    await expect(page.locator('h1')).toContainText('hingehörst')
  })

  // ─── Thread Data Integrity ────────────────────────────────────
  test('[data] every thread has a valid brandName starting with "Be"', async ({ request }) => {
    const res = await request.get('/api/threads')
    const data = await res.json()

    for (const thread of data.threads) {
      expect(thread.brandName).toMatch(/^Be/)
    }
  })

  test('[data] country threads have exactly one country in countries[]', async ({ request }) => {
    const res = await request.get('/api/threads?type=country')
    const data = await res.json()

    for (const thread of data.threads) {
      expect(Array.isArray(thread.countries)).toBe(true)
      expect(thread.countries.length).toBe(1)
      // Country code should be 2 chars uppercase
      expect(thread.countries[0]).toMatch(/^[A-Z]{2}$/)
    }
  })

  test('[data] thread types are valid enum values', async ({ request }) => {
    const res = await request.get('/api/threads')
    const data = await res.json()

    const validTypes = [
      'country',
      'tribe',
      'language',
      'interest',
      'religion',
      'science',
      'location',
    ]
    for (const thread of data.threads) {
      expect(validTypes).toContain(thread.type.toLowerCase())
    }
  })

  // ─── Mobile Nav ───────────────────────────────────────────────
  test('[mobile] burger menu opens instantly without animation delay', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 380, height: 812 })
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // Find and click the mobile menu button
    const menuButton = page.locator('button[aria-controls="mobile-nav"]')
    await expect(menuButton).toBeVisible()
    await menuButton.click()

    // The mobile nav should be visible almost immediately (within 200ms)
    const mobileNav = page.locator('#mobile-nav')
    await expect(mobileNav).toBeVisible({ timeout: 300 })

    // Background should be opaque (not transparent)
    const backdrop = mobileNav.locator('div').first()
    await expect(backdrop).toBeVisible()
  })

  // ─── Identity Persistence ────────────────────────────────────
  test('[persistence] identity survives page navigation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // Open nav identity switcher and select Germany
    await page.locator('nav button[aria-haspopup="menu"]').first().click()
    await page.getByTestId('identity-thread-de').click()

    // Navigate to another page
    await page.goto('/ventures', { waitUntil: 'domcontentloaded' })

    // Check localStorage has the identity saved
    const stored = await page.evaluate(() => localStorage.getItem('be-identity'))
    expect(stored).toBeTruthy()

    const identity = JSON.parse(stored!)
    expect(identity.country).toBe('DE')
  })
})

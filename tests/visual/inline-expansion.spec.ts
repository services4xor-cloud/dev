/**
 * Inline Expansion Tests — Expanded content must appear near its trigger
 *
 * Guards against the UX violation where clicking something opens a detail
 * panel far below the fold, forcing users to scroll to see the response.
 *
 * Rule: expanded content must be visible in viewport (or within 200px
 * of viewport bottom) after the trigger is clicked.
 */
import { test, expect } from '@playwright/test'

// Helper: set up identity so protected pages work
async function setupIdentity(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    localStorage.setItem(
      'be-identity',
      JSON.stringify({
        country: 'KE',
        language: 'en',
        languages: ['en', 'sw'],
        interests: ['tech'],
        faith: [],
        craft: ['Software Development'],
        reach: ['can-travel'],
        culture: '',
        toCountries: [],
        mode: 'explorer',
      })
    )
    localStorage.setItem('be-discovery-complete', 'true')
  })
}

test.describe('Inline Expansion UX', () => {
  test('Compass — route detail appears near clicked card, not far below', async ({ page }) => {
    await page.goto('/compass')
    await setupIdentity(page)
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Find the first route card button
    const routeCards = page.locator('button').filter({ hasText: '→' })
    const cardCount = await routeCards.count()

    if (cardCount === 0) {
      test.skip(true, 'No route cards found — user may not have routes configured')
      return
    }

    // Get the first card's position
    const firstCard = routeCards.first()
    const cardBox = await firstCard.boundingBox()
    expect(cardBox).toBeTruthy()

    // Click the first route card
    await firstCard.click()

    // Wait for detail panel to appear (has visa info, sectors, etc.)
    const detailPanel = page.locator('[class*="border-brand-accent"]').filter({
      hasText: /(Visa|visa|Sectors|sectors|Payment|payment)/i,
    })
    await expect(detailPanel.first()).toBeVisible({ timeout: 3000 })

    // Verify the detail panel is near the card (within viewport or close)
    const panelBox = await detailPanel.first().boundingBox()
    expect(panelBox).toBeTruthy()

    // Panel top should be below the card but NOT more than 600px below the card bottom
    // (600px = reasonable scroll distance, accounts for the grid of cards between)
    const distance = panelBox!.y - (cardBox!.y + cardBox!.height)
    expect(distance).toBeLessThan(600)
  })

  test('Compass — route detail scrolls into view on selection', async ({ page }) => {
    await page.goto('/compass')
    await setupIdentity(page)
    await page.reload()
    await page.waitForLoadState('networkidle')

    const routeCards = page.locator('button').filter({ hasText: '→' })
    const cardCount = await routeCards.count()
    if (cardCount === 0) {
      test.skip(true, 'No route cards')
      return
    }

    // Click a route card
    await routeCards.first().click()

    // Give scroll animation time
    await page.waitForTimeout(500)

    // The detail panel should be at least partially in the viewport
    const detailPanel = page.locator('[class*="border-brand-accent"]').filter({
      hasText: /(Visa|visa|Sectors|sectors|Payment|payment)/i,
    })
    await expect(detailPanel.first()).toBeVisible({ timeout: 3000 })

    const panelBox = await detailPanel.first().boundingBox()
    const viewport = page.viewportSize()
    expect(panelBox).toBeTruthy()
    expect(viewport).toBeTruthy()

    // Panel should be at least partially within the viewport
    const panelBottom = panelBox!.y + panelBox!.height
    const panelTop = panelBox!.y
    const viewportBottom = viewport!.height

    // Either the top or bottom of the panel should be in the viewport
    const isVisible = panelTop < viewportBottom && panelBottom > 0
    expect(isVisible).toBe(true)
  })

  test('Compass — switching routes keeps detail inline (no jump to bottom)', async ({ page }) => {
    await page.goto('/compass')
    await setupIdentity(page)
    await page.reload()
    await page.waitForLoadState('networkidle')

    const routeCards = page.locator('button').filter({ hasText: '→' })
    const cardCount = await routeCards.count()
    if (cardCount < 2) {
      test.skip(true, 'Need at least 2 route cards')
      return
    }

    // Click first card, note panel position
    await routeCards.first().click()
    await page.waitForTimeout(300)

    const detailPanel = page.locator('[class*="border-brand-accent"]').filter({
      hasText: /(Visa|visa|Sectors|sectors|Payment|payment)/i,
    })
    await expect(detailPanel.first()).toBeVisible({ timeout: 3000 })
    const firstPos = await detailPanel.first().boundingBox()

    // Click second card
    await routeCards.nth(1).click()
    await page.waitForTimeout(300)

    await expect(detailPanel.first()).toBeVisible({ timeout: 3000 })
    const secondPos = await detailPanel.first().boundingBox()

    // Both positions should be in the same general area (same section)
    // Allow 300px tolerance for grid reflow
    expect(Math.abs(secondPos!.y - firstPos!.y)).toBeLessThan(300)
  })

  test('Exchange — search bar is visible and functional', async ({ page }) => {
    await page.goto('/exchange')
    await setupIdentity(page)
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Search bar should be visible
    const searchInput = page.locator('input[placeholder*="Search"]')
    await expect(searchInput).toBeVisible({ timeout: 5000 })

    // Type a search query
    await searchInput.fill('developer')
    await page.waitForTimeout(300)

    // Results count should update and mention the search
    const resultsText = page.locator('text=/for.*developer/i')
    await expect(resultsText).toBeVisible({ timeout: 3000 })
  })

  test('Exchange — needs flow pre-fills search from URL params', async ({ page }) => {
    await page.goto('/exchange?skills=tech&q=software+developer')
    await setupIdentity(page)
    await page.reload({ waitUntil: 'networkidle' })

    // Search bar should be pre-filled with the query
    const searchInput = page.locator('input[placeholder*="Search"]')
    await expect(searchInput).toBeVisible({ timeout: 5000 })
    await expect(searchInput).toHaveValue('software developer')
  })
})

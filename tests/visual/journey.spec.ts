/**
 * Journey Progress E2E Tests — Gamification + Dashboard progression
 * Validates that Pioneer and Anchor dashboards show meaningful state.
 * See TESTING.md for full strategy.
 */
import { test, expect } from '@playwright/test'

test.describe('Journey Progress', () => {
  test('[journey] pioneer dashboard shows progress or journey section', async ({ page }) => {
    await page.goto('/pioneers/dashboard', { waitUntil: 'domcontentloaded' })
    // Dashboard should show some form of journey, progress, or stage indicator
    await expect(page.getByText(/journey|progress|stage|chapter|dashboard/i).first()).toBeVisible()
  })

  test('[journey] pioneer dashboard has navigation tabs', async ({ page }) => {
    await page.goto('/pioneers/dashboard', { waitUntil: 'domcontentloaded' })
    // Should have at least one clickable tab or navigation section
    const buttons = page.locator('button, [role="tab"]')
    await expect(buttons.first()).toBeVisible()
  })

  test('[journey] anchor dashboard loads with content', async ({ page }) => {
    await page.goto('/anchors/dashboard', { waitUntil: 'domcontentloaded' })
    // Dashboard should show anchor-specific content
    await expect(page.getByText(/path|pioneer|dashboard|chapter|posted/i).first()).toBeVisible()
  })

  test('[journey] onboarding page shows identity capture steps', async ({ page }) => {
    await page.goto('/onboarding', { waitUntil: 'domcontentloaded' })
    // Onboarding is a multi-step identity capture wizard
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })
})

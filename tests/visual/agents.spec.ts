/**
 * Agent System E2E Tests — Landing page + Dashboard tabs + Demand feed
 * Validates the Agent model: real people who bridge Anchors and Pioneers.
 * See TESTING.md for full strategy.
 */
import { test, expect } from '@playwright/test'

test.describe('Agent System', () => {
  // ─── Landing Page ──────────────────────────────────────────────
  test('[agents] landing page loads with CTA', async ({ page }) => {
    await page.goto('/agents', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('h1')).toBeVisible()
    // "Apply to become an Agent" CTA link
    await expect(page.getByRole('link', { name: /agent/i }).first()).toBeVisible()
  })

  test('[agents] landing page shows stats section', async ({ page }) => {
    await page.goto('/agents', { waitUntil: 'domcontentloaded' })
    // Stats: Active Agents, Placements Made, Countries Covered, Avg Commission
    await expect(page.getByText(/active agents/i)).toBeVisible()
    await expect(page.getByText(/placements made/i)).toBeVisible()
  })

  test('[agents] landing page shows how-it-works steps', async ({ page }) => {
    await page.goto('/agents', { waitUntil: 'domcontentloaded' })
    await expect(page.getByText(/how it works/i)).toBeVisible()
    // Four steps: Apply, Get Demand, Forward, Earn
    await expect(page.getByText('Apply').first()).toBeVisible()
    await expect(page.getByText('Forward').first()).toBeVisible()
    await expect(page.getByText('Earn').first()).toBeVisible()
  })

  test('[agents] CTA links to signup with agent role', async ({ page }) => {
    await page.goto('/agents', { waitUntil: 'domcontentloaded' })
    const cta = page.getByRole('link', { name: /apply to become an agent/i }).first()
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', '/signup?role=AGENT')
  })

  // ─── Dashboard ─────────────────────────────────────────────────
  test('[agents] dashboard loads with 3 tabs', async ({ page }) => {
    await page.goto('/agents/dashboard', { waitUntil: 'domcontentloaded' })
    // Wait for loading skeleton to clear
    await page.waitForTimeout(800)
    await expect(page.getByText(/demand feed/i)).toBeVisible()
    await expect(page.getByText(/my forwards/i)).toBeVisible()
    await expect(page.getByText(/earnings/i).first()).toBeVisible()
  })

  test('[agents] dashboard shows agent profile info', async ({ page }) => {
    await page.goto('/agents/dashboard', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(800)
    // Agent name and territory visible in top bar
    await expect(page.getByText('David Kimani')).toBeVisible()
    await expect(page.getByText(/nairobi/i)).toBeVisible()
  })

  test('[agents] demand feed shows path cards with Forward button', async ({ page }) => {
    await page.goto('/agents/dashboard', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(800)
    // Demand tab is active by default — should show path cards
    await expect(page.getByText(/registered nurse/i).first()).toBeVisible()
    // Forward via WhatsApp button
    await expect(page.getByText(/forward via whatsapp/i).first()).toBeVisible()
  })

  test('[agents] switching to Forwards tab shows funnel stats', async ({ page }) => {
    await page.goto('/agents/dashboard', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(800)
    // Click My Forwards tab
    await page.getByText(/my forwards/i).click()
    // Funnel labels: Sent, Clicked, Signed Up, Applied, Placed
    await expect(page.getByText('Sent').first()).toBeVisible()
    await expect(page.getByText('Placed').first()).toBeVisible()
  })

  test('[agents] switching to Earnings tab shows commission info', async ({ page }) => {
    await page.goto('/agents/dashboard', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(800)
    // Click Earnings tab
    await page
      .getByText(/earnings/i)
      .first()
      .click()
    // Should show total earnings and commission structure
    await expect(page.getByText(/total earnings/i).first()).toBeVisible()
    await expect(page.getByText(/commission/i).first()).toBeVisible()
  })
})

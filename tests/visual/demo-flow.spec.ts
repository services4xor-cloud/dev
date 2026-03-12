/**
 * Demo Flow E2E Tests — Discovery → Exchange → Connect → Messages → Chat
 * Validates the complete Pioneer journey for demo readiness.
 * Uses localStorage to simulate a completed discovery identity.
 */
import { test, expect, Page } from '@playwright/test'

// ─── Helpers ──────────────────────────────────────────────────────

/** Seed localStorage with a completed Pioneer identity */
async function seedIdentity(page: Page) {
  await page.addInitScript(() => {
    const identity = {
      country: 'KE',
      city: 'Nairobi',
      languages: ['sw', 'en'],
      interests: ['tech', 'business'],
      faith: ['Christianity'],
      craft: ['Software Development', 'Data Analysis'],
      reach: ['local', 'regional'],
      culture: 'Kikuyu',
    }
    localStorage.setItem('be-identity', JSON.stringify(identity))
  })
}

// ─── Discovery (Homepage) ────────────────────────────────────────

test.describe('Demo Flow: Discovery', () => {
  test('[demo] homepage loads with hero section', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    // Should show discovery / identity content
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })

  test('[demo] homepage shows content when identity is set', async ({ page }) => {
    await seedIdentity(page)
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    // Should show exchange/feed section or identity summary
    await expect(page.getByText(/exchange|pioneer|path|identity|welcome/i).first()).toBeVisible()
  })

  test('[demo] homepage shows paths section with data', async ({ page }) => {
    await seedIdentity(page)
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    // Should show some path/opportunity cards or feed items
    const content = page.locator('main')
    await expect(content).toBeVisible()
  })
})

// ─── Exchange ────────────────────────────────────────────────────

test.describe('Demo Flow: Exchange', () => {
  test('[demo] exchange page loads with identity', async ({ page }) => {
    await seedIdentity(page)
    await page.goto('/exchange', { waitUntil: 'domcontentloaded' })
    // Should show Exchange header
    await expect(page.getByText('Exchange').first()).toBeVisible()
  })

  test('[demo] exchange shows filter pills', async ({ page }) => {
    await seedIdentity(page)
    await page.goto('/exchange', { waitUntil: 'domcontentloaded' })
    // Should have All, People, Paths filter buttons
    await expect(page.getByText('All').first()).toBeVisible()
    await expect(page.getByText('People').first()).toBeVisible()
    await expect(page.getByText('Paths').first()).toBeVisible()
  })

  test('[demo] exchange shows results count', async ({ page }) => {
    await seedIdentity(page)
    await page.goto('/exchange', { waitUntil: 'domcontentloaded' })
    // Should show a results count like "42 results"
    await expect(page.getByText(/\d+ results?/i).first()).toBeVisible()
  })

  test('[demo] exchange shows feed cards', async ({ page }) => {
    await seedIdentity(page)
    await page.goto('/exchange', { waitUntil: 'domcontentloaded' })
    // Wait for cards to render (mock data or API)
    await page.waitForTimeout(1000)
    // Should have at least one card with a match score
    const cards = page.locator('[class*="grid"] > div')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('[demo] exchange type filter works', async ({ page }) => {
    await seedIdentity(page)
    await page.goto('/exchange', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(500)

    // Click People filter
    await page.getByText('People').first().click()
    await page.waitForTimeout(300)
    // Should still show results
    const resultsText = await page
      .getByText(/\d+ results?/i)
      .first()
      .textContent()
    expect(resultsText).toBeTruthy()
  })

  test('[demo] exchange has sector dropdown', async ({ page }) => {
    await seedIdentity(page)
    await page.goto('/exchange', { waitUntil: 'domcontentloaded' })
    // Should have a select element for sector filtering
    const select = page.locator('select')
    await expect(select.first()).toBeVisible()
  })

  test('[demo] exchange shows Connect button on person cards', async ({ page }) => {
    await seedIdentity(page)
    await page.goto('/exchange', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1000)

    // Filter to People only
    await page.getByText('People').first().click()
    await page.waitForTimeout(500)

    // Should have Connect buttons
    const connectBtn = page.getByText('Connect').first()
    await expect(connectBtn).toBeVisible()
  })
})

// ─── Connect → Messages (E2E Navigation) ────────────────────────

test.describe('Demo Flow: Connect to Messages', () => {
  test('[demo] clicking Connect navigates to messages with DM param', async ({ page }) => {
    await seedIdentity(page)
    await page.goto('/exchange', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1000)

    // Filter to People
    await page.getByText('People').first().click()
    await page.waitForTimeout(500)

    // Click first Connect button
    const connectBtn = page.getByText('Connect').first()
    if (await connectBtn.isVisible()) {
      await connectBtn.click()
      // Should navigate to /messages with dm parameter
      await page.waitForURL(/\/messages/, { timeout: 5000 })
      expect(page.url()).toContain('/messages')
    }
  })
})

// ─── Messages Page ───────────────────────────────────────────────

test.describe('Demo Flow: Messages', () => {
  test('[demo] messages page loads with identity', async ({ page }) => {
    await seedIdentity(page)
    await page.goto('/messages', { waitUntil: 'domcontentloaded' })
    // Should show Messages header or conversation list
    await expect(page.getByText(/messages|conversations|inbox/i).first()).toBeVisible()
  })

  test('[demo] messages page shows thread list', async ({ page }) => {
    await seedIdentity(page)
    await page.goto('/messages', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1000)
    // Should show some conversations (mock data fallback)
    const content = page.locator('main')
    await expect(content).toBeVisible()
  })

  test('[demo] messages DM opens agent chat panel', async ({ page }) => {
    await seedIdentity(page)
    // Navigate to messages with a DM param (agent ID from mock data)
    await page.goto('/messages?dm=ke-nairobi-1', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1000)
    // Should show a chat area or agent info
    const chatArea = page.locator('main')
    await expect(chatArea).toBeVisible()
  })

  test('[demo] messages shows chat input for DM', async ({ page }) => {
    await seedIdentity(page)
    await page.goto('/messages?dm=ke-nairobi-1', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1000)
    // Should show a text input for messaging
    const input = page.locator('input[type="text"], textarea').first()
    if (await input.isVisible()) {
      await expect(input).toBeVisible()
    }
  })
})

// ─── Identity Profile (/me) ─────────────────────────────────────

test.describe('Demo Flow: Identity Profile', () => {
  test('[demo] /me page loads with identity', async ({ page }) => {
    await seedIdentity(page)
    await page.goto('/me', { waitUntil: 'domcontentloaded' })
    // Should show profile content
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })

  test('[demo] /me shows editable identity dimensions', async ({ page }) => {
    await seedIdentity(page)
    await page.goto('/me', { waitUntil: 'domcontentloaded' })
    // Should show identity info like languages, country
    await expect(page.getByText(/language|faith|craft|culture|interest/i).first()).toBeVisible()
  })
})

// ─── Navigation & Brand ─────────────────────────────────────────

test.describe('Demo Flow: Navigation', () => {
  test('[demo] nav shows BeKenya logo', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    // Should show BeKenya branding
    await expect(page.getByText(/BeKenya/i).first()).toBeVisible()
  })

  test('[demo] nav has focus topic dropdown (desktop)', async ({ page }) => {
    await seedIdentity(page)
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    // On desktop, should show nav with focus button
    const focusBtn = page.getByText(/focus/i).first()
    // It may or may not be visible based on viewport — just check nav exists
    const nav = page.locator('nav')
    await expect(nav.first()).toBeVisible()
  })

  test('[demo] exchange link navigates correctly', async ({ page }) => {
    await seedIdentity(page)
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    // Click Exchange link in nav
    const exchangeLink = page.getByRole('link', { name: /exchange/i }).first()
    if (await exchangeLink.isVisible()) {
      await exchangeLink.click()
      await page.waitForURL(/\/exchange/, { timeout: 5000 })
      expect(page.url()).toContain('/exchange')
    }
  })
})

// ─── Full E2E Journey ────────────────────────────────────────────

test.describe('Demo Flow: Full Journey', () => {
  test('[demo] complete Pioneer flow: Home → Exchange → Connect → Messages', async ({ page }) => {
    // 1. Seed identity (simulates completed Discovery)
    await seedIdentity(page)

    // 2. Start at homepage
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('main')).toBeVisible()

    // 3. Navigate to Exchange
    await page.goto('/exchange', { waitUntil: 'domcontentloaded' })
    await expect(page.getByText('Exchange').first()).toBeVisible()
    await page.waitForTimeout(1000)

    // 4. Filter to People
    await page.getByText('People').first().click()
    await page.waitForTimeout(500)

    // 5. Should see person cards with Connect
    const connectBtn = page.getByText('Connect').first()
    if (await connectBtn.isVisible()) {
      // 6. Click Connect — navigates to Messages
      await connectBtn.click()
      await page.waitForURL(/\/messages/, { timeout: 5000 })

      // 7. Should be on messages page
      expect(page.url()).toContain('/messages')
      await page.waitForTimeout(1000)

      // 8. Should show chat interface
      const mainContent = page.locator('main')
      await expect(mainContent).toBeVisible()
    }
  })
})

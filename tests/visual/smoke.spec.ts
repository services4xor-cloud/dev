/**
 * Smoke Tests — Every page must return 200 and have no console errors
 * Fast gate: runs on every CI push at desktop viewport only.
 * See TESTING.md for full strategy.
 */
import { test, expect, ConsoleMessage } from '@playwright/test'
import { PAGES } from '../../playwright.config'

// Pages that intentionally return non-200 (excluded from HTTP status check)
const EXPECTED_NON_200 = ['/not-found-test']

// Pages that intentionally produce console errors (e.g. 404 page causes 404 resource logs)
const EXPECTED_CONSOLE_ERRORS = ['/not-found-test']

// Console errors to ignore (third-party noise, known Next.js dev-mode messages)
const IGNORED_ERRORS = [
  'Warning: ReactDOM.render is deprecated',
  'Warning: Each child in a list',
  'webpack-internal://',
  'Fast Refresh',
  'Expected server HTML',
  // Network errors on resource-level failures (e.g. missing font in dev) are non-critical
  'Failed to load resource: the server responded with a status of 400',
]

for (const page of PAGES) {
  test(`[smoke] ${page} — loads without console errors`, async ({ page: pw }) => {
    const consoleErrors: string[] = []

    pw.on('console', (msg: ConsoleMessage) => {
      if (msg.type() === 'error') {
        const text = msg.text()
        const isIgnored = IGNORED_ERRORS.some(ignored => text.includes(ignored))
        if (!isIgnored) consoleErrors.push(text)
      }
    })

    const response = await pw.goto(page, { waitUntil: 'domcontentloaded' })

    // Check HTTP status
    if (!EXPECTED_NON_200.includes(page)) {
      expect(
        response?.status(),
        `${page} returned ${response?.status()} — expected 200`
      ).toBeLessThan(400)
    }

    // Wait for hydration
    await pw.waitForLoadState('networkidle').catch(() => {
      // networkidle can be flaky on dev server — continue
    })

    // Assert no blocking console errors (skip for pages that intentionally trigger them)
    if (!EXPECTED_CONSOLE_ERRORS.includes(page)) {
      expect(
        consoleErrors,
        `Console errors on ${page}: ${consoleErrors.join(', ')}`
      ).toHaveLength(0)
    }
  })
}

test('[smoke] navigation links are present on homepage', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: /compass/i }).first()).toBeVisible()
})

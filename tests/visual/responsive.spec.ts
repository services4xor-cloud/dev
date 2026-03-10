/**
 * Responsive Screenshot Tests — Visual diff suite
 * NOT automated — run manually or weekly. Human reviews screenshots.
 * Captures key pages at 5 breakpoints: xs, sm, md, lg, 3xl.
 * See TESTING.md for review process.
 *
 * Usage:
 *   npx playwright test tests/visual/responsive --project=responsive
 *   npx playwright show-report
 */
import { test, expect } from '@playwright/test'
import { VIEWPORTS } from '../../playwright.config'
import path from 'path'
import fs from 'fs'

// Key pages for responsive review (subset — not all pages needed)
const RESPONSIVE_PAGES = [
  { route: '/', name: 'homepage' },
  { route: '/compass', name: 'compass' },
  { route: '/ventures', name: 'ventures' },
  { route: '/pioneers/dashboard', name: 'pioneer-dashboard' },
  { route: '/anchors/dashboard', name: 'anchor-dashboard' },
  { route: '/be/ke', name: 'gate-kenya' },
  { route: '/onboarding', name: 'onboarding' },
  { route: '/about', name: 'about' },
]

// Screenshot output directory
const SCREENSHOT_DIR = path.join(process.cwd(), 'tests', 'screenshots')

// Ensure screenshot dir exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
}

for (const { route, name } of RESPONSIVE_PAGES) {
  for (const [breakpoint, viewport] of Object.entries(VIEWPORTS)) {
    test(`[responsive] ${name} @ ${breakpoint} (${viewport.width}×${viewport.height})`, async ({ page }) => {
      await page.setViewportSize(viewport)
      await page.goto(route, { waitUntil: 'domcontentloaded' })

      // Let animations settle
      await page.waitForTimeout(600)

      // Take full-page screenshot
      const screenshotPath = path.join(
        SCREENSHOT_DIR,
        `${name}--${breakpoint}--${viewport.width}x${viewport.height}.png`
      )

      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
        animations: 'disabled',
      })

      // Basic sanity: page should have a heading
      const headings = await page.locator('h1, h2').count()
      expect(
        headings,
        `${route} at ${breakpoint} has no headings — page may have crashed`
      ).toBeGreaterThan(0)

      // No horizontal overflow (common responsive bug)
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth
      })
      expect(
        hasHorizontalScroll,
        `${route} at ${breakpoint} (${viewport.width}px) has horizontal scroll — layout is broken`
      ).toBe(false)
    })
  }
}

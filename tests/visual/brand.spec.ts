/**
 * Brand Validation Tests — Design system compliance gate
 * Runs on every CI push. Fails if orange/light-mode violations found.
 * See TESTING.md and DESIGN_SYSTEM.md for full rules.
 */
import { test, expect } from '@playwright/test'
import { PAGES } from '../../playwright.config'

// Banned color — should NEVER appear in any rendered page
const BANNED_HEX = '#FF6B35'
const BANNED_HEX_LOWER = '#ff6b35'

// Pages expected to still have light backgrounds (tech debt — track here)
const KNOWN_LIGHT_BG_PAGES = [
  '/login',
  '/signup',
  '/pricing',
  '/contact',
  '/profile',
  '/referral',
  '/business',
]

/**
 * Scans all text nodes and computed styles for a hex color string.
 * Returns matching element count.
 */
async function countColorInPage(pw: any, hex: string): Promise<number> {
  return pw.evaluate((targetHex: string) => {
    let count = 0
    const allElements = document.querySelectorAll('*')

    allElements.forEach((el: Element) => {
      const styles = window.getComputedStyle(el)
      const attrs = [
        styles.color,
        styles.backgroundColor,
        styles.borderColor,
        styles.outlineColor,
        el.getAttribute('style') || '',
        el.getAttribute('class') || '',
      ]
      if (attrs.some(a => a.toLowerCase().includes(targetHex.toLowerCase()))) {
        count++
      }
    })
    return count
  }, hex)
}

for (const page of PAGES) {
  test(`[brand] ${page} — no banned orange (#FF6B35)`, async ({ page: pw }) => {
    await pw.goto(page, { waitUntil: 'domcontentloaded' })
    await pw.waitForTimeout(500) // Let CSS settle

    // Check for banned orange in inline styles / class attributes
    const violations = await pw.evaluate((banned: string) => {
      const all = document.querySelectorAll('[style], [class]')
      const found: string[] = []
      all.forEach((el: Element) => {
        const style = el.getAttribute('style') || ''
        const cls = el.getAttribute('class') || ''
        if (style.includes(banned) || cls.includes('orange-')) {
          found.push(el.tagName + ' ' + (el.getAttribute('class') || '').slice(0, 60))
        }
      })
      return found.slice(0, 5) // Return first 5 violations only
    }, BANNED_HEX)

    expect(
      violations,
      `Found banned orange on ${page}: ${violations.join('\n')}`
    ).toHaveLength(0)
  })
}

for (const page of PAGES) {
  const isKnownLight = KNOWN_LIGHT_BG_PAGES.includes(page)

  test(`[brand] ${page} — ${isKnownLight ? '⚠️ KNOWN light bg (tech debt)' : 'dark background'}`, async ({ page: pw }) => {
    if (isKnownLight) {
      test.skip(true, `${page} is a known light-theme page — scheduled for conversion in Phase 2`)
    }

    await pw.goto(page, { waitUntil: 'domcontentloaded' })
    await pw.waitForTimeout(300)

    // Check body background is dark
    const bodyBg = await pw.evaluate(() => {
      const body = document.body
      return window.getComputedStyle(body).backgroundColor
    })

    // Dark pages should have dark backgrounds (rgb values should be low)
    // #0A0A0F → rgb(10, 10, 15), #111118 → rgb(17, 17, 24)
    const rgbMatch = bodyBg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch.map(Number)
      const brightness = (r + g + b) / 3
      expect(
        brightness,
        `${page} body background (${bodyBg}) is too bright (${brightness} > 50) — should be dark`
      ).toBeLessThan(50)
    }
  })
}

test('[brand] homepage has gold accent visible', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(300)

  // At least one gold-colored element should be visible
  const goldCount = await page.evaluate(() => {
    const els = document.querySelectorAll('[class*="C9A227"], [style*="C9A227"]')
    return els.length
  })

  expect(goldCount, 'No gold (#C9A227) elements found on homepage').toBeGreaterThan(0)
})

test('[brand] primary buttons use maroon gradient, not white/orange', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  // Check that btn-primary class renders dark (not white background)
  const btnBg = await page.evaluate(() => {
    const btn = document.querySelector('.btn-primary') as HTMLElement
    if (!btn) return null
    return window.getComputedStyle(btn).backgroundImage
  })

  if (btnBg) {
    expect(
      btnBg.toLowerCase().includes('ff6b35') || btnBg === 'none',
      `btn-primary should use maroon gradient, got: ${btnBg}`
    ).toBe(false)
  }
})

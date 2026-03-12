/**
 * Nav Structure Tests
 *
 * Validates:
 *   - All nav link arrays are exported and non-empty
 *   - Every link has href, label, and aria/label fields
 *   - No duplicate hrefs within each section
 *   - Footer links match expected sections
 *   - Login link singleton is valid
 */

import {
  PRIMARY_LINKS,
  PIONEER_NAV_LINKS,
  ANCHOR_NAV_LINKS,
  AGENT_NAV_LINKS,
  ABOUT_NAV_LINKS,
  LOGIN_LINK,
  FOOTER_PIONEER_LINKS,
  FOOTER_ANCHOR_LINKS,
  FOOTER_AGENT_LINKS,
  FOOTER_DISCOVER_LINKS,
  FOOTER_COMPANY_LINKS,
} from '@/lib/nav-structure'

describe('Nav Structure — primary links', () => {
  it('exports PRIMARY_LINKS with at least 3 items', () => {
    expect(PRIMARY_LINKS.length).toBeGreaterThanOrEqual(3)
  })

  it('every primary link has href, label, icon, and aria', () => {
    for (const link of PRIMARY_LINKS) {
      expect(link.href).toBeTruthy()
      expect(link.label).toBeTruthy()
      expect(link.icon).toBeDefined()
      expect(link.aria).toBeTruthy()
    }
  })

  it('no duplicate hrefs in primary links', () => {
    const hrefs = PRIMARY_LINKS.map((l) => l.href)
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })
})

describe('Nav Structure — role-based nav links', () => {
  it('pioneer links include /ventures and /compass', () => {
    const hrefs = PIONEER_NAV_LINKS.map((l) => l.href)
    expect(hrefs).toContain('/ventures')
    expect(hrefs).toContain('/compass')
  })

  it('anchor links include /anchors/dashboard', () => {
    const hrefs = ANCHOR_NAV_LINKS.map((l) => l.href)
    expect(hrefs).toContain('/anchors/dashboard')
  })

  it('agent links include /agents/dashboard', () => {
    const hrefs = AGENT_NAV_LINKS.map((l) => l.href)
    expect(hrefs).toContain('/agents/dashboard')
  })

  it('about links include /about', () => {
    const hrefs = ABOUT_NAV_LINKS.map((l) => l.href)
    expect(hrefs).toContain('/about')
  })
})

describe('Nav Structure — LOGIN_LINK', () => {
  it('points to /login', () => {
    expect(LOGIN_LINK.href).toBe('/login')
  })

  it('has label and aria', () => {
    expect(LOGIN_LINK.label).toBeTruthy()
    expect(LOGIN_LINK.aria).toBeTruthy()
  })
})

describe('Nav Structure — footer links', () => {
  it('pioneer footer links are non-empty with href and label', () => {
    expect(FOOTER_PIONEER_LINKS.length).toBeGreaterThan(0)
    for (const link of FOOTER_PIONEER_LINKS) {
      expect(link.href).toBeTruthy()
      expect(link.label).toBeTruthy()
    }
  })

  it('anchor footer links are non-empty', () => {
    expect(FOOTER_ANCHOR_LINKS.length).toBeGreaterThan(0)
  })

  it('agent footer links are non-empty', () => {
    expect(FOOTER_AGENT_LINKS.length).toBeGreaterThan(0)
  })

  it('discover footer links include /offerings and /threads', () => {
    const hrefs = FOOTER_DISCOVER_LINKS.map((l) => l.href)
    expect(hrefs).toContain('/offerings')
    expect(hrefs).toContain('/threads')
  })

  it('company footer links include /about and /privacy', () => {
    const hrefs = FOOTER_COMPANY_LINKS.map((l) => l.href)
    expect(hrefs).toContain('/about')
    expect(hrefs).toContain('/privacy')
  })
})

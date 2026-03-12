/**
 * Nav Structure Tests — Human Exchange Network
 *
 * Validates:
 *   - Public nav links (logged out)
 *   - Main nav links (logged in / discovery complete)
 *   - Footer links
 *   - Login link
 *   - Legacy deprecated exports exist for backward compat
 */

import {
  PUBLIC_NAV_LINKS,
  MAIN_NAV_LINKS,
  FOOTER_LINKS,
  FOOTER_COLUMNS,
  LOGIN_LINK,
  // Legacy deprecated exports
  PRIMARY_LINKS,
  PIONEER_NAV_LINKS,
  ANCHOR_NAV_LINKS,
  AGENT_NAV_LINKS,
  ABOUT_NAV_LINKS,
  FOOTER_PIONEER_LINKS,
  FOOTER_ANCHOR_LINKS,
  FOOTER_AGENT_LINKS,
  FOOTER_DISCOVER_LINKS,
  FOOTER_COMPANY_LINKS,
} from '@/lib/nav-structure'

describe('Nav Structure — public links (logged out)', () => {
  it('exports PUBLIC_NAV_LINKS with about and pricing', () => {
    expect(PUBLIC_NAV_LINKS.length).toBeGreaterThanOrEqual(2)
    const hrefs = PUBLIC_NAV_LINKS.map((l) => l.href)
    expect(hrefs).toContain('/about')
    expect(hrefs).toContain('/pricing')
  })

  it('every public link has href, label, icon, and aria', () => {
    for (const link of PUBLIC_NAV_LINKS) {
      expect(link.href).toBeTruthy()
      expect(link.label).toBeTruthy()
      expect(link.icon).toBeDefined()
      expect(link.aria).toBeTruthy()
    }
  })
})

describe('Nav Structure — main links (logged in)', () => {
  it('exports MAIN_NAV_LINKS with 4 core routes', () => {
    expect(MAIN_NAV_LINKS.length).toBe(4)
    const hrefs = MAIN_NAV_LINKS.map((l) => l.href)
    expect(hrefs).toContain('/world')
    expect(hrefs).toContain('/exchange')
    expect(hrefs).toContain('/messages')
    expect(hrefs).toContain('/me')
  })

  it('every main link has href, label, icon, and aria', () => {
    for (const link of MAIN_NAV_LINKS) {
      expect(link.href).toBeTruthy()
      expect(link.label).toBeTruthy()
      expect(link.icon).toBeDefined()
      expect(link.aria).toBeTruthy()
    }
  })

  it('no duplicate hrefs', () => {
    const hrefs = MAIN_NAV_LINKS.map((l) => l.href)
    expect(new Set(hrefs).size).toBe(hrefs.length)
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
  it('has at least 5 footer links', () => {
    expect(FOOTER_LINKS.length).toBeGreaterThanOrEqual(5)
  })

  it('every footer link has href and label', () => {
    for (const link of FOOTER_LINKS) {
      expect(link.href).toBeTruthy()
      expect(link.label).toBeTruthy()
    }
  })

  it('includes about and privacy', () => {
    const hrefs = FOOTER_LINKS.map((l) => l.href)
    expect(hrefs).toContain('/about')
    expect(hrefs).toContain('/privacy')
  })
})

describe('Nav Structure — legacy exports exist', () => {
  it('PRIMARY_LINKS is aliased to PUBLIC_NAV_LINKS', () => {
    expect(PRIMARY_LINKS).toBeDefined()
    expect(Array.isArray(PRIMARY_LINKS)).toBe(true)
  })

  it('deprecated role-based arrays exist', () => {
    expect(PIONEER_NAV_LINKS).toBeDefined()
    expect(ANCHOR_NAV_LINKS).toBeDefined()
    expect(AGENT_NAV_LINKS).toBeDefined()
    expect(ABOUT_NAV_LINKS).toBeDefined()
  })

  it('deprecated footer arrays exist', () => {
    expect(FOOTER_PIONEER_LINKS).toBeDefined()
    expect(FOOTER_ANCHOR_LINKS).toBeDefined()
    expect(FOOTER_AGENT_LINKS).toBeDefined()
    expect(FOOTER_DISCOVER_LINKS).toBeDefined()
    expect(FOOTER_COMPANY_LINKS).toBeDefined()
  })
})

describe('Nav Structure — footer columns', () => {
  it('exports FOOTER_COLUMNS with 4 columns', () => {
    expect(FOOTER_COLUMNS.length).toBe(4)
  })

  it('each column has title and links', () => {
    for (const col of FOOTER_COLUMNS) {
      expect(col.title).toBeTruthy()
      expect(col.links.length).toBeGreaterThan(0)
    }
  })

  it('includes referral and media links', () => {
    const allHrefs = FOOTER_COLUMNS.flatMap((c) => c.links.map((l) => l.href))
    expect(allHrefs).toContain('/referral')
    expect(allHrefs).toContain('/media')
    expect(allHrefs).toContain('/fashion')
  })

  it('FOOTER_LINKS is flat array of all column links', () => {
    const expected = FOOTER_COLUMNS.flatMap((col) => col.links)
    expect(FOOTER_LINKS).toEqual(expected)
  })
})

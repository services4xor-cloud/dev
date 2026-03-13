/**
 * Unit tests for lib/semantic-skills.ts — Cross-language skill equivalence engine
 *
 * Tests resolveSkillId, areSkillsEquivalent, getSkillLabel, getSkillsByCategory,
 * getRelatedSkills, searchSkills, and getAllLabelsForLang.
 */

import {
  resolveSkillId,
  areSkillsEquivalent,
  getSkillLabel,
  getSkillsByCategory,
  getRelatedSkills,
  searchSkills,
  getAllLabelsForLang,
  SKILL_REGISTRY,
} from '@/lib/semantic-skills'

// ── resolveSkillId ───────────────────────────────────────────────────

describe('resolveSkillId', () => {
  it('resolves an English label to canonical ID', () => {
    expect(resolveSkillId('Software Engineering')).toBe('software-engineering')
  })

  it('resolves a German label to canonical ID', () => {
    expect(resolveSkillId('Softwareentwicklung')).toBe('software-engineering')
  })

  it('resolves an alias to canonical ID', () => {
    expect(resolveSkillId('Software Development')).toBe('software-engineering')
  })

  it('resolves an informal alias to canonical ID', () => {
    expect(resolveSkillId('coding')).toBe('software-engineering')
  })

  it('resolves a French label to canonical ID', () => {
    expect(resolveSkillId('Ingénierie logicielle')).toBe('software-engineering')
  })

  it('is case-insensitive', () => {
    expect(resolveSkillId('SOFTWARE ENGINEERING')).toBe('software-engineering')
    expect(resolveSkillId('softwareentwicklung')).toBe('software-engineering')
  })

  it('trims whitespace', () => {
    expect(resolveSkillId('  coding  ')).toBe('software-engineering')
  })

  it('returns null for unknown strings', () => {
    expect(resolveSkillId('completely unknown skill xyz')).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(resolveSkillId('')).toBeNull()
  })
})

// ── areSkillsEquivalent ──────────────────────────────────────────────

describe('areSkillsEquivalent', () => {
  it('matches German and English labels for the same skill', () => {
    expect(areSkillsEquivalent('Softwareentwicklung', 'Software Engineering')).toBe(true)
  })

  it('matches an alias with a label', () => {
    expect(areSkillsEquivalent('coding', 'Software Engineering')).toBe(true)
  })

  it('matches French alias with German label', () => {
    expect(areSkillsEquivalent('développement logiciel', 'Softwareentwicklung')).toBe(true)
  })

  it('returns false for different skills', () => {
    expect(areSkillsEquivalent('Softwareentwicklung', 'Plumbing')).toBe(false)
  })

  it('returns false when one input is unknown', () => {
    expect(areSkillsEquivalent('coding', 'some unknown skill')).toBe(false)
  })

  it('returns false when both inputs are unknown', () => {
    expect(areSkillsEquivalent('aaa', 'bbb')).toBe(false)
  })
})

// ── getSkillLabel ────────────────────────────────────────────────────

describe('getSkillLabel', () => {
  it('returns the German label for a skill', () => {
    expect(getSkillLabel('software-engineering', 'de')).toBe('Softwareentwicklung')
  })

  it('returns the English label for a skill', () => {
    expect(getSkillLabel('software-engineering', 'en')).toBe('Software Engineering')
  })

  it('returns the French label for a skill', () => {
    expect(getSkillLabel('software-engineering', 'fr')).toBe('Ingénierie logicielle')
  })

  it('returns the Swahili label for a skill', () => {
    expect(getSkillLabel('software-engineering', 'sw')).toBe('Uhandisi wa Programu')
  })

  it('falls back to English for unsupported language', () => {
    expect(getSkillLabel('software-engineering', 'xx')).toBe('Software Engineering')
  })

  it('returns empty string for unknown skill ID', () => {
    expect(getSkillLabel('nonexistent-skill', 'en')).toBe('')
  })
})

// ── getSkillsByCategory ──────────────────────────────────────────────

describe('getSkillsByCategory', () => {
  it('returns tech skills', () => {
    const techSkills = getSkillsByCategory('tech')
    expect(techSkills.length).toBeGreaterThan(0)
    techSkills.forEach((s) => expect(s.category).toBe('tech'))
  })

  it('returns creative skills', () => {
    const creativeSkills = getSkillsByCategory('creative')
    expect(creativeSkills.length).toBeGreaterThan(0)
    creativeSkills.forEach((s) => expect(s.category).toBe('creative'))
  })

  it('includes software-engineering in tech', () => {
    const techSkills = getSkillsByCategory('tech')
    expect(techSkills.some((s) => s.id === 'software-engineering')).toBe(true)
  })

  it('returns empty array for unknown category', () => {
    expect(getSkillsByCategory('nonexistent')).toEqual([])
  })
})

// ── getRelatedSkills ─────────────────────────────────────────────────

describe('getRelatedSkills', () => {
  it('returns related skills for software-engineering', () => {
    const related = getRelatedSkills('software-engineering')
    expect(related.length).toBeGreaterThan(0)
    const relatedIds = related.map((s) => s.id)
    expect(relatedIds).toContain('frontend-development')
    expect(relatedIds).toContain('backend-development')
  })

  it('returns only valid SkillCanonical objects', () => {
    const related = getRelatedSkills('software-engineering')
    related.forEach((s) => {
      expect(s.id).toBeDefined()
      expect(s.category).toBeDefined()
      expect(s.labels).toBeDefined()
    })
  })

  it('returns empty array for unknown skill ID', () => {
    expect(getRelatedSkills('nonexistent-skill')).toEqual([])
  })
})

// ── searchSkills ─────────────────────────────────────────────────────

describe('searchSkills', () => {
  it('finds skills by partial English match', () => {
    const results = searchSkills('software')
    expect(results.length).toBeGreaterThan(0)
    expect(results.some((s) => s.id === 'software-engineering')).toBe(true)
  })

  it('finds skills by partial German match', () => {
    const results = searchSkills('Entwickl')
    expect(results.length).toBeGreaterThan(0)
    expect(results.some((s) => s.id === 'software-engineering')).toBe(true)
  })

  it('returns exact matches before partial matches', () => {
    const results = searchSkills('Data Science')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].id).toBe('data-science')
  })

  it('prioritizes given language in results', () => {
    const results = searchSkills('Entwickl', 'de')
    expect(results.length).toBeGreaterThan(0)
  })

  it('is case-insensitive', () => {
    const results = searchSkills('SOFTWARE')
    expect(results.some((s) => s.id === 'software-engineering')).toBe(true)
  })

  it('returns empty array for empty query', () => {
    expect(searchSkills('')).toEqual([])
  })

  it('returns empty array for whitespace-only query', () => {
    expect(searchSkills('   ')).toEqual([])
  })

  it('returns empty array for unmatched query', () => {
    expect(searchSkills('zzzzxqwfoobar')).toEqual([])
  })
})

// ── getAllLabelsForLang ───────────────────────────────────────────────

describe('getAllLabelsForLang', () => {
  it('returns labels for all skills in the registry', () => {
    const labels = getAllLabelsForLang('en')
    expect(labels.length).toBe(SKILL_REGISTRY.length)
  })

  it('returns German labels when available', () => {
    const labels = getAllLabelsForLang('de')
    const se = labels.find((l) => l.id === 'software-engineering')
    expect(se).toBeDefined()
    expect(se!.label).toBe('Softwareentwicklung')
  })

  it('falls back to English for languages without translation', () => {
    const labels = getAllLabelsForLang('xx')
    const se = labels.find((l) => l.id === 'software-engineering')
    expect(se).toBeDefined()
    expect(se!.label).toBe('Software Engineering')
  })

  it('returns results sorted alphabetically', () => {
    const labels = getAllLabelsForLang('en')
    for (let i = 1; i < labels.length; i++) {
      expect(labels[i - 1].label.localeCompare(labels[i].label, 'en')).toBeLessThanOrEqual(0)
    }
  })

  it('each entry has id and label', () => {
    const labels = getAllLabelsForLang('en')
    labels.forEach((entry) => {
      expect(entry.id).toBeDefined()
      expect(typeof entry.id).toBe('string')
      expect(entry.label).toBeDefined()
      expect(typeof entry.label).toBe('string')
    })
  })
})

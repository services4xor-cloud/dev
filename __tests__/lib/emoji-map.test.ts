/**
 * emoji-map.test.ts — Tests for sector → emoji mapping
 */

import { getSectorEmoji } from '@/lib/emoji-map'

describe('getSectorEmoji', () => {
  it('returns 🦁 for Safari & Wildlife', () => {
    expect(getSectorEmoji('Safari & Wildlife')).toBe('🦁')
  })

  it('returns 💻 for Technology', () => {
    expect(getSectorEmoji('Technology')).toBe('💻')
  })

  it('returns 👗 for Fashion & Design', () => {
    expect(getSectorEmoji('Fashion & Design')).toBe('👗')
  })

  it('returns 🏥 for Healthcare', () => {
    expect(getSectorEmoji('Healthcare')).toBe('🏥')
  })

  it('returns 💰 for Finance & Banking', () => {
    expect(getSectorEmoji('Finance & Banking')).toBe('💰')
  })

  it('returns 📚 for Education', () => {
    expect(getSectorEmoji('Education')).toBe('📚')
  })

  it('returns 🍽️ for Hospitality', () => {
    expect(getSectorEmoji('Hospitality')).toBe('🍽️')
  })

  it('returns 🎬 for Media & Content', () => {
    expect(getSectorEmoji('Media & Content')).toBe('🎬')
  })

  it('returns 🌾 for Agriculture', () => {
    expect(getSectorEmoji('Agriculture')).toBe('🌾')
  })

  it('is case-insensitive', () => {
    expect(getSectorEmoji('TECHNOLOGY')).toBe('💻')
    expect(getSectorEmoji('safari')).toBe('🦁')
  })

  it('handles compound names (e.g. "Software Engineering")', () => {
    expect(getSectorEmoji('Software Development')).toBe('💻')
  })

  it('returns 💼 fallback for unknown sectors', () => {
    expect(getSectorEmoji('Unknown Sector')).toBe('💼')
    expect(getSectorEmoji('')).toBe('💼')
  })

  it('handles German sector names (e.g. Pflege)', () => {
    expect(getSectorEmoji('Pflege & Gesundheit')).toBe('🏥')
    expect(getSectorEmoji('Gastro & Hotel')).toBe('🍽️')
  })

  it('handles Nigerian sector names (Nollywood)', () => {
    expect(getSectorEmoji('Nollywood & Entertainment')).toBe('🎬')
  })
})

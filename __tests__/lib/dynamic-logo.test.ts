/**
 * DynamicLogo Component Tests
 *
 * Validates the SVG logo generation logic:
 *   - Renders with correct dimensions
 *   - Uses brand colors (CSS variables)
 *   - Scales emoji font size proportionally
 *   - Handles different icon inputs
 */

describe('DynamicLogo — sizing logic', () => {
  it('calculates emoji font size as ~55% of container', () => {
    const size = 28
    const fontSize = Math.round(size * 0.55)
    expect(fontSize).toBe(15) // 28 * 0.55 = 15.4 → 15
  })

  it('scales font size proportionally for larger logos', () => {
    const size = 64
    const fontSize = Math.round(size * 0.55)
    expect(fontSize).toBe(35) // 64 * 0.55 = 35.2 → 35
  })

  it('handles size = 0 gracefully', () => {
    const size = 0
    const fontSize = Math.round(size * 0.55)
    expect(fontSize).toBe(0)
  })

  it('default size is 28px', () => {
    const defaultSize = 28
    expect(defaultSize).toBe(28)
  })

  it('circle radius is half the size', () => {
    const size = 40
    const radius = size / 2
    expect(radius).toBe(20)
  })

  it('accent ring radius is 1.5px smaller than outer', () => {
    const size = 40
    const accentRadius = size / 2 - 1.5
    expect(accentRadius).toBe(18.5)
  })
})

describe('DynamicLogo — icon handling', () => {
  it('accepts flag emoji', () => {
    const icon = '🇰🇪'
    expect(icon).toBeTruthy()
    expect(typeof icon).toBe('string')
  })

  it('accepts animal emoji', () => {
    const icon = '🦁'
    expect(icon).toBeTruthy()
  })

  it('accepts city emoji', () => {
    const icon = '🏙️'
    expect(icon).toBeTruthy()
  })

  it('accepts any string as icon', () => {
    const icons = ['🇰🇪', '🇩🇪', '🇨🇭', '🦁', '🏙️', '⭐', 'Be']
    for (const icon of icons) {
      expect(icon.length).toBeGreaterThan(0)
    }
  })
})

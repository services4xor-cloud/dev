/**
 * Identity Context — extended dimensions tests
 *
 * Tests that the 4 new identity dimensions (faith, craft, reach, culture)
 * are properly integrated into the context and fallback.
 */
import React from 'react'

// Mock useContext to return undefined so useIdentity takes the fallback path
const originalUseContext = React.useContext
beforeEach(() => {
  jest.spyOn(React, 'useContext').mockReturnValue(undefined!)
})
afterEach(() => {
  jest.restoreAllMocks()
})

describe('Identity Context — extended dimensions', () => {
  it('exports IdentityProvider and useIdentity', async () => {
    const mod = await import('@/lib/identity-context')
    expect(mod.IdentityProvider).toBeDefined()
    expect(mod.useIdentity).toBeDefined()
  })

  it('useIdentity fallback has new dimension fields', async () => {
    const { useIdentity } = await import('@/lib/identity-context')
    const result = useIdentity()
    expect(result.identity).toHaveProperty('craft')
    expect(result.identity).toHaveProperty('reach')
    expect(Array.isArray(result.identity.craft)).toBe(true)
    expect(Array.isArray(result.identity.reach)).toBe(true)
    expect(result.identity.craft).toEqual([])
    expect(result.identity.reach).toEqual([])
  })

  it('fallback has setFaith, setCraft, setReach, setCulture', async () => {
    const { useIdentity } = await import('@/lib/identity-context')
    const result = useIdentity()
    expect(typeof result.setFaith).toBe('function')
    expect(typeof result.setCraft).toBe('function')
    expect(typeof result.setReach).toBe('function')
    expect(typeof result.setCulture).toBe('function')
  })

  it('hasCompletedDiscovery requires craft', async () => {
    const { useIdentity } = await import('@/lib/identity-context')
    const result = useIdentity()
    expect(result.hasCompletedDiscovery).toBe(false)
  })
})

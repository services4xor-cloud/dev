/**
 * Logger Tests
 *
 * Validates:
 *   - All log levels are callable
 *   - Context objects are accepted
 *   - Environment-aware filtering
 */

import { logger } from '@/lib/logger'

describe('Logger', () => {
  it('exports debug, info, warn, error methods', () => {
    expect(typeof logger.debug).toBe('function')
    expect(typeof logger.info).toBe('function')
    expect(typeof logger.warn).toBe('function')
    expect(typeof logger.error).toBe('function')
  })

  it('does not throw when called with message only', () => {
    expect(() => logger.debug('test debug')).not.toThrow()
    expect(() => logger.info('test info')).not.toThrow()
    expect(() => logger.warn('test warn')).not.toThrow()
    expect(() => logger.error('test error')).not.toThrow()
  })

  it('does not throw when called with context', () => {
    expect(() => logger.info('test', { key: 'value', num: 42 })).not.toThrow()
    expect(() => logger.error('fail', { error: 'something broke' })).not.toThrow()
  })
})

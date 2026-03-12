/* eslint-disable no-console */
/**
 * Structured Logger — environment-aware logging
 *
 * In production: only errors and warnings are logged
 * In development: all log levels are active
 *
 * Usage:
 *   import { logger } from '@/lib/logger'
 *   logger.info('Path created', { pathId: '123' })
 *   logger.error('Payment failed', { error: err.message })
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const isDev = process.env.NODE_ENV !== 'production'
const minLevel: LogLevel = isDev ? 'debug' : 'warn'

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[minLevel]
}

function formatMessage(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>
): string {
  const prefix = `[BeNetwork:${level.toUpperCase()}]`
  const contextStr = context ? ` ${JSON.stringify(context)}` : ''
  return `${prefix} ${message}${contextStr}`
}

export const logger = {
  debug(message: string, context?: Record<string, unknown>) {
    if (shouldLog('debug')) console.log(formatMessage('debug', message, context))
  },

  info(message: string, context?: Record<string, unknown>) {
    if (shouldLog('info')) console.log(formatMessage('info', message, context))
  },

  warn(message: string, context?: Record<string, unknown>) {
    if (shouldLog('warn')) console.warn(formatMessage('warn', message, context))
  },

  error(message: string, context?: Record<string, unknown>) {
    if (shouldLog('error')) console.error(formatMessage('error', message, context))
  },
}

/**
 * Database availability check
 *
 * Simple flag indicating whether a DATABASE_URL is configured.
 * Service modules use this to decide between Prisma and mock data.
 */

export const hasDatabase = !!process.env.DATABASE_URL

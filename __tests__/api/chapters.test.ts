/**
 * Unit tests for Chapters API validation
 */
import { z } from 'zod'

const openChapterSchema = z.object({
  pathId: z.string().min(1),
  coverLetter: z.string().max(2000).optional(),
})

describe('Chapter opening schema', () => {
  it('accepts valid chapter with pathId only', () => {
    const result = openChapterSchema.safeParse({ pathId: 'path_123' })
    expect(result.success).toBe(true)
  })

  it('accepts chapter with pathId and coverLetter', () => {
    const result = openChapterSchema.safeParse({
      pathId: 'path_456',
      coverLetter: 'I am passionate about this opportunity and bring 5 years of experience.',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing pathId', () => {
    const result = openChapterSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('rejects empty pathId', () => {
    const result = openChapterSchema.safeParse({ pathId: '' })
    expect(result.success).toBe(false)
  })

  it('rejects coverLetter exceeding 2000 characters', () => {
    const result = openChapterSchema.safeParse({
      pathId: 'path_123',
      coverLetter: 'X'.repeat(2001),
    })
    expect(result.success).toBe(false)
  })

  it('accepts coverLetter at exactly 2000 characters', () => {
    const result = openChapterSchema.safeParse({
      pathId: 'path_123',
      coverLetter: 'X'.repeat(2000),
    })
    expect(result.success).toBe(true)
  })

  it('accepts chapter without coverLetter (optional)', () => {
    const result = openChapterSchema.safeParse({ pathId: 'path_789' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.coverLetter).toBeUndefined()
    }
  })
})

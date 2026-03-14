/**
 * Service interfaces for Be[X] platform.
 * Each service wraps a domain concern and can be implemented
 * with Prisma (real) or mock data (testing).
 */

export interface UserService {
  findById(
    id: string
  ): Promise<{ id: string; name: string | null; email: string; role: string } | null>
  findByEmail(
    email: string
  ): Promise<{ id: string; name: string | null; email: string; role: string } | null>
  updateRole(id: string, role: string): Promise<void>
}

export interface NodeService {
  findByTypeAndCode(
    type: string,
    code: string
  ): Promise<{ id: string; type: string; code: string; label: string; icon?: string | null } | null>
  findByUserId(
    userId: string
  ): Promise<{ id: string; type: string; code: string; label: string } | null>
  listByType(
    type: string,
    options?: { active?: boolean; limit?: number }
  ): Promise<{ id: string; type: string; code: string; label: string; icon?: string | null }[]>
}

export interface PaymentService {
  listByUserId(
    userId: string,
    options?: { limit?: number }
  ): Promise<{ id: string; amount: number; currency: string; status: string; createdAt: Date }[]>
  sumSuccessful(userId: string): Promise<number>
}

export interface ThreadService {
  list(options?: {
    nodeType?: string
    limit?: number
  }): Promise<{ id: string; title: string; nodeId: string; description?: string | null }[]>
  findById(
    id: string
  ): Promise<{
    id: string
    title: string
    description?: string | null
    node: { label: string; icon?: string | null }
  } | null>
}

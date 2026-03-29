import { db } from '@/lib/db'

interface UserService {
  findById(
    id: string
  ): Promise<{ id: string; name: string | null; email: string; role: string } | null>
  findByEmail(
    email: string
  ): Promise<{ id: string; name: string | null; email: string; role: string } | null>
  updateRole(id: string, role: string): Promise<void>
}

interface NodeService {
  findByTypeAndCode(
    type: string,
    code: string
  ): Promise<{ id: string; type: string; code: string; label: string; icon: string | null } | null>
  findByUserId(
    userId: string
  ): Promise<{ id: string; type: string; code: string; label: string } | null>
  listByType(
    type: string,
    options?: { limit?: number; active?: boolean }
  ): Promise<{ id: string; type: string; code: string; label: string; icon: string | null }[]>
}

interface PaymentService {
  listByUserId(
    userId: string,
    options?: { limit?: number }
  ): Promise<{ id: string; amount: number; currency: string; status: string; createdAt: Date }[]>
  sumSuccessful(userId: string): Promise<number>
}

export const userService: UserService = {
  async findById(id) {
    const user = await db.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true },
    })
    return user ? { ...user, role: user.role as string } : null
  },
  async findByEmail(email) {
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, role: true },
    })
    return user ? { ...user, role: user.role as string } : null
  },
  async updateRole(id, role) {
    await db.user.update({ where: { id }, data: { role: role as any } })
  },
}

export const nodeService: NodeService = {
  async findByTypeAndCode(type, code) {
    return db.node.findUnique({
      where: { type_code: { type: type as any, code } },
      select: { id: true, type: true, code: true, label: true, icon: true },
    }) as any
  },
  async findByUserId(userId) {
    return db.node.findUnique({
      where: { userId },
      select: { id: true, type: true, code: true, label: true },
    }) as any
  },
  async listByType(type, options) {
    return db.node.findMany({
      where: {
        type: type as any,
        ...(options?.active !== undefined ? { active: options.active } : {}),
      },
      select: { id: true, type: true, code: true, label: true, icon: true },
      take: options?.limit,
      orderBy: { label: 'asc' },
    }) as any
  },
}

export const paymentService: PaymentService = {
  async listByUserId(userId, options) {
    return db.payment.findMany({
      where: { userId },
      select: { id: true, amount: true, currency: true, status: true, createdAt: true },
      take: options?.limit,
      orderBy: { createdAt: 'desc' },
    }) as any
  },
  async sumSuccessful(userId) {
    const result = await db.payment.aggregate({
      where: { userId, status: 'SUCCESS' },
      _sum: { amount: true },
    })
    return result._sum.amount ?? 0
  },
}

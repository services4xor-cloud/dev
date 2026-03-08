import { NextRequest, NextResponse } from 'next/server'

// GET /api/jobs/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  if (!id) {
    return NextResponse.json({ success: false, error: 'Job ID required' }, { status: 400 })
  }

  try {
    // TODO: Prisma query
    // const job = await prisma.job.findUnique({ where: { id }, include: { user: { select: { name: true, avatarUrl: true } } } })
    // if (!job) return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 })

    // Mock — replace when DB is connected
    return NextResponse.json({
      success: false,
      error: 'Database not connected yet — see HUMAN_MANUAL.md step 4',
    }, { status: 503 })
  } catch (err) {
    console.error(`GET /api/jobs/${id} error:`, err)
    return NextResponse.json({ success: false, error: 'Failed to fetch job' }, { status: 500 })
  }
}

// PATCH /api/jobs/:id — update job (owner only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  try {
    const body = await req.json()

    // TODO: auth + ownership check
    // TODO: prisma.job.update

    return NextResponse.json({ success: true, data: { id, ...body, updatedAt: new Date().toISOString() } })
  } catch (err) {
    console.error(`PATCH /api/jobs/${id} error:`, err)
    return NextResponse.json({ success: false, error: 'Failed to update job' }, { status: 500 })
  }
}

// DELETE /api/jobs/:id — soft delete
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  try {
    // TODO: auth + ownership check
    // await prisma.job.update({ where: { id }, data: { status: 'EXPIRED' } })

    return NextResponse.json({ success: true, message: 'Job removed' })
  } catch (err) {
    console.error(`DELETE /api/jobs/${id} error:`, err)
    return NextResponse.json({ success: false, error: 'Failed to delete job' }, { status: 500 })
  }
}

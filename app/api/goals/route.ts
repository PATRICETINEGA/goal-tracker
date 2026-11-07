import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { title, progress, deadline } = body
  if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 })

  const goal = await prisma.goal.create({
    data: { title, progress: parseInt(progress) || 0, deadline, ownerId: (session.user as any).id },
  })
  return NextResponse.json(goal)
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const goal = await prisma.goal.findUnique({ where: { id } })
  if (!goal || goal.ownerId !== (session.user as any).id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.goal.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

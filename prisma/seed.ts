import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('demo123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'demo@goals.app' },
    update: {},
    create: { email: 'demo@goals.app', password },
  })

  await prisma.goal.upsert({
    where: { id: 'seed-goal' },
    update: {},
    create: { id: 'seed-goal', title: 'Learn TypeScript', progress: 40, deadline: '2026-12-31', ownerId: user.id },
  })

  console.log('Seed done')
}

main().finally(() => prisma.$disconnect())

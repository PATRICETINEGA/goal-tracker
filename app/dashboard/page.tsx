import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AddGoal from '@/components/AddGoal'
import DeleteGoalButton from '@/components/DeleteGoalButton'
export default async function Dash() {
  const s = await getSession()
  if (!s) redirect('/login')
  const uid = (s.user as any).id
  const goals = await prisma.goal.findMany({ where: { ownerId: uid }, orderBy: { createdAt: 'desc' } })
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Goals</h1>
        <Link href="/api/auth/signout" className="text-sm text-red-600">Sign out</Link>
      </div>
      <AddGoal />
      <div className="space-y-2">
        {goals.map((g: any) => (
          <div key={g.id} className="bg-white p-3 rounded shadow flex justify-between items-start text-sm">
            <div>
              <div className="flex justify-between"><span className="font-medium">{g.title}</span><span className="ml-2">{g.progress}%</span></div>
              {g.deadline && <p className="text-xs text-gray-400 mt-1">Due: {g.deadline}</p>}
            </div>
            <DeleteGoalButton id={g.id} />
          </div>
        ))}
        {goals.length === 0 && <p className="text-gray-500">No goals yet</p>}
      </div>
    </div>
  )
}

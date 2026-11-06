'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export default function AddGoal() {
  const [title, setTitle] = useState('')
  const [progress, setProgress] = useState('0')
  const [deadline, setDeadline] = useState('')
  const [loading, setLoading] = useState(false)
  const r = useRouter()
  async function submit(e: any) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/goals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, progress, deadline }) })
    setTitle(''); setProgress('0'); setDeadline(''); setLoading(false); r.refresh()
  }
  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow mb-4 space-y-2">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Goal title" className="w-full border p-2 rounded text-sm" required />
      <input value={progress} onChange={e=>setProgress(e.target.value)} placeholder="Progress %" type="number" min="0" max="100" className="w-full border p-2 rounded text-sm" />
      <input value={deadline} onChange={e=>setDeadline(e.target.value)} type="date" className="w-full border p-2 rounded text-sm" />
      <button type="submit" disabled={loading} className="bg-emerald-600 text-white px-4 py-1 rounded text-sm disabled:opacity-50">Add</button>
    </form>
  )
}

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import CopyButton from './CopyButton'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('username, updated_at')
    .eq('user_id', user.id)
    .single()

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        <form action="/api/logout" method="POST">
          <button type="submit" className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>
            Sign out
          </button>
        </form>
      </div>

      {portfolio ? (
        <div className="bento-tile p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-white font-medium">Your portfolio</h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                /{portfolio.username}
              </p>
            </div>
            <Link
              href={`/${portfolio.username}`}
              target="_blank"
              className="text-xs px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
              style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            >
              View live
            </Link>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard/edit"
              className="px-4 py-2 rounded-xl text-sm font-medium text-white hover:opacity-80 transition-opacity"
              style={{ background: 'var(--accent)' }}
            >
              Edit portfolio
            </Link>
            <CopyButton username={portfolio.username} />
          </div>
          {portfolio.updated_at && (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Last saved {new Date(portfolio.updated_at).toLocaleDateString()}
            </p>
          )}
        </div>
      ) : (
        <div className="bento-tile p-6 text-center flex flex-col gap-3">
          <p style={{ color: 'var(--text-muted)' }}>No portfolio yet.</p>
          <Link href="/dashboard/edit" className="text-sm text-white hover:underline">
            Create one
          </Link>
        </div>
      )}
    </main>
  )
}

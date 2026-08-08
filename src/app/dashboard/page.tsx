import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import CopyButton from './CopyButton'
import UsernameForm from './UsernameForm'

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

function DayBar({ count, max, label }: { count: number; max: number; label: string }) {
  const pct = max === 0 ? 0 : Math.round((count / max) * 100)
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <span className="text-xs font-medium text-white">{count > 0 ? count : ''}</span>
      <div className="w-full flex flex-col justify-end" style={{ height: 48 }}>
        <div
          className="w-full rounded-sm transition-all"
          style={{
            height: `${Math.max(pct, count > 0 ? 4 : 0)}%`,
            background: pct > 0 ? 'var(--accent)' : 'var(--surface-2)',
            minHeight: count > 0 ? 3 : 0,
          }}
        />
      </div>
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
    </div>
  )
}

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('id, username, updated_at, display_name, views')
    .eq('user_id', user.id)
    .single()

  const displayName = portfolio?.display_name || user.email?.split('@')[0] || 'there'

  let viewsToday = 0
  let viewsWeek = 0
  let viewsMonth = 0
  let dailyBreakdown: { day: string; short: string; count: number }[] = []

  if (portfolio?.id) {
    const now = new Date()
    const startOfToday = new Date(now); startOfToday.setHours(0,0,0,0)
    const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - 6); startOfWeek.setHours(0,0,0,0)
    const startOfMonth = new Date(now); startOfMonth.setDate(1); startOfMonth.setHours(0,0,0,0)

    const [todayRes, weekRes, monthRes, logRes] = await Promise.all([
      supabase
        .from('portfolio_views_log')
        .select('id', { count: 'exact', head: true })
        .eq('portfolio_id', portfolio.id)
        .gte('viewed_at', startOfToday.toISOString()),
      supabase
        .from('portfolio_views_log')
        .select('id', { count: 'exact', head: true })
        .eq('portfolio_id', portfolio.id)
        .gte('viewed_at', startOfWeek.toISOString()),
      supabase
        .from('portfolio_views_log')
        .select('id', { count: 'exact', head: true })
        .eq('portfolio_id', portfolio.id)
        .gte('viewed_at', startOfMonth.toISOString()),
      supabase
        .from('portfolio_views_log')
        .select('viewed_at')
        .eq('portfolio_id', portfolio.id)
        .gte('viewed_at', startOfWeek.toISOString()),
    ])

    viewsToday = todayRes.count ?? 0
    viewsWeek = weekRes.count ?? 0
    viewsMonth = monthRes.count ?? 0

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now)
      d.setDate(now.getDate() - (6 - i))
      return d
    })

    const countsByDay: Record<string, number> = {}
    for (const row of logRes.data ?? []) {
      const key = new Date(row.viewed_at).toDateString()
      countsByDay[key] = (countsByDay[key] ?? 0) + 1
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    dailyBreakdown = days.map(d => ({
      day: d.toDateString(),
      short: dayNames[d.getDay()],
      count: countsByDay[d.toDateString()] ?? 0,
    }))
  }

  const maxDay = Math.max(...dailyBreakdown.map(d => d.count), 1)

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-6">

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Dashboard</p>
            <h1 className="text-2xl font-bold text-white">Hey, {displayName}</h1>
          </div>
          <form action="/api/logout" method="POST">
            <button
              type="submit"
              className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-70"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'var(--surface-2)' }}
            >
              Sign out
            </button>
          </form>
        </div>

        {portfolio ? (
          <>
            {/* View stats */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Today', value: viewsToday },
                { label: 'This week', value: viewsWeek },
                { label: 'This month', value: viewsMonth },
                { label: 'All time', value: portfolio.views ?? 0 },
              ].map(s => (
                <div key={s.label} className="bento-tile p-4 flex flex-col gap-1">
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                  <p className="text-2xl font-semibold text-white">{s.value.toLocaleString()}</p>
                  <p className="text-xs" style={{ color: '#444' }}>views</p>
                </div>
              ))}
            </div>

            {/* 7-day chart */}
            <div className="bento-tile p-6 flex flex-col gap-4">
              <h2 className="font-semibold text-white text-sm">Last 7 days</h2>
              <div className="flex gap-2 items-end">
                {dailyBreakdown.map(d => (
                  <DayBar key={d.day} count={d.count} max={maxDay} label={d.short} />
                ))}
              </div>
            </div>

            {/* Portfolio card */}
            <div className="bento-tile p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">Your portfolio</h2>
                <Link
                  href={`/${portfolio.username}`}
                  target="_blank"
                  className="text-xs px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
                  style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                >
                  View live
                </Link>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/dashboard/edit"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white hover:opacity-80 transition-opacity"
                  style={{ background: 'var(--accent)' }}
                >
                  Edit portfolio
                </Link>
                <CopyButton username={portfolio.username} />
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                <UsernameForm current={portfolio.username} />
              </div>
            </div>

            <p className="text-xs text-center" style={{ color: '#333' }}>
              Last updated {timeAgo(portfolio.updated_at)}
            </p>
          </>
        ) : (
          <div className="bento-tile p-10 text-center flex flex-col gap-4">
            <p className="text-white font-medium">No portfolio yet</p>
            <Link
              href="/dashboard/edit"
              className="px-6 py-2 rounded-xl text-sm font-semibold text-white self-center hover:opacity-80 transition-opacity"
              style={{ background: 'var(--accent)' }}
            >
              Get started
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}

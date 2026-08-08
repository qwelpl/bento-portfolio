import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import CopyButton from './CopyButton'
import UsernameForm from './UsernameForm'
import { BentoTile } from '@/lib/types'

const TILE_LABELS: Record<string, string> = {
  bio: 'Bio',
  social: 'Social',
  text: 'Text',
  image: 'Image',
  links: 'Links',
  location: 'Location',
  skills: 'Skills',
  github: 'GitHub',
  'github-repos': 'Repos',
}

const TILE_ICONS: Record<string, string> = {
  bio: '👤',
  social: '🔗',
  text: '📝',
  image: '🖼',
  links: '↗',
  location: '📍',
  skills: '⚡',
  github: '◈',
  'github-repos': '❏',
}

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

function TileBreakdown({ tiles }: { tiles: BentoTile[] }) {
  const counts: Record<string, number> = {}
  for (const t of tiles) counts[t.type] = (counts[t.type] ?? 0) + 1

  if (Object.keys(counts).length === 0) {
    return <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No tiles yet. Edit your portfolio to add some.</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(counts).map(([type, count]) => (
        <div
          key={type}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
          style={{ background: 'var(--surface-2)', color: '#b0b0b0', border: '1px solid var(--border)' }}
        >
          <span style={{ opacity: 0.7 }}>{TILE_ICONS[type] ?? '▫'}</span>
          <span>{TILE_LABELS[type] ?? type}</span>
          {count > 1 && <span className="font-semibold text-white">×{count}</span>}
        </div>
      ))}
    </div>
  )
}

function CompletionBar({ tiles }: { tiles: BentoTile[] }) {
  const hasBio = tiles.some(t => t.type === 'bio')
  const hasSocial = tiles.some(t => t.type === 'social')
  const hasGithub = tiles.some(t => t.type === 'github')
  const hasSkills = tiles.some(t => t.type === 'skills')
  const hasLinks = tiles.some(t => t.type === 'links')

  const items = [
    { label: 'Bio', done: hasBio },
    { label: 'Social', done: hasSocial },
    { label: 'GitHub', done: hasGithub },
    { label: 'Skills', done: hasSkills },
    { label: 'Links', done: hasLinks },
  ]

  const score = items.filter(i => i.done).length
  const pct = Math.round((score / items.length) * 100)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Portfolio completeness</span>
        <span className="text-xs font-semibold text-white">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: pct === 100 ? '#4ade80' : 'var(--accent)' }}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <span
            key={item.label}
            className="text-xs px-2 py-0.5 rounded-md"
            style={{
              background: item.done ? 'rgba(74,222,128,0.1)' : 'var(--surface-2)',
              color: item.done ? '#4ade80' : '#555',
              border: `1px solid ${item.done ? 'rgba(74,222,128,0.3)' : 'var(--border)'}`,
            }}
          >
            {item.done ? '✓ ' : ''}{item.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('username, updated_at, tiles, display_name, views')
    .eq('user_id', user.id)
    .single()

  const tiles: BentoTile[] = portfolio?.tiles ?? []
  const tileCount = tiles.length
  const displayName = portfolio?.display_name || user.email?.split('@')[0] || 'there'

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Dashboard</p>
            <h1 className="text-2xl font-bold text-white">Hey, {displayName} 👋</h1>
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
            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Portfolio views', value: (portfolio.views ?? 0).toLocaleString(), sub: 'all time' },
                { label: 'Total tiles', value: tileCount.toString(), sub: tileCount === 0 ? 'none yet' : `${tileCount} placed` },
                { label: 'Last updated', value: timeAgo(portfolio.updated_at), sub: new Date(portfolio.updated_at).toLocaleDateString() },
                { label: 'Your handle', value: `/${portfolio.username}`, sub: 'shareable link' },
              ].map(s => (
                <div key={s.label} className="bento-tile p-4 flex flex-col gap-1">
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                  <p className="text-lg font-semibold text-white truncate">{s.value}</p>
                  <p className="text-xs" style={{ color: '#555' }}>{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Portfolio card */}
            <div className="bento-tile p-6 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">Your portfolio</h2>
                <Link
                  href={`/${portfolio.username}`}
                  target="_blank"
                  className="text-xs px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity flex items-center gap-1"
                  style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                >
                  View live ↗
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

            {/* Tile breakdown */}
            <div className="bento-tile p-6 flex flex-col gap-4">
              <h2 className="font-semibold text-white">Tile breakdown</h2>
              <TileBreakdown tiles={tiles} />
              {tileCount === 0 && (
                <Link
                  href="/dashboard/edit"
                  className="text-xs underline underline-offset-2 self-start"
                  style={{ color: 'var(--accent)' }}
                >
                  Add tiles ↗
                </Link>
              )}
            </div>

            {/* Completeness */}
            <div className="bento-tile p-6 flex flex-col gap-4">
              <h2 className="font-semibold text-white">Profile strength</h2>
              <CompletionBar tiles={tiles} />
            </div>

            {/* Tips */}
            <div className="bento-tile p-6 flex flex-col gap-4">
              <h2 className="font-semibold text-white">Quick tips</h2>
              <div className="flex flex-col gap-3">
                {[
                  { tip: 'Add a GitHub tile to show your activity automatically.', done: tiles.some(t => t.type === 'github') },
                  { tip: 'Arrange tiles to put the most important info at the top-left.', done: tileCount >= 3 },
                  { tip: 'Share your link on LinkedIn, Twitter, or your resume.', done: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span
                      className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-xs mt-0.5"
                      style={{
                        background: item.done ? 'rgba(74,222,128,0.15)' : 'var(--surface-2)',
                        color: item.done ? '#4ade80' : '#555',
                        border: `1px solid ${item.done ? 'rgba(74,222,128,0.3)' : 'var(--border)'}`,
                      }}
                    >
                      {item.done ? '✓' : '·'}
                    </span>
                    <p className="text-sm" style={{ color: item.done ? '#555' : 'var(--text-muted)', textDecoration: item.done ? 'line-through' : 'none' }}>
                      {item.tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="bento-tile p-10 text-center flex flex-col gap-4">
            <p className="text-white font-medium">No portfolio yet</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Create one in under 5 minutes.</p>
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

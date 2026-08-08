'use client'
import { useEffect, useState } from 'react'
import { TileData } from '@/lib/types'

interface Contribution {
  date: string
  count: number
  level: number
}

interface GithubData {
  contributions: Contribution[]
  total: { lastYear: number }
  prs: number
  issues: number
}

interface Props {
  data: TileData
  editing?: boolean
  onChange?: (data: TileData) => void
}

const COLORS = ['#1e1e1e', '#0e4429', '#006d32', '#26a641', '#39d353']

const inp = "bg-transparent border-b border-white/10 focus:border-white/30 text-white text-sm outline-none w-full py-0.5 placeholder:text-white/20 transition-colors"
const titleInp = "bg-transparent text-white text-sm font-medium outline-none w-full border-b border-white/10 focus:border-white/30 pb-1.5 placeholder:text-white/20 transition-colors"

function StatItem({ value, label, icon }: { value: number; label: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5">
        <span style={{ color: 'var(--text-muted)' }}>{icon}</span>
        <span className="text-sm font-semibold text-white tabular-nums">{value.toLocaleString()}</span>
      </div>
      <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
    </div>
  )
}

export default function GithubTile({ data, editing, onChange }: Props) {
  const username = data.githubUsername || ''
  const [gh, setGh] = useState<GithubData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!username) return
    setLoading(true)
    setError(null)
    fetch(`/api/github/${encodeURIComponent(username)}`)
      .then(r => { if (!r.ok) throw new Error('not found'); return r.json() })
      .then(d => { setGh(d); setLoading(false) })
      .catch(() => { setError('User not found'); setLoading(false) })
  }, [username])

  if (editing) {
    return (
      <div className="p-4 h-full flex flex-col gap-3">
        <input className={titleInp} value={data.tileTitle || ''} onChange={e => onChange?.({ ...data, tileTitle: e.target.value })} placeholder="Section title" />
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>GitHub username</span>
        <input
          className={inp}
          value={username}
          onChange={e => onChange?.({ ...data, githubUsername: e.target.value })}
          placeholder="e.g. torvalds"
          autoFocus
        />
      </div>
    )
  }

  if (!username) {
    return (
      <div className="p-5 h-full flex items-center justify-center">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No username set</p>
      </div>
    )
  }

  const contributions = gh?.contributions ?? []
  const yearTotal = gh?.total?.lastYear ?? 0

  // Last 26 weeks padded to Sunday-aligned columns
  const recentDays = contributions.slice(-182)
  const firstDow = recentDays[0] ? new Date(recentDays[0].date + 'T00:00:00').getDay() : 0
  const padded: (Contribution | null)[] = [...Array(firstDow).fill(null), ...recentDays]
  const weeks: (Contribution | null)[][] = []
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7))

  return (
    <div className="p-4 h-full flex flex-col gap-3 overflow-hidden">
      {/* header */}
      <div className="flex-shrink-0">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{data.tileTitle || 'GitHub'}</p>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-white hover:underline"
        >
          {username}
        </a>
      </div>

      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Loading...</span>
        </div>
      )}

      {error && (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{error}</span>
        </div>
      )}

      {!loading && !error && gh && (
        <>
          {/* heatmap */}
          <div className="flex gap-[3px] overflow-x-hidden flex-shrink-0">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px] flex-shrink-0">
                {Array.from({ length: 7 }).map((_, di) => {
                  const day = week[di] ?? null
                  return (
                    <div
                      key={di}
                      title={day ? `${day.date}: ${day.count}` : undefined}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        background: day ? COLORS[Math.min(day.level, 4)] : 'transparent',
                      }}
                    />
                  )
                })}
              </div>
            ))}
          </div>

          {/* stats row */}
          <div
            className="flex-shrink-0 grid grid-cols-3 gap-2 rounded-xl p-3 mt-auto"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
          >
            <StatItem
              value={yearTotal}
              label="contributions"
              icon={
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />
            <StatItem
              value={gh.prs}
              label="pull requests"
              icon={
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              }
            />
            <StatItem
              value={gh.issues}
              label="issues"
              icon={
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 8v4M12 16h.01" />
                </svg>
              }
            />
          </div>
        </>
      )}
    </div>
  )
}

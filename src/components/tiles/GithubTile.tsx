'use client'
import { useEffect, useRef, useState, useMemo } from 'react'
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
const GAP = 2

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
  const [cellSize, setCellSize] = useState(10)
  const heatmapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!username) return
    setLoading(true)
    setError(null)
    fetch(`/api/github/${encodeURIComponent(username)}`)
      .then(r => { if (!r.ok) throw new Error('not found'); return r.json() })
      .then(d => { setGh(d); setLoading(false) })
      .catch(() => { setError('User not found'); setLoading(false) })
  }, [username])

  const weeks = useMemo(() => {
    const contributions = gh?.contributions ?? []
    const recent = contributions.slice(-182)
    const firstDow = recent[0] ? new Date(recent[0].date + 'T00:00:00').getDay() : 0
    const padded: (Contribution | null)[] = [...Array(firstDow).fill(null), ...recent]
    const w: (Contribution | null)[][] = []
    for (let i = 0; i < padded.length; i += 7) w.push(padded.slice(i, i + 7))
    return w
  }, [gh])

  useEffect(() => {
    const el = heatmapRef.current
    if (!el || weeks.length === 0) return
    const numCols = weeks.length
    const compute = () => {
      const { width, height } = el.getBoundingClientRect()
      const byWidth = Math.floor((width - (numCols - 1) * GAP) / numCols)
      const byHeight = Math.floor((height - 6 * GAP) / 7)
      setCellSize(Math.max(Math.min(byWidth, byHeight, 14), 3))
    }
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    compute()
    return () => ro.disconnect()
  }, [weeks.length])

  if (!username && !editing) {
    return (
      <div className="p-5 h-full flex items-center justify-center">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No username set</p>
      </div>
    )
  }

  return (
    <div className="p-4 h-full flex flex-col gap-3 min-h-0">
      {/* header — editable in place */}
      <div className="flex-shrink-0 flex flex-col gap-1.5">
        {editing ? (
          <>
            <input className={titleInp} value={data.tileTitle || ''} onChange={e => onChange?.({ ...data, tileTitle: e.target.value })} placeholder="Section title" />
            <input className={inp} value={username} onChange={e => onChange?.({ ...data, githubUsername: e.target.value })} placeholder="GitHub username" autoFocus />
          </>
        ) : (
          <>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{data.tileTitle || 'GitHub'}</p>
            <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer"
              className="text-sm font-medium text-white hover:underline">{username}</a>
          </>
        )}
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
          {/* heatmap — grows to fill available space */}
          <div ref={heatmapRef} className="flex-1 min-h-0 overflow-hidden flex items-center">
            <div className="flex" style={{ gap: GAP }}>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
                  {Array.from({ length: 7 }).map((_, di) => {
                    const day = week[di] ?? null
                    return (
                      <div
                        key={di}
                        title={day ? `${day.date}: ${day.count}` : undefined}
                        style={{
                          width: cellSize,
                          height: cellSize,
                          borderRadius: Math.max(cellSize * 0.2, 1),
                          flexShrink: 0,
                          background: day ? COLORS[Math.min(day.level, 4)] : 'transparent',
                        }}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* stats row — always anchored at bottom */}
          <div
            className="flex-shrink-0 grid grid-cols-3 gap-2 rounded-xl p-3"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
          >
            <StatItem
              value={gh.total?.lastYear ?? 0}
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

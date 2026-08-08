'use client'
import { useEffect, useState } from 'react'
import { TileData } from '@/lib/types'

interface Contribution {
  date: string
  count: number
  level: number
}

interface Props {
  data: TileData
  editing?: boolean
  onChange?: (data: TileData) => void
}

const COLORS = ['#1e1e1e', '#0e4429', '#006d32', '#26a641', '#39d353']

const inp = "bg-transparent border-b border-white/10 focus:border-white/30 text-white text-sm outline-none w-full py-0.5 placeholder:text-white/20 transition-colors"

export default function GithubTile({ data, editing, onChange }: Props) {
  const username = data.githubUsername || ''
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [yearTotal, setYearTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!username) return
    setLoading(true)
    setError(null)
    fetch(`/api/github/${encodeURIComponent(username)}`)
      .then(r => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      })
      .then(d => {
        setContributions(d.contributions || [])
        setYearTotal(d.total?.lastYear || 0)
        setLoading(false)
      })
      .catch(() => {
        setError('User not found')
        setLoading(false)
      })
  }, [username])

  if (editing) {
    return (
      <div className="p-4 h-full flex flex-col gap-3">
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

  // Last 26 weeks, padded so first column starts on Sunday
  const recentDays = contributions.slice(-182)
  const firstDow = recentDays[0] ? new Date(recentDays[0].date + 'T00:00:00').getDay() : 0
  const padded: (Contribution | null)[] = [...Array(firstDow).fill(null), ...recentDays]
  const weeks: (Contribution | null)[][] = []
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7))

  return (
    <div className="p-4 h-full flex flex-col gap-3 overflow-hidden">
      <div className="flex items-center justify-between flex-shrink-0">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-white hover:underline"
        >
          {username}
        </a>
        {!loading && !error && (
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {yearTotal.toLocaleString()} this year
          </span>
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

      {!loading && !error && contributions.length > 0 && (
        <div className="flex gap-[3px] overflow-x-hidden flex-shrink-0">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px] flex-shrink-0">
              {Array.from({ length: 7 }).map((_, di) => {
                const day = week[di] ?? null
                return (
                  <div
                    key={di}
                    title={day ? `${day.date}: ${day.count} contributions` : undefined}
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
      )}
    </div>
  )
}

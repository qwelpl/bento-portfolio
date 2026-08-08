'use client'
import { TileData } from '@/lib/types'

interface Props {
  data: TileData
  editing?: boolean
  onChange?: (data: TileData) => void
}

const inp = "bg-transparent border-b border-white/10 focus:border-white/30 text-white text-sm outline-none w-full py-0.5 placeholder:text-white/20 transition-colors"
const titleInp = "bg-transparent text-white text-sm font-medium outline-none w-full border-b border-white/10 focus:border-white/30 pb-1.5 placeholder:text-white/20 transition-colors"

export default function LocationTile({ data, editing, onChange }: Props) {
  const s = (key: keyof TileData, val: string) => onChange?.({ ...data, [key]: val })

  if (editing) {
    return (
      <div className="p-4 h-full flex flex-col justify-center gap-3">
        <input className={titleInp} value={data.tileTitle || ''} onChange={e => s('tileTitle', e.target.value)} placeholder="Section title" />
        <input className={inp} value={data.city || ''} onChange={e => s('city', e.target.value)} placeholder="City" />
        <input className={inp} value={data.country || ''} onChange={e => s('country', e.target.value)} placeholder="Country" />
      </div>
    )
  }

  return (
    <div className="p-5 h-full flex flex-col justify-center gap-1">
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{data.tileTitle || 'Based in'}</p>
      <div className="flex items-center gap-2 mt-1">
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--text-muted)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
        <span className="text-lg font-medium text-white">
          {[data.city, data.country].filter(Boolean).join(', ') || 'Somewhere on Earth'}
        </span>
      </div>
    </div>
  )
}

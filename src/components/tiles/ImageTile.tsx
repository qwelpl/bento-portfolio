'use client'
import { TileData } from '@/lib/types'

interface Props {
  data: TileData
  editing?: boolean
  onChange?: (data: TileData) => void
}

const inp = "bg-transparent border-b border-white/10 focus:border-white/30 text-white text-sm outline-none w-full py-0.5 placeholder:text-white/20 transition-colors"

export default function ImageTile({ data, editing, onChange }: Props) {
  const s = (key: keyof TileData, val: string) => onChange?.({ ...data, [key]: val })

  if (editing) {
    return (
      <div className="p-4 h-full flex flex-col justify-center gap-3">
        <input className={inp} value={data.url || ''} onChange={e => s('url', e.target.value)} placeholder="Image URL" />
        <input className={inp} value={data.caption || ''} onChange={e => s('caption', e.target.value)} placeholder="Caption (optional)" />
      </div>
    )
  }

  if (!data.url) {
    return (
      <div className="h-full flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
        <span className="text-sm">No image set</span>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      <img src={data.url} alt={data.caption || ''} className="w-full h-full object-cover" />
      {data.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-xs text-white/80">{data.caption}</p>
        </div>
      )}
    </div>
  )
}

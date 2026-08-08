'use client'
import { TileData } from '@/lib/types'

export default function ImageTile({ data }: { data: TileData }) {
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

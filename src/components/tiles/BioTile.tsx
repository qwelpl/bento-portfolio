'use client'
import { TileData } from '@/lib/types'
import { marked } from 'marked'

export default function BioTile({ data }: { data: TileData }) {
  return (
    <div className="p-5 h-full flex flex-col justify-between">
      <div className="flex items-start gap-4">
        {data.avatar && (
          <img
            src={data.avatar}
            alt=""
            className="w-14 h-14 rounded-full object-cover flex-shrink-0"
          />
        )}
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-white truncate">{data.name || 'Your Name'}</h2>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm mt-0.5">
            {data.title || 'Your title'}
          </p>
        </div>
      </div>
      {data.bio && (
        <div
          className="text-sm mt-4 leading-relaxed markdown-content"
          style={{ color: '#b0b0b0' }}
          dangerouslySetInnerHTML={{ __html: marked(data.bio, { breaks: true }) as string }}
        />
      )}
    </div>
  )
}

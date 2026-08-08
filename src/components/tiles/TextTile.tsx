'use client'
import { TileData } from '@/lib/types'
import { marked } from 'marked'

export default function TextTile({ data }: { data: TileData }) {
  const html = marked(data.content || 'Add some text here...', { breaks: true }) as string

  return (
    <div className="p-5 h-full flex flex-col gap-2">
      {data.heading && (
        <h3 className="text-base font-semibold text-white">{data.heading}</h3>
      )}
      <div
        className="text-sm leading-relaxed markdown-content"
        style={{ color: '#b0b0b0' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

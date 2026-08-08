'use client'
import { TileData } from '@/lib/types'

export default function TextTile({ data }: { data: TileData }) {
  return (
    <div className="p-5 h-full flex flex-col gap-2">
      {data.heading && (
        <h3 className="text-base font-semibold text-white">{data.heading}</h3>
      )}
      <div
        className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none"
        style={{ color: '#b0b0b0' }}
        dangerouslySetInnerHTML={{ __html: data.content || '<p>Add some text here...</p>' }}
      />
    </div>
  )
}

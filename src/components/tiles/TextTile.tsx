'use client'
import { TileData } from '@/lib/types'
import { marked } from 'marked'

interface Props {
  data: TileData
  editing?: boolean
  onChange?: (data: TileData) => void
}

const inp = "bg-transparent border-b border-white/10 focus:border-white/30 text-white text-sm outline-none w-full py-0.5 placeholder:text-white/20 transition-colors"

export default function TextTile({ data, editing, onChange }: Props) {
  const s = (key: keyof TileData, val: string) => onChange?.({ ...data, [key]: val })

  if (editing) {
    return (
      <div className="p-4 h-full flex flex-col gap-3 overflow-y-auto">
        <input className={`font-semibold ${inp}`} value={data.heading || ''} onChange={e => s('heading', e.target.value)} placeholder="Heading (optional)" />
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Content · markdown</span>
            <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" rel="noopener noreferrer" className="text-[10px] w-4 h-4 flex items-center justify-center rounded-full border transition-colors" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }} title="Markdown syntax guide">?</a>
          </div>
          <textarea
            className="flex-1 min-h-[80px] bg-transparent border border-white/10 focus:border-white/30 rounded text-sm text-white outline-none p-1.5 placeholder:text-white/20 resize-none font-mono transition-colors w-full"
            value={data.content || ''}
            onChange={e => s('content', e.target.value)}
            placeholder="Write something..."
          />
        </div>
      </div>
    )
  }

  const html = marked(data.content || 'Add some text here...', { breaks: true }) as string

  return (
    <div className="p-5 h-full flex flex-col gap-2">
      {data.heading && <h3 className="text-base font-semibold text-white">{data.heading}</h3>}
      <div className="text-sm leading-relaxed markdown-content" style={{ color: '#b0b0b0' }} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

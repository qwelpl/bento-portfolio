'use client'
import { TileData } from '@/lib/types'
import { marked } from 'marked'

interface Props {
  data: TileData
  editing?: boolean
  onChange?: (data: TileData) => void
}

const inp = "bg-transparent border-b border-white/10 focus:border-white/30 text-white text-sm outline-none w-full py-0.5 placeholder:text-white/20 transition-colors"

export default function BioTile({ data, editing, onChange }: Props) {
  const s = (key: keyof TileData, val: string) => onChange?.({ ...data, [key]: val })
  const bioHtml = data.bio ? marked(data.bio, { breaks: true }) as string : null

  if (editing) {
    return (
      <div className="p-4 h-full flex flex-col gap-3 overflow-y-auto">
        <div className="flex items-start gap-3">
          {data.avatar && <img src={data.avatar} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <input className={`text-base font-semibold ${inp}`} value={data.name || ''} onChange={e => s('name', e.target.value)} placeholder="Your Name" />
            <input className={inp} value={data.title || ''} onChange={e => s('title', e.target.value)} placeholder="Your title" />
          </div>
        </div>
        <input className={inp} value={data.avatar || ''} onChange={e => s('avatar', e.target.value)} placeholder="Avatar URL" />
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Bio · markdown</span>
            <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" rel="noopener noreferrer" className="text-[10px] w-4 h-4 flex items-center justify-center rounded-full border transition-colors" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }} title="Markdown syntax guide">?</a>
          </div>
          <textarea
            className="bg-transparent border border-white/10 focus:border-white/30 rounded text-sm text-white outline-none p-1.5 placeholder:text-white/20 resize-none font-mono transition-colors w-full"
            rows={3}
            value={data.bio || ''}
            onChange={e => s('bio', e.target.value)}
            placeholder="Bio..."
          />
        </div>
        {bioHtml && (
          <div
            className="text-xs leading-relaxed markdown-content rounded p-2"
            style={{ color: '#888', background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            dangerouslySetInnerHTML={{ __html: bioHtml }}
          />
        )}
      </div>
    )
  }

  return (
    <div className="p-5 h-full flex flex-col justify-between">
      <div className="flex items-start gap-4">
        {data.avatar && <img src={data.avatar} alt="" className="w-14 h-14 rounded-full object-cover flex-shrink-0" />}
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-white truncate">{data.name || 'Your Name'}</h2>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm mt-0.5">{data.title || 'Your title'}</p>
        </div>
      </div>
      {bioHtml && (
        <div className="text-sm mt-4 leading-relaxed markdown-content" style={{ color: '#b0b0b0' }} dangerouslySetInnerHTML={{ __html: bioHtml }} />
      )}
    </div>
  )
}

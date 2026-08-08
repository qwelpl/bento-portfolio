'use client'
import { TileData } from '@/lib/types'

interface Props {
  data: TileData
  editing?: boolean
  onChange?: (data: TileData) => void
}

const inp = "bg-transparent border-b border-white/10 focus:border-white/30 text-white text-xs outline-none flex-1 py-0.5 placeholder:text-white/20 transition-colors"
const titleInp = "bg-transparent text-white text-sm font-medium outline-none w-full border-b border-white/10 focus:border-white/30 pb-1.5 placeholder:text-white/20 transition-colors"

export default function LinksTile({ data, editing, onChange }: Props) {
  const links = data.links || []
  const set = (next: typeof links) => onChange?.({ ...data, links: next })

  if (editing) {
    return (
      <div className="p-3 h-full flex flex-col gap-2 overflow-y-auto">
        <input className={titleInp} value={data.tileTitle || ''} onChange={e => onChange?.({ ...data, tileTitle: e.target.value })} placeholder="Section title" />
        {links.map((link, i) => (
          <div key={i} className="flex items-center gap-1.5 rounded p-1.5" style={{ background: 'var(--surface-2)' }}>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <input className={inp} value={link.label} onChange={e => { const n = [...links]; n[i] = { ...n[i], label: e.target.value }; set(n) }} placeholder="Label" />
              <input className={inp} value={link.url} onChange={e => { const n = [...links]; n[i] = { ...n[i], url: e.target.value }; set(n) }} placeholder="https://..." />
            </div>
            <button onClick={() => set(links.filter((_, j) => j !== i))} className="text-xs hover:text-red-400 transition-colors flex-shrink-0 px-1" style={{ color: 'var(--text-muted)' }}>✕</button>
          </div>
        ))}
        <button
          onClick={() => set([...links, { label: '', url: '' }])}
          className="text-xs py-1.5 rounded transition-colors text-left px-2"
          style={{ color: 'var(--text-muted)', border: '1px dashed var(--border)' }}
        >
          + Add link
        </button>
      </div>
    )
  }

  return (
    <div className="p-5 h-full flex flex-col gap-2">
      <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{data.tileTitle || 'Links'}</p>
      {links.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No links added</p>
      ) : (
        links.map((link, i) => (
          <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm py-2 px-3 rounded-lg flex items-center justify-between group transition-colors" style={{ background: 'var(--surface-2)', color: '#b0b0b0' }}>
            <span className="group-hover:text-white transition-colors">{link.label}</span>
            <svg className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ))
      )}
    </div>
  )
}

'use client'
import { TileData } from '@/lib/types'

export default function LinksTile({ data }: { data: TileData }) {
  const links = data.links || []

  return (
    <div className="p-5 h-full flex flex-col gap-2">
      <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Links</p>
      {links.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No links added</p>
      ) : (
        links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm py-2 px-3 rounded-lg flex items-center justify-between group transition-colors"
            style={{ background: 'var(--surface-2)', color: '#b0b0b0' }}
          >
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

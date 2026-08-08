'use client'
import { TileData } from '@/lib/types'

export default function SkillsTile({ data }: { data: TileData }) {
  const skills = data.skills || []

  return (
    <div className="p-5 h-full flex flex-col gap-3">
      <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Skills</p>
      <div className="flex flex-wrap gap-2">
        {skills.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No skills added</p>
        ) : (
          skills.map((s, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: 'var(--surface-2)', color: '#b0b0b0', border: '1px solid var(--border)' }}
            >
              {s}
            </span>
          ))
        )}
      </div>
    </div>
  )
}

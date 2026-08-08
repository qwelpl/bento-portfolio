'use client'
import { TileData } from '@/lib/types'

interface Props {
  data: TileData
  editing?: boolean
  onChange?: (data: TileData) => void
}

export default function SkillsTile({ data, editing, onChange }: Props) {
  const skills = data.skills || []

  if (editing) {
    return (
      <div className="p-4 h-full flex flex-col gap-2">
        <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Skills · comma separated</span>
        <textarea
          className="flex-1 bg-transparent border border-white/10 focus:border-white/30 rounded text-sm text-white outline-none p-1.5 placeholder:text-white/20 resize-none transition-colors"
          value={skills.join(', ')}
          onChange={e => onChange?.({ ...data, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
          placeholder="React, TypeScript, Go, ..."
        />
      </div>
    )
  }

  return (
    <div className="p-5 h-full flex flex-col gap-3">
      <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Skills</p>
      <div className="flex flex-wrap gap-2">
        {skills.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No skills added</p>
        ) : (
          skills.map((s, i) => (
            <span key={i} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--surface-2)', color: '#b0b0b0', border: '1px solid var(--border)' }}>
              {s}
            </span>
          ))
        )}
      </div>
    </div>
  )
}

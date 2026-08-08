'use client'
import { useRef, useState } from 'react'
import { TileData } from '@/lib/types'

interface Props {
  data: TileData
  editing?: boolean
  onChange?: (data: TileData) => void
}

const titleInp = "bg-transparent text-white text-sm font-medium outline-none w-full border-b border-white/10 focus:border-white/30 pb-1.5 placeholder:text-white/20 transition-colors"

export default function SkillsTile({ data, editing, onChange }: Props) {
  const skills = data.skills || []
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const addSkill = (val: string) => {
    const trimmed = val.trim()
    if (!trimmed || skills.includes(trimmed)) return
    onChange?.({ ...data, skills: [...skills, trimmed] })
    setInput('')
  }

  const removeSkill = (i: number) => {
    onChange?.({ ...data, skills: skills.filter((_, j) => j !== i) })
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill(input)
    } else if (e.key === 'Backspace' && input === '' && skills.length > 0) {
      removeSkill(skills.length - 1)
    }
  }

  if (editing) {
    return (
      <div className="p-4 h-full flex flex-col gap-3">
        <input className={titleInp} value={data.tileTitle || ''} onChange={e => onChange?.({ ...data, tileTitle: e.target.value })} placeholder="Section title" />
        <div
          className="flex-1 flex flex-col gap-2 rounded-lg p-2 cursor-text overflow-y-auto"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
          onClick={() => inputRef.current?.focus()}
        >
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s, i) => (
              <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--surface)', color: '#d0d0d0', border: '1px solid var(--border)' }}>
                {s}
                <button
                  onMouseDown={e => { e.preventDefault(); removeSkill(i) }}
                  className="opacity-40 hover:opacity-100 transition-opacity leading-none"
                  style={{ color: 'var(--text-muted)' }}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              onBlur={() => addSkill(input)}
              placeholder={skills.length === 0 ? 'Type a skill, press Enter...' : ''}
              className="bg-transparent outline-none text-sm text-white placeholder:text-white/20 min-w-[120px] flex-1 py-0.5"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 h-full flex flex-col gap-3">
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{data.tileTitle || 'Skills'}</p>
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

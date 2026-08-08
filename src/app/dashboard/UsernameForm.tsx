'use client'
import { useState, useEffect, useRef } from 'react'
import { updateUsername } from './actions'

type Check = 'idle' | 'checking' | 'taken' | 'available'

export default function UsernameForm({ current }: { current: string }) {
  const [value, setValue] = useState(current)
  const [check, setCheck] = useState<Check>('idle')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dirty = value.trim() !== current && value.trim().length > 0
  const valid = /^[a-z0-9_-]+$/.test(value.trim())

  useEffect(() => {
    const trimmed = value.trim()
    if (!dirty || !valid) { setCheck('idle'); return }

    setCheck('checking')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`/api/check-username?u=${encodeURIComponent(trimmed)}`)
      const { available } = await res.json()
      setCheck(available ? 'available' : 'taken')
    }, 400)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [value, dirty, valid])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || trimmed === current || check !== 'available') return
    setSaving(true)
    setSaveError('')
    const res = await updateUsername(trimmed)
    setSaving(false)
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
    else setSaveError(res.error ?? 'Something went wrong')
  }

  const borderColor = check === 'taken' ? '#f87171' : check === 'available' ? '#4ade80' : 'var(--border)'

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <label className="text-xs" style={{ color: 'var(--text-muted)' }}>URL handle</label>
      <div className="flex items-center gap-2">
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/</span>
        <input
          value={value}
          onChange={e => { setValue(e.target.value.toLowerCase()); setSaveError(''); setSaved(false) }}
          className="flex-1 bg-transparent border-b text-sm text-white outline-none py-0.5 placeholder:text-white/20 transition-colors"
          style={{ borderColor }}
          placeholder="your-handle"
        />
        {dirty && check === 'available' && (
          <button
            type="submit"
            disabled={saving}
            className="text-xs px-3 py-1 rounded-lg transition-opacity disabled:opacity-50 flex-shrink-0"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        )}
      </div>
      {!valid && dirty && (
        <p className="text-xs" style={{ color: '#f87171' }}>Only lowercase letters, numbers, hyphens, underscores</p>
      )}
      {check === 'taken' && (
        <p className="text-xs" style={{ color: '#f87171' }}>That handle is already taken</p>
      )}
      {saved && (
        <p className="text-xs" style={{ color: '#4ade80' }}>Saved</p>
      )}
      {saveError && (
        <p className="text-xs" style={{ color: '#f87171' }}>{saveError}</p>
      )}
    </form>
  )
}

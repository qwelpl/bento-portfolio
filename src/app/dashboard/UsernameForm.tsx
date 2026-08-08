'use client'
import { useState } from 'react'
import { updateUsername } from './actions'

export default function UsernameForm({ current }: { current: string }) {
  const [value, setValue] = useState(current)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'ok'>('idle')
  const [msg, setMsg] = useState('')

  const dirty = value.trim() !== current && value.trim().length > 0

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || trimmed === current) return
    if (!/^[a-z0-9_-]+$/.test(trimmed)) {
      setStatus('error')
      setMsg('Only lowercase letters, numbers, hyphens, underscores')
      return
    }
    setStatus('loading')
    const res = await updateUsername(trimmed)
    if (res.ok) {
      setStatus('ok')
      setMsg('Saved')
    } else {
      setStatus('error')
      setMsg(res.error ?? 'Something went wrong')
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <label className="text-xs" style={{ color: 'var(--text-muted)' }}>URL handle</label>
      <div className="flex items-center gap-2">
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>bento.page/</span>
        <input
          value={value}
          onChange={e => { setValue(e.target.value.toLowerCase()); setStatus('idle'); setMsg('') }}
          className="flex-1 bg-transparent border-b text-sm text-white outline-none py-0.5 placeholder:text-white/20 transition-colors"
          style={{ borderColor: status === 'error' ? '#f87171' : 'var(--border)' }}
          placeholder="your-handle"
        />
        {dirty && (
          <button
            type="submit"
            disabled={status === 'loading'}
            className="text-xs px-3 py-1 rounded-lg transition-opacity disabled:opacity-50"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            {status === 'loading' ? 'Saving...' : 'Save'}
          </button>
        )}
      </div>
      {msg && (
        <p className="text-xs" style={{ color: status === 'error' ? '#f87171' : '#4ade80' }}>{msg}</p>
      )}
    </form>
  )
}

'use client'
import { useState } from 'react'

export default function CopyButton({ username }: { username: string }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/${username}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      className="px-4 py-2 rounded-xl text-sm transition-all"
      style={{
        background: copied ? 'rgba(74,222,128,0.1)' : 'var(--surface-2)',
        color: copied ? '#4ade80' : 'var(--text-muted)',
        border: `1px solid ${copied ? 'rgba(74,222,128,0.3)' : 'var(--border)'}`,
      }}
    >
      {copied ? 'Copied!' : 'Copy link'}
    </button>
  )
}

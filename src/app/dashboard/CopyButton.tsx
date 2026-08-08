'use client'

export default function CopyButton({ username }: { username: string }) {
  const copy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/${username}`)
  }

  return (
    <button
      onClick={copy}
      className="px-4 py-2 rounded-xl text-sm hover:text-white transition-colors"
      style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
    >
      Copy link
    </button>
  )
}

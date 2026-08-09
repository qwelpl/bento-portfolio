'use client'
import { useEffect, useRef, useState } from 'react'
import { TileData } from '@/lib/types'

interface RepoMeta {
  name: string
  full_name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  html_url: string
}

interface Props {
  data: TileData
  editing?: boolean
  onChange?: (data: TileData) => void
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5',
  Rust: '#dea584', Go: '#00ADD8', Swift: '#F05138', Kotlin: '#A97BFF',
  Java: '#b07219', 'C++': '#f34b7d', C: '#555555', CSS: '#563d7c',
  HTML: '#e34c26', Ruby: '#701516', PHP: '#4F5D95', Dart: '#00B4AB',
}

const titleInp = "bg-transparent text-white text-sm font-medium outline-none w-full border-b border-white/10 focus:border-white/30 pb-1.5 placeholder:text-white/20 transition-colors"
const inp = "bg-transparent border-b border-white/10 focus:border-white/30 text-white text-sm outline-none w-full py-0.5 placeholder:text-white/20 transition-colors"

export default function GithubReposTile({ data, editing, onChange }: Props) {
  const repos = data.repos ?? []
  const [input, setInput] = useState('')
  const [meta, setMeta] = useState<Record<string, RepoMeta | null>>({})
  const inputRef = useRef<HTMLInputElement>(null)

  const provider = data.gitProvider ?? 'github'

  useEffect(() => {
    repos.forEach(r => {
      if (meta[r] !== undefined) return
      const endpoint = provider === 'gitlab' ? `/api/gitlab/repo?q=${encodeURIComponent(r)}` : `/api/github/repo?q=${encodeURIComponent(r)}`
      fetch(endpoint)
        .then(res => res.ok ? res.json() : null)
        .then(d => setMeta(prev => ({ ...prev, [r]: d })))
        .catch(() => setMeta(prev => ({ ...prev, [r]: null })))
    })
  }, [repos.join(','), provider])

  const resolve = (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return null
    return trimmed.includes('/') ? trimmed : `${data.githubUsername || ''}/${trimmed}`
  }

  const repoUrl = (r: string, m: RepoMeta | null) => {
    if (m?.html_url) return m.html_url
    return provider === 'gitlab' ? `https://gitlab.com/${r}` : `https://github.com/${r}`
  }

  const addRepo = (raw: string) => {
    const key = resolve(raw)
    if (!key || repos.includes(key)) return
    onChange?.({ ...data, repos: [...repos, key] })
    setInput('')
  }

  const removeRepo = (key: string) => onChange?.({ ...data, repos: repos.filter(r => r !== key) })

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); addRepo(input) }
    else if (e.key === 'Backspace' && input === '' && repos.length > 0) removeRepo(repos[repos.length - 1])
  }

  if (editing) {
    return (
      <div className="p-4 h-full flex flex-col gap-3 overflow-y-auto">
        <input className={titleInp} value={data.tileTitle || ''} onChange={e => onChange?.({ ...data, tileTitle: e.target.value })} placeholder="Section title" />
        <div
          className="flex-1 flex flex-col gap-2 rounded-lg p-2 cursor-text overflow-y-auto"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
          onClick={() => inputRef.current?.focus()}
        >
          <div className="flex flex-wrap gap-1.5">
            {repos.map(r => (
              <span key={r} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--surface)', color: '#d0d0d0', border: '1px solid var(--border)' }}>
                {r}
                <button onMouseDown={e => { e.preventDefault(); removeRepo(r) }} className="opacity-40 hover:opacity-100 transition-opacity leading-none" style={{ color: 'var(--text-muted)' }}>×</button>
              </span>
            ))}
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              onBlur={() => addRepo(input)}
              placeholder={repos.length === 0 ? 'Type owner/repo or reponame, press Enter to add' : 'Add another...'}
              className="bg-transparent outline-none text-sm text-white placeholder:text-white/20 min-w-[160px] flex-1 py-0.5"
            />
          </div>
        </div>
        <div className="flex gap-1">
          {(['github', 'gitlab'] as const).map(p => (
            <button
              key={p}
              onClick={() => onChange?.({ ...data, gitProvider: p })}
              className="px-2.5 py-0.5 rounded text-xs font-medium transition-colors"
              style={{
                background: provider === p ? 'var(--accent)' : 'var(--surface-2)',
                color: provider === p ? 'white' : 'var(--text-muted)',
                border: '1px solid var(--border)',
              }}
            >
              {p === 'github' ? 'GitHub' : 'GitLab'}
            </button>
          ))}
        </div>
        <input className={inp} value={data.githubUsername || ''} onChange={e => onChange?.({ ...data, githubUsername: e.target.value })} placeholder={`Your ${provider === 'gitlab' ? 'GitLab' : 'GitHub'} username (used when owner is omitted)`} />
      </div>
    )
  }

  if (repos.length === 0) {
    return (
      <div className="p-5 h-full flex items-center justify-center">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No repositories added</p>
      </div>
    )
  }

  return (
    <div className="p-4 h-full flex flex-col gap-3 overflow-y-auto">
      {data.tileTitle && <p className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{data.tileTitle}</p>}
      <div className="flex flex-col gap-2">
        {repos.map(r => {
          const m = meta[r]
          return (
            <a
              key={r}
              href={repoUrl(r, m)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1.5 rounded-xl p-3 transition-colors group"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-white group-hover:underline truncate">{m?.name ?? r.split('/').pop()}</span>
                <svg className="w-3.5 h-3.5 flex-shrink-0 opacity-30 group-hover:opacity-80 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              {m?.description && <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#888' }}>{m.description}</p>}
              {m && (
                <div className="flex items-center gap-3 mt-0.5">
                  {m.language && (
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: LANG_COLORS[m.language] ?? '#888' }} />
                      {m.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {m.stargazers_count.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                    {m.forks_count.toLocaleString()}
                  </span>
                </div>
              )}
              {!m && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Loading...</p>}
            </a>
          )
        })}
      </div>
    </div>
  )
}

'use client'
import { BentoTile, TileType } from '@/lib/types'
import RichTextEditor from './RichTextEditor'

interface Props {
  tile: BentoTile
  onChange: (updated: BentoTile) => void
  onDelete: () => void
  onClose: () => void
}

export default function TileEditPanel({ tile, onChange, onDelete, onClose }: Props) {
  const set = (key: string, value: unknown) => {
    onChange({ ...tile, data: { ...tile.data, [key]: value } })
  }

  const field = (label: string, key: string, placeholder?: string) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</label>
      <input
        className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none focus:ring-1 focus:ring-purple-500"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
        value={(tile.data[key as keyof typeof tile.data] as string) || ''}
        onChange={e => set(key, e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )

  const textarea = (label: string, key: string, placeholder?: string) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</label>
      <textarea
        className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none focus:ring-1 focus:ring-purple-500 resize-none"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
        rows={4}
        value={(tile.data[key as keyof typeof tile.data] as string) || ''}
        onChange={e => set(key, e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )

  const renderFields = (type: TileType) => {
    switch (type) {
      case 'bio': return (
        <>
          {field('Name', 'name', 'Jane Doe')}
          {field('Title', 'title', 'Software Engineer')}
          {textarea('Bio', 'bio', 'A short description about yourself...')}
          {field('Avatar URL', 'avatar', 'https://...')}
        </>
      )
      case 'social': return (
        <>
          {field('GitHub username', 'github', 'username')}
          {field('Twitter / X handle', 'twitter', 'handle')}
          {field('LinkedIn username', 'linkedin', 'username')}
          {field('Instagram handle', 'instagram', 'handle')}
        </>
      )
      case 'text': return (
        <>
          {field('Heading (optional)', 'heading', 'About me')}
          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Content</label>
            <RichTextEditor
              value={(tile.data.content as string) || ''}
              onChange={val => set('content', val)}
              placeholder="Write something..."
            />
          </div>
        </>
      )
      case 'image': return (
        <>
          {field('Image URL', 'url', 'https://...')}
          {field('Caption (optional)', 'caption')}
        </>
      )
      case 'location': return (
        <>
          {field('City', 'city', 'San Francisco')}
          {field('Country', 'country', 'USA')}
        </>
      )
      case 'skills': return (
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Skills (comma separated)</label>
          <textarea
            className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none focus:ring-1 focus:ring-purple-500 resize-none"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            rows={3}
            value={(tile.data.skills || []).join(', ')}
            onChange={e => set('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            placeholder="React, TypeScript, Go, ..."
          />
        </div>
      )
      case 'links': {
        const links = tile.data.links || []
        return (
          <div className="flex flex-col gap-3">
            {links.map((link, i) => (
              <div key={i} className="flex flex-col gap-1 p-3 rounded-lg" style={{ background: 'var(--surface-2)' }}>
                <input
                  className="w-full px-2 py-1.5 rounded text-sm text-white outline-none"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                  value={link.label}
                  onChange={e => {
                    const next = [...links]
                    next[i] = { ...next[i], label: e.target.value }
                    set('links', next)
                  }}
                  placeholder="Label"
                />
                <input
                  className="w-full px-2 py-1.5 rounded text-sm text-white outline-none"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                  value={link.url}
                  onChange={e => {
                    const next = [...links]
                    next[i] = { ...next[i], url: e.target.value }
                    set('links', next)
                  }}
                  placeholder="https://..."
                />
                <button
                  onClick={() => set('links', links.filter((_, j) => j !== i))}
                  className="text-xs text-left mt-1 hover:text-red-400 transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => set('links', [...links, { label: '', url: '' }])}
              className="text-sm py-2 rounded-lg hover:text-white transition-colors"
              style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
            >
              + Add link
            </button>
          </div>
        )
      }
    }
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: 'var(--surface)', borderLeft: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <span className="text-sm font-medium capitalize">{tile.type} tile</span>
        <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {renderFields(tile.type)}
      </div>
      <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
        <button
          onClick={onDelete}
          className="w-full py-2 rounded-lg text-sm hover:bg-red-900/30 transition-colors"
          style={{ color: '#f87171', border: '1px solid #7f1d1d' }}
        >
          Delete tile
        </button>
      </div>
    </div>
  )
}

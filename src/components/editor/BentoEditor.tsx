'use client'
import { useState, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { v4 as uuid } from 'uuid'
import { BentoTile, GridItem, TileData, TileType } from '@/lib/types'
import TileRenderer from '@/components/TileRenderer'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GridLayout = dynamic<any>(() => import('react-grid-layout') as any, { ssr: false })

const TILE_DEFAULTS: Record<TileType, { w: number; h: number; label: string; minH?: number }> = {
  bio:      { w: 2, h: 2, label: 'Bio' },
  social:   { w: 1, h: 2, label: 'Social' },
  text:     { w: 2, h: 1, label: 'Text' },
  image:    { w: 1, h: 2, label: 'Image' },
  links:    { w: 1, h: 2, label: 'Links' },
  location: { w: 1, h: 1, label: 'Location' },
  skills:        { w: 2, h: 1, label: 'Skills' },
  github:        { w: 2, h: 2, label: 'GitHub', minH: 2 },
  'github-repos': { w: 2, h: 3, label: 'Repositories' },
}

interface Props {
  initialTiles: BentoTile[]
  initialLayout: GridItem[]
  onSave: (tiles: BentoTile[], layout: GridItem[]) => Promise<void>
}

export default function BentoEditor({ initialTiles, initialLayout, onSave }: Props) {
  const [tiles, setTiles] = useState<BentoTile[]>(initialTiles)
  const [layout, setLayout] = useState<GridItem[]>(initialLayout)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [width, setWidth] = useState(1920)
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(node)
    setWidth(node.offsetWidth)
  }, [])

  const addTile = (type: TileType) => {
    const id = uuid()
    const def = TILE_DEFAULTS[type]
    const maxY = layout.reduce((m, l) => Math.max(m, l.y + l.h), 0)
    setTiles(prev => [...prev, { id, type, data: {} }])
    setLayout(prev => [...prev, { i: id, x: 0, y: maxY, w: def.w, h: def.h, minW: 1, minH: def.minH ?? 1 }])
    setEditingId(id)
  }

  const updateTileData = (id: string, data: TileData) => {
    setTiles(prev => prev.map(t => {
      if (t.id !== id) return t
      // Auto-expand links tile to fit content
      if (t.type === 'links') {
        const n = data.links?.length ?? 0
        // base ~94px (title + add button + padding) + ~60px per link
        const neededPx = 94 + n * 60
        const neededH = Math.max(1, Math.ceil(neededPx / 172))
        setLayout(prev => prev.map(l => l.i === id ? { ...l, h: neededH } : l))
      }
      return { ...t, data }
    }))
  }

  const deleteTile = (id: string) => {
    setTiles(prev => prev.filter(t => t.id !== id))
    setLayout(prev => prev.filter(l => l.i !== id))
    setEditingId(null)
  }

  const handleSave = async () => {
    setSaving(true)
    await onSave(tiles, layout)
    setSaving(false)
  }

  return (
    <div className="flex h-screen" style={{ background: 'var(--bg)' }}>
      {/* left sidebar — add tiles */}
      <div className="w-48 flex-shrink-0 flex flex-col gap-1 p-3 overflow-y-auto" style={{ borderRight: '1px solid var(--border)', background: 'var(--surface)' }}>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors mb-1"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          dashboard
        </Link>
        <p className="text-xs px-2 pb-1" style={{ color: 'var(--text-muted)' }}>add tile</p>
        {(['bio','social','text','image','links','location','skills'] as TileType[]).map(type => (
          <button
            key={type}
            onClick={() => addTile(type)}
            className="w-full text-left px-3 py-2 rounded-lg text-sm hover:text-white transition-colors"
            style={{ color: '#b0b0b0' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {TILE_DEFAULTS[type].label}
          </button>
        ))}
        {/* GitHub group */}
        <button
          onClick={() => setExpandedGroup(expandedGroup === 'github' ? null : 'github')}
          className="w-full text-left px-3 py-2 rounded-lg text-sm hover:text-white transition-colors flex items-center justify-between"
          style={{ color: '#b0b0b0' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <span>GitHub</span>
          <svg className="w-3 h-3 transition-transform" style={{ transform: expandedGroup === 'github' ? 'rotate(90deg)' : 'rotate(0deg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        {expandedGroup === 'github' && (
          <div className="flex flex-col gap-0.5 pl-2">
            {(['github', 'github-repos'] as TileType[]).map(type => (
              <button
                key={type}
                onClick={() => addTile(type)}
                className="w-full text-left px-3 py-1.5 rounded-lg text-sm hover:text-white transition-colors"
                style={{ color: '#888' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {type === 'github' ? 'Stats' : 'Repositories'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="text-sm font-medium">Editor</span>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6" onClick={() => setEditingId(null)}>
          <div
            ref={containerRef}
            style={{ maxWidth: 1920 }}
            onClick={e => e.stopPropagation()}
          >
          <GridLayout
            layout={layout.map(l => ({ ...l, static: l.i === editingId }))}
            cols={4}
            rowHeight={160}
            width={width}
            margin={[12, 12]}
            compactType={null}
            preventCollision={true}
            onLayoutChange={(l: (GridItem & { static?: boolean })[]) => setLayout(l.map(({ static: _s, ...rest }) => rest as GridItem))}
            draggableHandle=".drag-handle"
          >
            {tiles.map(tile => {
              const isEditing = editingId === tile.id
              return (
                <div
                  key={tile.id}
                  className={`bento-tile group/tile relative ${isEditing ? 'ring-2 ring-purple-500' : ''}`}
                  onClick={e => e.stopPropagation()}
                >
                  {/* top-right controls */}
                  <div className={`absolute top-2 right-2 z-20 flex items-center gap-1 transition-opacity ${isEditing ? 'opacity-100' : 'opacity-0 group-hover/tile:opacity-100'}`}>
                    {isEditing ? (
                      <>
                        {/* delete */}
                        <button
                          onClick={e => { e.stopPropagation(); deleteTile(tile.id) }}
                          className="flex items-center justify-center w-6 h-6 rounded transition-colors hover:bg-red-900/40"
                          style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
                          title="Delete tile"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        {/* close edit */}
                        <button
                          onClick={e => { e.stopPropagation(); setEditingId(null) }}
                          className="flex items-center justify-center w-6 h-6 rounded transition-colors"
                          style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
                          title="Done editing"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <>
                        {/* edit pencil */}
                        <button
                          onClick={e => { e.stopPropagation(); setEditingId(tile.id) }}
                          className="flex items-center justify-center w-6 h-6 rounded transition-colors"
                          style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
                          title="Edit tile"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        {/* drag handle */}
                        <div
                          className="drag-handle flex items-center justify-center w-6 h-6 rounded cursor-grab"
                          style={{ background: 'var(--surface-2)' }}
                          onClick={e => e.stopPropagation()}
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                            <circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" />
                            <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
                            <circle cx="9" cy="18" r="1.5" /><circle cx="15" cy="18" r="1.5" />
                          </svg>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="relative w-full h-full">
                    <TileRenderer
                      tile={tile}
                      editing={isEditing}
                      onChange={data => updateTileData(tile.id, data)}
                    />
                  </div>
                </div>
              )
            })}
          </GridLayout>

          {tiles.length === 0 && (
            <div className="flex items-center justify-center" style={{ height: 400, color: 'var(--text-muted)' }}>
              <p className="text-sm">Add tiles from the left panel</p>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}

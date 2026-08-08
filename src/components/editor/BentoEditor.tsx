'use client'
import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { v4 as uuid } from 'uuid'
import { BentoTile, GridItem, TileType } from '@/lib/types'
import TileRenderer from '@/components/TileRenderer'
import TileEditPanel from './TileEditPanel'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GridLayout = dynamic<any>(
  () => import('react-grid-layout') as any,
  { ssr: false }
)

const TILE_DEFAULTS: Record<TileType, { w: number; h: number; label: string }> = {
  bio:      { w: 2, h: 2, label: 'Bio' },
  social:   { w: 1, h: 2, label: 'Social' },
  text:     { w: 2, h: 1, label: 'Text' },
  image:    { w: 1, h: 2, label: 'Image' },
  links:    { w: 1, h: 2, label: 'Links' },
  location: { w: 1, h: 1, label: 'Location' },
  skills:   { w: 2, h: 1, label: 'Skills' },
}

interface Props {
  initialTiles: BentoTile[]
  initialLayout: GridItem[]
  onSave: (tiles: BentoTile[], layout: GridItem[]) => Promise<void>
}

export default function BentoEditor({ initialTiles, initialLayout, onSave }: Props) {
  const [tiles, setTiles] = useState<BentoTile[]>(initialTiles)
  const [layout, setLayout] = useState<GridItem[]>(initialLayout)
  const [selected, setSelected] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [width, setWidth] = useState(800)

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width)
    })
    observer.observe(node)
    setWidth(node.offsetWidth)
  }, [])

  const addTile = (type: TileType) => {
    const id = uuid()
    const def = TILE_DEFAULTS[type]
    const maxY = layout.reduce((m, l) => Math.max(m, l.y + l.h), 0)
    setTiles(prev => [...prev, { id, type, data: {} }])
    setLayout(prev => [...prev, { i: id, x: 0, y: maxY, w: def.w, h: def.h, minW: 1, minH: 1 }])
    setSelected(id)
  }

  const updateTile = (updated: BentoTile) => {
    setTiles(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  const deleteTile = (id: string) => {
    setTiles(prev => prev.filter(t => t.id !== id))
    setLayout(prev => prev.filter(l => l.i !== id))
    setSelected(null)
  }

  const handleSave = async () => {
    setSaving(true)
    await onSave(tiles, layout)
    setSaving(false)
  }

  const selectedTile = tiles.find(t => t.id === selected) ?? null

  return (
    <div className="flex h-screen" style={{ background: 'var(--bg)' }}>
      {/* left sidebar */}
      <div
        className="w-48 flex-shrink-0 flex flex-col gap-1 p-3 overflow-y-auto"
        style={{ borderRight: '1px solid var(--border)', background: 'var(--surface)' }}
      >
        <p className="text-xs uppercase tracking-widest px-2 pb-2" style={{ color: 'var(--text-muted)' }}>Add tile</p>
        {(Object.keys(TILE_DEFAULTS) as TileType[]).map(type => (
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
      </div>

      {/* canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        <div
          className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
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
        <div ref={containerRef} className="flex-1 overflow-y-auto p-4">
          <GridLayout
            layout={layout}
            cols={4}
            rowHeight={160}
            width={width - 32}
            margin={[12, 12]}
            onLayoutChange={(l: GridItem[]) => setLayout(l)}
            draggableHandle=".drag-handle"
          >
            {tiles.map(tile => (
              <div
                key={tile.id}
                className={`bento-tile cursor-pointer ${selected === tile.id ? 'ring-2 ring-purple-500' : ''}`}
                onClick={() => setSelected(tile.id)}
              >
                <div
                  className="drag-handle absolute top-2 right-2 cursor-grab z-10 opacity-0 hover:opacity-100 transition-opacity p-1 rounded"
                  style={{ background: 'var(--surface-2)' }}
                  onClick={e => e.stopPropagation()}
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                    <circle cx="9" cy="6" r="1.5" />
                    <circle cx="15" cy="6" r="1.5" />
                    <circle cx="9" cy="12" r="1.5" />
                    <circle cx="15" cy="12" r="1.5" />
                    <circle cx="9" cy="18" r="1.5" />
                    <circle cx="15" cy="18" r="1.5" />
                  </svg>
                </div>
                <div className="relative w-full h-full">
                  <TileRenderer tile={tile} />
                </div>
              </div>
            ))}
          </GridLayout>
          {tiles.length === 0 && (
            <div className="flex items-center justify-center h-64" style={{ color: 'var(--text-muted)' }}>
              <p className="text-sm">Add tiles from the left panel</p>
            </div>
          )}
        </div>
      </div>

      {/* right edit panel */}
      {selectedTile && (
        <div className="w-64 flex-shrink-0">
          <TileEditPanel
            tile={selectedTile}
            onChange={updateTile}
            onDelete={() => deleteTile(selectedTile.id)}
            onClose={() => setSelected(null)}
          />
        </div>
      )}
    </div>
  )
}

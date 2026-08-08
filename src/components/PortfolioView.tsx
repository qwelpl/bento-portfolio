'use client'
import dynamic from 'next/dynamic'
import { BentoTile, GridItem } from '@/lib/types'
import TileRenderer from './TileRenderer'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GridLayout = dynamic<any>(
  () => import('react-grid-layout') as any,
  { ssr: false }
)

interface Props {
  tiles: BentoTile[]
  layout: GridItem[]
  width: number
}

export default function PortfolioView({ tiles, layout, width }: Props) {
  return (
    <GridLayout
      layout={layout}
      cols={4}
      rowHeight={160}
      width={width}
      margin={[12, 12]}
      isDraggable={false}
      isResizable={false}
      compactType={null}
    >
      {tiles.map(tile => (
        <div key={tile.id} className="bento-tile">
          <TileRenderer tile={tile} />
        </div>
      ))}
    </GridLayout>
  )
}

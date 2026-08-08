'use client'
import { useEffect, useRef, useState } from 'react'
import PortfolioView from '@/components/PortfolioView'
import { Portfolio } from '@/lib/types'

export default function PortfolioPageClient({ portfolio }: { portfolio: Portfolio }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(800)

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width)
    })
    observer.observe(containerRef.current)
    setWidth(containerRef.current.offsetWidth)
    return () => observer.disconnect()
  }, [])

  return (
    <main className="min-h-screen">
      <div ref={containerRef} style={{ maxWidth: 1920, margin: '0 auto', paddingTop: 48 }}>
        {width > 0 && (
          <PortfolioView
            tiles={portfolio.tiles || []}
            layout={portfolio.layout || []}
            width={width}
          />
        )}
      </div>
    </main>
  )
}

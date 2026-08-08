'use client'
import { useRouter } from 'next/navigation'
import BentoEditor from '@/components/editor/BentoEditor'
import { createClient } from '@/lib/supabase/client'
import { BentoTile, GridItem, Portfolio } from '@/lib/types'

export default function EditPageClient({ portfolio }: { portfolio: Portfolio }) {
  const router = useRouter()

  const handleSave = async (tiles: BentoTile[], layout: GridItem[]) => {
    const supabase = createClient()
    await supabase
      .from('portfolios')
      .update({ tiles, layout, updated_at: new Date().toISOString() })
      .eq('id', portfolio.id)
    router.refresh()
  }

  return (
    <BentoEditor
      initialTiles={portfolio.tiles || []}
      initialLayout={portfolio.layout || []}
      onSave={handleSave}
    />
  )
}

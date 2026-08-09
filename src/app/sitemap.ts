import { createClient } from '@/lib/supabase/server'
import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tiledrop.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const { data: portfolios } = await supabase
    .from('portfolios')
    .select('username, updated_at')

  const portfolioUrls = (portfolios ?? []).map(p => ({
    url: `${BASE_URL}/${p.username}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    ...portfolioUrls,
  ]
}

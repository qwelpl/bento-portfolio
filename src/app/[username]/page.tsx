import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PortfolioPageClient from './PortfolioPageClient'
import { BentoTile } from '@/lib/types'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tiledrop.vercel.app'

async function getPortfolio(username: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('portfolios')
    .select('*')
    .eq('username', username.toLowerCase())
    .single()
  return data
}

function extractBio(tiles: BentoTile[]) {
  const bio = tiles.find(t => t.type === 'bio')
  return {
    name: bio?.data?.name || null,
    title: bio?.data?.title || null,
    description: bio?.data?.bio || null,
  }
}

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const portfolio = await getPortfolio(username)
  if (!portfolio) notFound()

  const { name, title, description } = extractBio(portfolio.tiles ?? [])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: name || portfolio.display_name || username,
      description: description || undefined,
      jobTitle: title || undefined,
      url: `${BASE_URL}/${username}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PortfolioPageClient portfolio={portfolio} />
    </>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const portfolio = await getPortfolio(username)
  if (!portfolio) return { title: 'Not found' }

  const { name, title, description } = extractBio(portfolio.tiles ?? [])
  const displayName = name || portfolio.display_name || username
  const pageTitle = title ? `${displayName} — ${title}` : displayName
  const pageDesc = description || `${displayName}'s bento portfolio on Tiledrop.`
  const url = `${BASE_URL}/${username}`

  return {
    title: `${pageTitle} | Tiledrop`,
    description: pageDesc,
    openGraph: {
      type: 'profile',
      url,
      title: pageTitle,
      description: pageDesc,
      siteName: 'Tiledrop',
    },
    twitter: {
      card: 'summary',
      title: pageTitle,
      description: pageDesc,
    },
    alternates: { canonical: url },
  }
}

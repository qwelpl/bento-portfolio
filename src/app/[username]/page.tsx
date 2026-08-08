import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PortfolioPageClient from './PortfolioPageClient'

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const supabase = await createClient()

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('*')
    .eq('username', username.toLowerCase())
    .single()

  if (!portfolio) notFound()

  return <PortfolioPageClient portfolio={portfolio} />
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  return { title: `${username} | bento-folio` }
}

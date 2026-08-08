import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditPageClient from './EditPageClient'

export default async function EditPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!portfolio) {
    const username = user.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9]/g, '') ?? user.id.slice(0, 8)
    const { data: created } = await supabase
      .from('portfolios')
      .insert({
        user_id: user.id,
        username,
        display_name: username,
        tiles: [],
        layout: [],
        theme: 'dark',
        accent: '#7c3aed',
      })
      .select()
      .single()

    if (!created) redirect('/dashboard')
    return <EditPageClient portfolio={created} />
  }

  return <EditPageClient portfolio={portfolio} />
}

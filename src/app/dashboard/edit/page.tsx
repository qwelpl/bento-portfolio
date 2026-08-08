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

  if (!portfolio) redirect('/dashboard')

  return <EditPageClient portfolio={portfolio} />
}

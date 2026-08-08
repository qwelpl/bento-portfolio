'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateUsername(newUsername: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not authenticated' }

  // Check availability
  const { data: existing } = await supabase
    .from('portfolios')
    .select('user_id')
    .eq('username', newUsername)
    .single()

  if (existing) return { ok: false, error: 'That handle is already taken' }

  const { error } = await supabase
    .from('portfolios')
    .update({ username: newUsername })
    .eq('user_id', user.id)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/dashboard')
  return { ok: true }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('u')
  if (!username) return NextResponse.json({ available: false })

  const supabase = await createClient()
  const { data } = await supabase
    .from('portfolios')
    .select('user_id')
    .eq('username', username)
    .single()

  return NextResponse.json({ available: !data })
}

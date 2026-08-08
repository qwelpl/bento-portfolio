import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params

  // Seconds until next midnight PST (UTC-8)
  const now = new Date()
  const pstNow = new Date(now.getTime() - 8 * 3600 * 1000)
  const nextMidnightPST = new Date(pstNow)
  nextMidnightPST.setUTCHours(24, 0, 0, 0)
  const secondsUntilMidnight = Math.ceil(
    (nextMidnightPST.getTime() + 8 * 3600 * 1000 - now.getTime()) / 1000
  )

  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
      { next: { revalidate: secondsUntilMidnight } }
    )
    if (!res.ok) throw new Error('not found')
    const data = await res.json()

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': `public, s-maxage=${secondsUntilMidnight}, stale-while-revalidate=60`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'GitHub user not found' }, { status: 404 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

// Seconds until next midnight PST (UTC-8)
function secondsUntilMidnightPST(): number {
  const now = new Date()
  const pstNow = new Date(now.getTime() - 8 * 3600 * 1000)
  const nextMidnight = new Date(pstNow)
  nextMidnight.setUTCHours(24, 0, 0, 0)
  return Math.ceil((nextMidnight.getTime() + 8 * 3600 * 1000 - now.getTime()) / 1000)
}

async function ghSearch(query: string): Promise<number> {
  const res = await fetch(
    `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=1`,
    { headers: { Accept: 'application/vnd.github+json' } }
  )
  if (!res.ok) return 0
  const d = await res.json()
  return d.total_count ?? 0
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  const ttl = secondsUntilMidnightPST()
  const opts = { next: { revalidate: ttl } }

  try {
    const [heatmap, prs, issues] = await Promise.all([
      fetch(
        `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
        opts
      ).then(r => { if (!r.ok) throw new Error('not found'); return r.json() }),
      ghSearch(`author:${username} type:pr`),
      ghSearch(`author:${username} type:issue`),
    ])

    return NextResponse.json(
      { ...heatmap, prs, issues },
      { headers: { 'Cache-Control': `public, s-maxage=${ttl}, stale-while-revalidate=60` } }
    )
  } catch {
    return NextResponse.json({ error: 'GitHub user not found' }, { status: 404 })
  }
}

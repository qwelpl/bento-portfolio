import { NextRequest, NextResponse } from 'next/server'

function countToLevel(n: number) {
  if (n === 0) return 0
  if (n <= 3) return 1
  if (n <= 6) return 2
  if (n <= 9) return 3
  return 4
}

async function glCount(path: string): Promise<number> {
  const res = await fetch(`https://gitlab.com/api/v4/${path}&per_page=1`, {
    headers: { 'Content-Type': 'application/json' },
  })
  return parseInt(res.headers.get('x-total') ?? '0', 10)
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params

  try {
    const [calendar, mrs, issues] = await Promise.all([
      fetch(`https://gitlab.com/users/${encodeURIComponent(username)}/calendar.json`, {
        next: { revalidate: 3600 },
      }).then(r => { if (!r.ok) throw new Error('not found'); return r.json() }),
      glCount(`merge_requests?author_username=${encodeURIComponent(username)}&scope=all&state=all`),
      glCount(`issues?author_username=${encodeURIComponent(username)}&scope=all&state=all`),
    ])

    const contributions = Object.entries(calendar as Record<string, number>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count, level: countToLevel(count) }))

    const lastYear = contributions
      .filter(c => new Date(c.date) >= new Date(Date.now() - 365 * 86400 * 1000))
      .reduce((s, c) => s + c.count, 0)

    return NextResponse.json(
      { contributions, total: { lastYear }, prs: mrs, issues },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60' } }
    )
  } catch {
    return NextResponse.json({ error: 'GitLab user not found' }, { status: 404 })
  }
}

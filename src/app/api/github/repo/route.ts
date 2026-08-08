import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')
  if (!q) return NextResponse.json({ error: 'missing q' }, { status: 400 })

  try {
    const res = await fetch(`https://api.github.com/repos/${q}`, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error('not found')
    const data = await res.json()
    return NextResponse.json({
      name: data.name,
      full_name: data.full_name,
      description: data.description,
      stargazers_count: data.stargazers_count,
      forks_count: data.forks_count,
      language: data.language,
      html_url: data.html_url,
      topics: data.topics ?? [],
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60' },
    })
  } catch {
    return NextResponse.json({ error: 'Repo not found' }, { status: 404 })
  }
}

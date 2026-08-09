import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')
  if (!q) return NextResponse.json({ error: 'missing q' }, { status: 400 })

  try {
    const encoded = encodeURIComponent(q)
    const res = await fetch(`https://gitlab.com/api/v4/projects/${encoded}`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error('not found')
    const data = await res.json()

    return NextResponse.json({
      name: data.name,
      full_name: data.path_with_namespace,
      description: data.description,
      stargazers_count: data.star_count,
      forks_count: data.forks_count,
      language: null,
      html_url: data.web_url,
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60' },
    })
  } catch {
    return NextResponse.json({ error: 'Repo not found' }, { status: 404 })
  }
}

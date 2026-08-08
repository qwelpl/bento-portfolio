import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="max-w-lg w-full text-center flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold text-white tracking-tight">bento-folio</h1>
          <p style={{ color: 'var(--text-muted)' }} className="text-lg">
            Build a sleek bento-style portfolio and share it with one link.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mx-auto w-full max-w-sm">
          <div className="bento-tile p-4 flex flex-col gap-1">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>drag and drop</span>
            <span className="text-sm text-white">arrange tiles your way</span>
          </div>
          <div className="bento-tile p-4 flex flex-col gap-1">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>shareable</span>
            <span className="text-sm text-white">one link, always live</span>
          </div>
          <div className="bento-tile p-4 flex flex-col gap-1">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>tiles</span>
            <span className="text-sm text-white">bio, links, socials and more</span>
          </div>
          <div className="bento-tile p-4 flex flex-col gap-1">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>yours</span>
            <span className="text-sm text-white">clean dark aesthetic</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 items-center">
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-80"
            style={{ background: 'var(--accent)' }}
          >
            Get started
          </Link>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Already have one?{' '}
            <Link href="/login" className="text-white hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  )
}

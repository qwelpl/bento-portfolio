import Link from 'next/link'

function FakeBioTile() {
  return (
    <div className="bento-tile p-5 flex flex-col justify-between h-full">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full flex-shrink-0" style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)' }} />
        <div className="flex flex-col gap-1">
          <span className="text-white font-semibold text-sm">Alex Rivera</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Design Engineer</span>
        </div>
      </div>
      <p className="text-xs leading-relaxed mt-3" style={{ color: '#888' }}>
        Building things at the intersection of design and code. Previously at Figma, now shipping my own stuff.
      </p>
    </div>
  )
}

function FakeHeatmap() {
  const cols = 18
  const rows = 7
  const levels = [0,0,0,1,0,2,1,0,3,2,1,0,2,3,4,2,1,0,
                  0,1,0,0,2,1,0,3,1,2,0,1,3,2,1,4,3,2,
                  1,0,2,1,0,0,1,2,3,1,0,2,1,0,2,3,2,1,
                  0,2,1,3,2,1,0,1,2,0,3,1,2,1,0,2,4,3,
                  1,0,0,2,1,3,2,0,1,2,1,0,3,2,1,0,2,1,
                  0,1,2,0,3,2,1,0,2,3,1,2,0,1,3,2,1,0,
                  2,1,0,1,2,0,3,2,1,0,2,1,3,2,0,1,2,3]
  const colors = ['#1e1e1e','#0e4429','#006d32','#26a641','#39d353']
  return (
    <div className="bento-tile p-4 flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>GitHub</span>
        <span className="text-sm font-medium text-white">alexrivera</span>
      </div>
      <div className="flex gap-[3px] flex-1 items-center">
        {Array.from({ length: cols }).map((_, c) => (
          <div key={c} className="flex flex-col gap-[3px]">
            {Array.from({ length: rows }).map((_, r) => (
              <div key={r} style={{ width: 9, height: 9, borderRadius: 2, background: colors[levels[c * rows + r] ?? 0] }} />
            ))}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 rounded-xl px-3 pt-2 pb-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        {[['847','contributions'],['34','pull requests'],['12','issues']].map(([v, l]) => (
          <div key={l} className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-white">{v}</span>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FakeSocialTile() {
  return (
    <div className="bento-tile p-5 flex flex-col gap-3 h-full">
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Find me on</span>
      {[
        { label: 'alexrivera', color: '#fff', icon: 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z' },
        { label: 'alex_builds', color: '#fff', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
      ].map(s => (
        <div key={s.label} className="flex items-center gap-3 text-sm" style={{ color: '#b0b0b0' }}>
          <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor"><path d={s.icon} /></svg>
          <span>{s.label}</span>
        </div>
      ))}
    </div>
  )
}

function FakeSkillsTile() {
  const skills = ['React','TypeScript','Figma','Rust','Node.js','CSS']
  return (
    <div className="bento-tile p-5 flex flex-col gap-3 h-full">
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Skills</span>
      <div className="flex flex-wrap gap-2">
        {skills.map(s => (
          <span key={s} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--surface-2)', color: '#b0b0b0', border: '1px solid var(--border)' }}>{s}</span>
        ))}
      </div>
    </div>
  )
}

function FakeLocationTile() {
  return (
    <div className="bento-tile p-5 flex flex-col justify-center gap-1 h-full">
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Based in</p>
      <div className="flex items-center gap-2 mt-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--text-muted)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
        <span className="text-base font-medium text-white">San Francisco, CA</span>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <span className="text-white font-semibold tracking-tight">tilespace</span>
        <Link href="/login" className="text-sm px-4 py-1.5 rounded-lg transition-opacity hover:opacity-80" style={{ background: 'var(--surface)', color: '#b0b0b0', border: '1px solid var(--border)' }}>
          Sign in
        </Link>
      </nav>

      {/* hero */}
      <section className="max-w-6xl mx-auto px-8 pt-16 pb-20 flex flex-col items-center text-center gap-6">
        <div className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
          Free to use
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight leading-tight max-w-2xl">
          Your vibe.<br />
          <span style={{ background: 'linear-gradient(135deg, #7c3aed, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            One grid.
          </span>
        </h1>
        <p className="text-lg max-w-md" style={{ color: 'var(--text-muted)' }}>
          Stop sending a boring resume link. Build a bento portfolio that actually shows who you are — drag, drop, share.
        </p>
        <div className="flex items-center gap-3 mt-2">
          <Link href="/login" className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-80" style={{ background: 'var(--accent)' }}>
            Build yours free
          </Link>
          <Link href="/login" className="px-6 py-3 rounded-xl text-sm font-medium transition-colors" style={{ color: '#b0b0b0', border: '1px solid var(--border)' }}>
            Sign in
          </Link>
        </div>
      </section>

      {/* fake portfolio preview */}
      <section className="max-w-5xl mx-auto px-8 pb-24">
        <div className="rounded-2xl overflow-hidden p-1" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 0 80px rgba(124,58,237,0.15)' }}>
          <div className="rounded-xl overflow-hidden p-4" style={{ background: 'var(--bg)' }}>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'auto auto' }}>
              <div style={{ gridColumn: 'span 2', gridRow: 'span 2', minHeight: 200 }}><FakeBioTile /></div>
              <div style={{ gridColumn: 'span 2', minHeight: 96 }}><FakeSkillsTile /></div>
              <div style={{ gridColumn: 'span 1', minHeight: 96 }}><FakeLocationTile /></div>
              <div style={{ gridColumn: 'span 1', gridRow: 'span 2', minHeight: 200 }}><FakeSocialTile /></div>
              <div style={{ gridColumn: 'span 2', gridRow: 'span 2', minHeight: 200 }}><FakeHeatmap /></div>
              <div style={{ gridColumn: 'span 1' }} />
            </div>
          </div>
        </div>
        <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>This is what your portfolio could look like</p>
      </section>

      {/* features */}
      <section className="max-w-5xl mx-auto px-8 pb-24 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: '⬡', title: 'Bento tiles', desc: 'Bio, GitHub, skills, links, location — each in its own draggable tile. Arrange them however you want.' },
          { icon: '⌁', title: 'GitHub built in', desc: 'Connect your username and your contribution heatmap, pull requests, and repos show up automatically.' },
          { icon: '⇗', title: 'One link', desc: 'Your portfolio lives at tilespace.vercel.app/yourname. Share it anywhere. Always up to date.' },
        ].map(f => (
          <div key={f.title} className="bento-tile p-6 flex flex-col gap-3">
            <span className="text-2xl">{f.icon}</span>
            <h3 className="text-white font-semibold text-sm">{f.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* cta */}
      <section className="max-w-5xl mx-auto px-8 pb-24">
        <div className="bento-tile p-12 flex flex-col items-center text-center gap-6" style={{ background: 'var(--surface)' }}>
          <h2 className="text-3xl font-bold text-white tracking-tight">Ready to stand out?</h2>
          <p style={{ color: 'var(--text-muted)' }}>Takes 5 minutes. No templates. No nonsense.</p>
          <Link href="/login" className="px-8 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-80" style={{ background: 'var(--accent)' }}>
            Get started free
          </Link>
        </div>
      </section>

      {/* footer */}
      <footer className="text-center pb-8 text-xs" style={{ color: 'var(--text-muted)' }}>
        tilespace
      </footer>
    </main>
  )
}

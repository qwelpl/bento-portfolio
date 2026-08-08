'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const router = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()

    if (mode === 'signup') {
      const { error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) { setError(signUpError.message); setLoading(false); return }

      // create portfolio row
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('portfolios').insert({
          user_id: user.id,
          username: username.toLowerCase().trim(),
          display_name: username,
          tiles: [],
          layout: [],
          theme: 'dark',
          accent: '#7c3aed',
        })
      }
      setSent(true)
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) { setError(signInError.message); setLoading(false); return }
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const inputStyle = {
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  }

  if (sent) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center flex flex-col gap-4">
          <h1 className="text-xl font-semibold text-white">Check your email</h1>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">
            We sent a confirmation link to <strong className="text-white">{email}</strong>.
            Click it to activate your account, then come back and sign in.
          </p>
          <button onClick={() => { setSent(false); setMode('login') }} className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>
            Back to sign in
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-sm w-full flex flex-col gap-6">
        <div>
          <Link href="/" className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>bento-folio</Link>
          <h1 className="text-2xl font-semibold text-white mt-3">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </h1>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          {mode === 'signup' && (
            <input
              type="text"
              required
              placeholder="Username (e.g. janedoe)"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-purple-500"
              style={inputStyle}
            />
          )}
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-purple-500"
            style={inputStyle}
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-purple-500"
            style={inputStyle}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50 mt-1"
            style={{ background: 'var(--accent)' }}
          >
            {loading ? '...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have one? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
            className="text-white hover:underline"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </main>
  )
}

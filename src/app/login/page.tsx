'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (!error) setSent(true)
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-[360px] text-center">
        <div className="text-6xl mb-6">🧠</div>
        <h1 className="text-2xl font-extrabold tracking-tight mb-2">Segundo Cérebro</h1>
        <p className="text-t3 text-sm mb-8">
          Tudo sobre você num só lugar.
        </p>

        {sent ? (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="text-3xl mb-3">✉️</div>
            <p className="text-sm text-t2">
              Link enviado para <strong className="text-t1">{email}</strong>.
              Confira seu email e clique no link.
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full bg-card2 border-none rounded-xl px-4 py-3 text-sm text-t1 outline-none focus:ring-2 focus:ring-acc/20 placeholder:text-t3"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-acc text-white rounded-xl py-3 text-sm font-semibold transition-transform active:scale-[0.97] disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Entrar com Magic Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import api from '../../lib/api'
import { setToken, setUser } from '../../lib/auth'
import { useLocale } from '../../hooks/useLocale'

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLocale()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const { data } = await api.post('/auth/login', form)
      setToken(data.token); setUser(data.user)
      router.push('/dashboard')
    } catch (err) { setError(err.response?.data?.error || t('errors.login_failed')) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,8,35,0.04) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-10%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,8,35,0.03) 0%, transparent 70%)',
        }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="mb-4 p-3 rounded-2xl" style={{
            background: 'var(--surface)',
            boxShadow: '0 8px 32px rgba(0,8,35,0.10)',
            border: '1px solid var(--border)',
          }}>
            <Image
              src="/growl-icons/growl-group-icon.png"
              alt="Growl"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>Growl</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Business Operating System</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border p-8" style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
          boxShadow: '0 4px 24px rgba(0,8,35,0.07)',
        }}>
          <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>{t('auth.sign_in_heading')}</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Sign in to your Growl workspace</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                {t('auth.email_label')}
              </label>
              <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder={t('auth.email_placeholder')}
                className="w-full rounded-xl px-4 py-3 text-sm placeholder-slate-400 focus:outline-none transition"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                onFocus={e => e.target.style.borderColor = 'var(--brand-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                {t('auth.password_label')}
              </label>
              <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 text-sm placeholder-slate-400 focus:outline-none transition"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                onFocus={e => e.target.style.borderColor = 'var(--brand-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-50 hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, #000823, #0a1540)',
                boxShadow: '0 4px 20px rgba(0,8,35,0.25)',
              }}>
              {loading ? t('auth.signing_in') : t('auth.sign_in_btn')}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Growl Group. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

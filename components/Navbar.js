'use client'
import { Sun, Moon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import useTheme from '../hooks/useTheme'
import { useLocale } from '../hooks/useLocale'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="p-2 rounded-lg transition-colors"
      style={{ color: 'var(--text-secondary)', background: 'var(--surface)' }}
    >
      {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  )
}

function LangToggle() {
  const { locale, setLocale } = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const switchTo = (newLocale) => {
    setLocale(newLocale)
    router.push(`/${newLocale}${pathname}`)
  }

  return (
    <div
      className="flex items-center rounded-xl p-0.5 border text-xs font-semibold"
      style={{
        borderColor: 'var(--border)',
        background: 'var(--surface-2)',
      }}
    >
      {['en', 'ar'].map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className="px-2.5 py-1 rounded-lg transition-all"
          style={
            locale === l
              ? {
                  background: 'var(--brand)',
                  color: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,8,35,0.12)',
                }
              : { background: 'transparent', color: 'var(--text-3)' }
          }
        >
          {l === 'en' ? 'English' : 'العربية'}
        </button>
      ))}
    </div>
  )
}

export default function Navbar({ title, subtitle, action }) {
  return (
    <header className="flex items-center justify-between mb-8 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
      <div>
        <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--brand)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm font-medium" style={{ color: 'var(--text-3)' }}>
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <LangToggle />
        {action && <div>{action}</div>}
      </div>
    </header>
  )
}

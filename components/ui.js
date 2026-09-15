'use client'
import { useLocale } from '../hooks/useLocale'

/* ══════════════════════════════════════════════════════════════
   GROWL UI COMPONENTS — Professional Light Design System
   ══════════════════════════════════════════════════════════════ */

// ── Badge ────────────────────────────────────────────────────
const BADGE_MAP = {
  LEAD:           { bg: '#F0F0F8', color: '#5B5B80',  label: 'Lead' },
  QUALIFIED:      { bg: '#EFF6FF', color: '#1D4ED8',  label: 'Qualified' },
  PROPOSAL_SENT:  { bg: '#F5F3FF', color: '#6D28D9',  label: 'Proposal' },
  NEGOTIATION:    { bg: '#FFFBEB', color: '#B45309',  label: 'Negotiation' },
  WON:            { bg: '#ECFDF5', color: '#065F46',  label: 'Won' },
  LOST:           { bg: '#FEF2F2', color: '#991B1B',  label: 'Lost' },
  ACTIVE:         { bg: '#EFF6FF', color: '#1D4ED8',  label: 'Active' },
  INACTIVE:       { bg: '#F9FAFB', color: '#6B7280',  label: 'Inactive' },
  IN_PROGRESS:    { bg: '#EFF6FF', color: '#1D4ED8',  label: 'In Progress' },
  PLANNING:       { bg: '#F5F3FF', color: '#6D28D9',  label: 'Planning' },
  COMPLETED:      { bg: '#ECFDF5', color: '#065F46',  label: 'Completed' },
  ON_HOLD:        { bg: '#FFF7ED', color: '#9A3412',  label: 'On Hold' },
  REVIEW:         { bg: '#FFFBEB', color: '#B45309',  label: 'Review' },
  SENT:           { bg: '#EFF6FF', color: '#1D4ED8',  label: 'Sent' },
  PAID:           { bg: '#ECFDF5', color: '#065F46',  label: 'Paid' },
  OVERDUE:        { bg: '#FEF2F2', color: '#991B1B',  label: 'Overdue' },
  TODO:           { bg: '#F9FAFB', color: '#4B5563',  label: 'To Do' },
  DONE:           { bg: '#ECFDF5', color: '#065F46',  label: 'Done' },
  IN_REVIEW:      { bg: '#FFFBEB', color: '#B45309',  label: 'In Review' },
  HIGH:           { bg: '#FEF2F2', color: '#991B1B',  label: 'High' },
  MEDIUM:         { bg: '#FFFBEB', color: '#B45309',  label: 'Medium' },
  LOW:            { bg: '#ECFDF5', color: '#065F46',  label: 'Low' },
}

export function Badge({ value }) {
  const cfg = BADGE_MAP[value] || { bg: '#F0F0F8', color: '#5B5B80', label: value }
  const label = cfg.label || (value?.replace(/_/g, ' ') || '—')
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 10px',
      borderRadius: '100px',
      fontSize: '11px',
      fontWeight: 600,
      background: cfg.bg,
      color: cfg.color,
      letterSpacing: '0.1px',
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}

// ── Stat Card ─────────────────────────────────────────────────
const STAT_MAP = {
  sky:     { icon_bg: '#EFF6FF', icon_color: '#1D4ED8', accent: '#2563eb' },
  emerald: { icon_bg: '#ECFDF5', icon_color: '#065F46', accent: '#059669' },
  violet:  { icon_bg: '#F5F3FF', icon_color: '#5B21B6', accent: '#7c3aed' },
  amber:   { icon_bg: '#FFFBEB', icon_color: '#92400E', accent: '#d97706' },
  red:     { icon_bg: '#FEF2F2', icon_color: '#991B1B', accent: '#dc2626' },
  brand:   { icon_bg: '#F0F0F8', icon_color: '#000823', accent: '#000823' },
}

export function StatCard({ label, value, icon, color = 'sky', sub, trend }) {
  const c = STAT_MAP[color] || STAT_MAP.sky
  return (
    <div className="animate-fade-up stat-hover" style={{
      background: '#ffffff',
      border: '1px solid #E8E8EE',
      borderRadius: '14px',
      padding: '20px',
      boxShadow: '0 1px 4px rgba(10,10,20,0.05)',
      cursor: 'default',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <p style={{ fontSize: '12px', fontWeight: 600, color: '#717188', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
        {icon && (
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: c.icon_bg, color: c.icon_color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {icon}
          </div>
        )}
      </div>
      <p style={{ fontSize: '26px', fontWeight: 800, color: '#0A0A14', letterSpacing: '-0.8px', lineHeight: 1.1 }}>{value}</p>
      {sub && <p style={{ fontSize: '11.5px', color: '#A0A0B8', marginTop: 6, fontWeight: 500 }}>{sub}</p>}
      {trend != null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: trend >= 0 ? '#059669' : '#dc2626' }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span style={{ fontSize: '11px', color: '#A0A0B8' }}>vs last month</span>
        </div>
      )}
    </div>
  )
}

// ── Mini Stat (used in dashboard sections) ────────────────────
export function MiniStat({ label, value, color }) {
  return (
    <div className="animate-fade-up stat-hover" style={{
      background: '#ffffff',
      border: '1px solid #E8E8EE',
      borderRadius: '12px',
      padding: '16px',
      textAlign: 'center',
      boxShadow: '0 1px 3px rgba(10,10,20,0.04)',
    }}>
      <p style={{ fontSize: '22px', fontWeight: 800, color: color || '#0A0A14', letterSpacing: '-0.5px', lineHeight: 1.1 }}>{value}</p>
      <p style={{ fontSize: '11px', color: '#A0A0B8', marginTop: 5, fontWeight: 500, letterSpacing: '0.2px' }}>{label}</p>
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="g-modal-backdrop" onClick={onClose}>
      <div className="g-modal" onClick={e => e.stopPropagation()}>
        <div className="g-modal-header">
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0A0A14', letterSpacing: '-0.3px' }}>{title}</h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#A0A0B8', padding: 6, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F0F0F5'; e.currentTarget.style.color = '#000823' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#A0A0B8' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div className="g-modal-body">{children}</div>
      </div>
    </div>
  )
}

// ── Input ─────────────────────────────────────────────────────
export function Input({ label, error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: '12px', fontWeight: 600, color: '#3D3D52', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          width: '100%',
          borderRadius: 10,
          border: `1px solid ${error ? '#fca5a5' : '#E8E8EE'}`,
          background: '#ffffff',
          color: '#0A0A14',
          fontSize: 13,
          padding: '10px 14px',
          outline: 'none',
          fontFamily: 'inherit',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          ...props.style,
        }}
        onFocus={e => {
          e.target.style.borderColor = '#000823'
          e.target.style.boxShadow = '0 0 0 3px rgba(0,8,35,0.07)'
        }}
        onBlur={e => {
          e.target.style.borderColor = error ? '#fca5a5' : '#E8E8EE'
          e.target.style.boxShadow = 'none'
        }}
      />
      {error && <p style={{ fontSize: 11, color: '#dc2626', fontWeight: 500 }}>{error}</p>}
    </div>
  )
}

// ── Select ────────────────────────────────────────────────────
export function Select({ label, children, error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: '12px', fontWeight: 600, color: '#3D3D52', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </label>
      )}
      <select
        {...props}
        style={{
          width: '100%',
          borderRadius: 10,
          border: `1px solid ${error ? '#fca5a5' : '#E8E8EE'}`,
          background: '#ffffff',
          color: '#0A0A14',
          fontSize: 13,
          padding: '10px 14px',
          outline: 'none',
          fontFamily: 'inherit',
          cursor: 'pointer',
          ...props.style,
        }}
      >
        {children}
      </select>
      {error && <p style={{ fontSize: 11, color: '#dc2626', fontWeight: 500 }}>{error}</p>}
    </div>
  )
}

// ── Button ────────────────────────────────────────────────────
export function Btn({ children, variant = 'primary', size = 'md', loading, ...props }) {
  const styles = {
    primary: {
      background: 'linear-gradient(135deg, #000823, #0a1540)',
      color: '#F8F8F8',
      border: 'none',
      boxShadow: '0 2px 10px rgba(0,8,35,0.2)',
    },
    secondary: {
      background: '#F0F0F8',
      color: '#000823',
      border: '1px solid #E8E8EE',
    },
    danger: {
      background: '#FEF2F2',
      color: '#991B1B',
      border: '1px solid #FECACA',
    },
    ghost: {
      background: 'transparent',
      color: '#3D3D52',
      border: '1px solid #E8E8EE',
    },
    success: {
      background: '#ECFDF5',
      color: '#065F46',
      border: '1px solid #A7F3D0',
    },
  }
  const sizes = {
    xs:  { padding: '5px 12px',  fontSize: 11, borderRadius: 7 },
    sm:  { padding: '7px 14px',  fontSize: 12, borderRadius: 9 },
    md:  { padding: '9px 18px',  fontSize: 13, borderRadius: 10 },
    lg:  { padding: '12px 24px', fontSize: 14, borderRadius: 11 },
  }
  const s = styles[variant] || styles.primary
  const sz = sizes[size] || sizes.md

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontWeight: 600,
        fontFamily: 'inherit',
        cursor: props.disabled || loading ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.5 : 1,
        transition: 'all 0.18s ease',
        ...s,
        ...sz,
        ...props.style,
      }}
      onMouseEnter={e => {
        if (!props.disabled && !loading) {
          e.currentTarget.style.opacity = '0.88'
          e.currentTarget.style.transform = 'translateY(-1px)'
          if (variant === 'primary') e.currentTarget.style.boxShadow = '0 5px 18px rgba(0,8,35,0.28)'
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.opacity = '1'
        e.currentTarget.style.transform = 'translateY(0)'
        if (variant === 'primary') e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,8,35,0.2)'
      }}
    >
      {loading && (
        <svg style={{ animation: 'spin 0.6s linear infinite', width: 14, height: 14 }} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round"/>
        </svg>
      )}
      {children}
    </button>
  )
}

// ── Empty State ───────────────────────────────────────────────
export function Empty({ message, icon }) {
  const { t } = useLocale()
  return (
    <div style={{ textAlign: 'center', padding: '56px 24px' }} className="animate-fade-up">
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: '#F0F0F8', margin: '0 auto 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon || (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A0A0B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
            <polyline points="13,2 13,9 20,9"/>
          </svg>
        )}
      </div>
      <p style={{ fontSize: 14, fontWeight: 600, color: '#3D3D52', marginBottom: 4 }}>Nothing here yet</p>
      <p style={{ fontSize: 13, color: '#A0A0B8' }}>{message ?? t('common.no_data')}</p>
    </div>
  )
}

// ── Spinner ───────────────────────────────────────────────────
export function Spinner({ size = 32, text }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', gap: 14 }}>
      <div style={{
        width: size, height: size,
        border: '2.5px solid #E8E8EE',
        borderTop: '2.5px solid #000823',
        borderRadius: '50%',
        animation: 'spin 0.65s linear infinite',
      }} />
      {text && <p style={{ fontSize: 13, color: '#A0A0B8', fontWeight: 500 }}>{text}</p>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ── Section Header ────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }} className="animate-fade-up">
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0A0A14', letterSpacing: '-0.2px', marginBottom: subtitle ? 2 : 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 12, color: '#A0A0B8', fontWeight: 500 }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

// ── Divider ───────────────────────────────────────────────────
export function Divider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0' }}>
      <div style={{ flex: 1, height: 1, background: '#E8E8EE' }} />
      {label && <span style={{ fontSize: 11, color: '#A0A0B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>}
      {label && <div style={{ flex: 1, height: 1, background: '#E8E8EE' }} />}
    </div>
  )
}

// ── Info Row (key-value display) ──────────────────────────────
export function InfoRow({ label, value, last }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: last ? 'none' : '1px solid #F0F0F5',
    }}>
      <span style={{ fontSize: 12, color: '#A0A0B8', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13, color: '#0A0A14', fontWeight: 600 }}>{value ?? '—'}</span>
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { StatCard, MiniStat, Badge, Spinner } from '../../components/ui'
import Navbar from '../../components/Navbar'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts'
import { useLocale } from '../../hooks/useLocale'

const fmtCompact = (n) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(n || 0)
const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(n)

const STAGE_COLORS = {
  LEAD: '#A0A0B8',
  QUALIFIED: '#2563eb',
  PROPOSAL_SENT: '#7c3aed',
  NEGOTIATION: '#d97706',
  WON: '#059669',
  LOST: '#dc2626',
}

// Custom recharts tooltip
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E8E8EE',
      borderRadius: 10,
      padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(10,10,20,0.10)',
      fontSize: 12,
    }}>
      <p style={{ color: '#717188', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: 10 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || '#000823', fontWeight: 700, fontSize: 14 }}>
          {typeof p.value === 'number' && p.name === 'revenue' ? fmt(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { t } = useLocale()
  const [crmData, setCrmData] = useState(null)
  const [opsData, setOpsData] = useState(null)
  const [mktData, setMktData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/summary').catch(() => ({ data: null })),
      api.get('/dashboard/projects-summary').catch(() => ({ data: null })),
      api.get('/campaigns/summary').catch(() => ({ data: null })),
    ]).then(([crm, ops, mkt]) => {
      setCrmData(crm.data)
      setOpsData(ops.data)
      setMktData(mkt.data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner text="Loading dashboard…" />

  const { overview, revenue, leadsByStage, recentLeads } = crmData || {}
  const opsOverview = opsData?.overview
  const mkt = mktData?.overview

  return (
    <div className="animate-fade-up">
      <Navbar
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
      />

      {/* ── CRM Stats ─────────────────────────────────────── */}
      <div style={{ marginBottom: 8 }}>
        <p className="g-section-label" style={{ marginBottom: 12 }}>{t('dashboard.sales_crm')}</p>
        <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
          <StatCard
            label={t('dashboard.total_leads')}
            value={overview?.totalLeads ?? 0}
            color="sky"
            sub={`${overview?.leadsThisMonth ?? 0} ${t('common.this_month')}`}
            icon={<i className="fa-solid fa-user-plus" style={{ fontSize: 14 }} />}
          />
          <StatCard
            label={t('dashboard.active_deals')}
            value={overview?.activeDeals ?? 0}
            color="violet"
            icon={<i className="fa-solid fa-chart-column" style={{ fontSize: 14 }} />}
          />
          <StatCard
            label={t('dashboard.won_revenue')}
            value={fmt(revenue?.wonRevenue ?? 0)}
            color="emerald"
            sub={`${revenue?.wonDealsCount ?? 0} ${t('dashboard.deals_suffix')}`}
            icon={<i className="fa-solid fa-circle-dollar-to-slot" style={{ fontSize: 14 }} />}
          />
          <StatCard
            label={t('dashboard.win_rate')}
            value={`${overview?.wonRate ?? 0}%`}
            color="amber"
            sub={`${t('dashboard.pipeline')}: ${fmt(revenue?.totalPipeline ?? 0)}`}
            icon={<i className="fa-solid fa-trophy" style={{ fontSize: 14 }} />}
          />
        </div>
      </div>

      {/* ── Operations ────────────────────────────────────── */}
      {opsOverview && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <p className="g-section-label">{t('dashboard.operations')}</p>
            <Link href="/dashboard/projects" className="g-link">
              {t('dashboard.full_ops')}
              <i className="fa-solid fa-arrow-right" style={{ fontSize: 10 }} />
            </Link>
          </div>
          <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
            <MiniStat label={t('dashboard.active_projects')}  value={opsOverview.activeProjects}     color="#2563eb" />
            <MiniStat label={t('dashboard.completed')}        value={opsOverview.completedProjects}  color="#059669" />
            <MiniStat label={t('dashboard.task_completion')}  value={`${opsOverview.taskCompletionRate}%`} color="#7c3aed" />
            <MiniStat label={t('dashboard.overdue_tasks')}    value={opsOverview.overdueTasks}        color={opsOverview.overdueTasks > 0 ? '#dc2626' : '#A0A0B8'} />
          </div>
        </div>
      )}

      {/* ── Charts Row ────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>

        {/* Lead Pipeline Bar Chart */}
        <div style={{
          background: '#fff',
          border: '1px solid #E8E8EE',
          borderRadius: 16,
          padding: '22px 24px',
          boxShadow: '0 1px 4px rgba(10,10,20,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0A0A14', letterSpacing: '-0.2px' }}>{t('dashboard.lead_pipeline')}</h2>
              <p style={{ fontSize: 11.5, color: '#A0A0B8', marginTop: 2, fontWeight: 500 }}>Leads by stage</p>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-chart-bar" style={{ color: '#2563eb', fontSize: 13 }} />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={leadsByStage} barSize={22} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="stage"
                tick={{ fontSize: 9.5, fill: '#A0A0B8', fontWeight: 600 }}
                tickFormatter={s => s.replace('_', ' ')}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9.5, fill: '#A0A0B8' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(10,10,20,0.03)', radius: 6 }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {(leadsByStage || []).map((e, i) => (
                  <Cell key={i} fill={STAGE_COLORS[e.stage] || '#A0A0B8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Key Metrics */}
        <div style={{
          background: '#fff',
          border: '1px solid #E8E8EE',
          borderRadius: 16,
          padding: '22px 24px',
          boxShadow: '0 1px 4px rgba(10,10,20,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0A0A14', letterSpacing: '-0.2px' }}>{t('dashboard.key_metrics')}</h2>
              <p style={{ fontSize: 11.5, color: '#A0A0B8', marginTop: 2, fontWeight: 500 }}>Business overview</p>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-gauge-high" style={{ color: '#7c3aed', fontSize: 13 }} />
            </div>
          </div>
          <div>
            {[
              { label: t('dashboard.total_clients'),  value: overview?.totalClients ?? 0,   color: '#2563eb' },
              { label: t('dashboard.total_deals'),    value: overview?.totalDeals ?? 0,     color: '#7c3aed' },
              { label: t('dashboard.won_deals'),      value: revenue?.wonDealsCount ?? 0,   color: '#059669' },
              { label: t('dashboard.lost_deals'),     value: overview?.lostDeals ?? 0,      color: '#dc2626' },
              ...(opsOverview ? [
                { label: t('dashboard.total_projects'), value: opsOverview.totalProjects, color: '#0284c7' },
                { label: t('dashboard.avg_progress'),   value: `${opsOverview.avgProgress}%`, color: '#d97706' },
              ] : []),
            ].map((row, i, arr) => (
              <div key={row.label} className="tr-hover" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 10px',
                borderRadius: 8,
                borderBottom: i < arr.length - 1 ? '1px solid #F4F4F7' : 'none',
              }}>
                <span style={{ fontSize: 12.5, color: '#717188', fontWeight: 500 }}>{row.label}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Marketing Intelligence ────────────────────────── */}
      {mkt && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <p className="g-section-label">{t('dashboard.marketing_intelligence')}</p>
            <Link href="/marketing" className="g-link">
              {t('dashboard.all_campaigns')}
              <i className="fa-solid fa-arrow-right" style={{ fontSize: 10 }} />
            </Link>
          </div>

          <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 16 }}>
            {[
              { label: t('dashboard.active_campaigns'), value: mkt.activeCampaigns,              color: '#2563eb' },
              { label: t('dashboard.total_spend'),      value: fmt(mkt.totalSpent),              color: '#dc2626' },
              { label: t('dashboard.total_revenue'),    value: fmt(mkt.totalRevenue),            color: '#059669' },
              { label: t('dashboard.overall_roi'),      value: `${mkt.overallROI}%`,             color: mkt.overallROI >= 0 ? '#059669' : '#dc2626' },
              { label: t('dashboard.conversions'),      value: fmtCompact(mkt.totalConversions), color: '#7c3aed' },
            ].map(s => (
              <MiniStat key={s.label} label={s.label} value={s.value} color={s.color} />
            ))}
          </div>

          {mktData?.platforms && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {['META', 'GOOGLE'].map(p => {
                const pd = mktData.platforms[p]
                const roi = pd?.roi ?? 0
                return (
                  <div key={p} style={{
                    background: '#fff',
                    border: '1px solid #E8E8EE',
                    borderRadius: 14,
                    padding: '18px 20px',
                    boxShadow: '0 1px 3px rgba(10,10,20,0.04)',
                    transition: 'box-shadow 0.18s, transform 0.18s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(10,10,20,0.09)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(10,10,20,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: 8,
                          background: p === 'META' ? '#EFF6FF' : '#FEF2F2',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <i className={`fa-brands fa-${p === 'META' ? 'facebook' : 'google'}`} style={{ color: p === 'META' ? '#1877F2' : '#EA4335', fontSize: 13 }} />
                        </div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#0A0A14' }}>
                          {p === 'META' ? t('dashboard.meta_ads') : t('dashboard.google_ads')}
                        </p>
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 700,
                        padding: '3px 9px', borderRadius: 100,
                        background: roi >= 0 ? '#ECFDF5' : '#FEF2F2',
                        color: roi >= 0 ? '#065F46' : '#991B1B',
                      }}>
                        ROI {roi}%
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div style={{ padding: '10px', background: '#F8F8FB', borderRadius: 8 }}>
                        <p style={{ fontSize: 10.5, color: '#A0A0B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 4 }}>Spend</p>
                        <p style={{ fontSize: 15, fontWeight: 800, color: '#0A0A14' }}>{fmt(pd?.spend || 0)}</p>
                      </div>
                      <div style={{ padding: '10px', background: '#ECFDF5', borderRadius: 8 }}>
                        <p style={{ fontSize: 10.5, color: '#065F46', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 4 }}>Revenue</p>
                        <p style={{ fontSize: 15, fontWeight: 800, color: '#059669' }}>{fmt(pd?.revenue || 0)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Recent Leads ──────────────────────────────────── */}
      <div style={{
        background: '#fff',
        border: '1px solid #E8E8EE',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(10,10,20,0.05)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 22px',
          borderBottom: '1px solid #F4F4F7',
        }}>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0A0A14', letterSpacing: '-0.2px' }}>{t('dashboard.recent_leads')}</h2>
            <p style={{ fontSize: 11.5, color: '#A0A0B8', marginTop: 2, fontWeight: 500 }}>Latest activity</p>
          </div>
          <Link href="/leads" className="g-link">
            {t('dashboard.view_all')}
            <i className="fa-solid fa-arrow-right" style={{ fontSize: 10 }} />
          </Link>
        </div>

        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr auto auto',
          gap: 12,
          padding: '10px 22px',
          background: '#F8F8FB',
          borderBottom: '1px solid #F0F0F5',
        }}>
          {['Lead', 'Contact', 'Stage', 'Value'].map(h => (
            <p key={h} style={{ fontSize: 10.5, fontWeight: 700, color: '#A0A0B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</p>
          ))}
        </div>

        <div>
          {(recentLeads || []).length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#A0A0B8', fontSize: 13 }}>
              No leads yet
            </div>
          ) : (
            (recentLeads || []).map((lead, i) => (
              <div key={lead.id} className="tr-hover animate-fade-up" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr auto auto',
                gap: 12,
                alignItems: 'center',
                padding: '12px 22px',
                borderBottom: i < recentLeads.length - 1 ? '1px solid #F4F4F7' : 'none',
                animationDelay: `${i * 40}ms`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: 'linear-gradient(135deg, #000823, #0a1540)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#F8F8F8', fontSize: 12, fontWeight: 800, flexShrink: 0,
                    letterSpacing: '0.5px',
                  }}>
                    {lead.name[0]}
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#0A0A14' }}>{lead.name}</p>
                </div>
                <p style={{ fontSize: 12, color: '#717188', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {lead.email || lead.phone || '—'}
                </p>
                <Badge value={lead.stage} />
                <p style={{ fontSize: 13, fontWeight: 700, color: '#059669', textAlign: 'right' }}>
                  {lead.deal_value ? fmt(lead.deal_value) : '—'}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'

const formatRevenue = (value) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
  return `$${value}`
}

export default function MetricsSummary({ competitors }) {
  if (!competitors || competitors.length === 0) return null

  const mainProduct = competitors.find((c) => c.is_main)
  const yourRevenue = mainProduct?.estimated_revenue ?? 0
  const topRevenue = Math.max(...competitors.map((c) => c.estimated_revenue))
  const gap = topRevenue - yourRevenue

  const metrics = [
    {
      label: 'Your Revenue',
      value: formatRevenue(yourRevenue) + '/mo',
      color: 'text-pixii-green',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      ),
    },
    {
      label: 'Top Competitor',
      value: formatRevenue(topRevenue) + '/mo',
      color: 'text-pixii-amber',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-3.27.972 6.003 6.003 0 01-3.27-.972" />
        </svg>
      ),
    },
    {
      label: 'Revenue Gap',
      value: gap > 0 ? `-${formatRevenue(gap)}/mo` : '$0',
      color: gap > 0 ? 'text-pixii-red' : 'text-pixii-green',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-3L16.5 18m0 0L12 13.5m4.5 4.5V4.5" />
        </svg>
      ),
    },
    {
      label: 'Market Size',
      value: formatRevenue(competitors.reduce((sum, c) => sum + c.estimated_revenue, 0)) + '/mo',
      color: 'text-pixii-text',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          className="glass rounded-card p-4 card-hover"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.35 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className={`${m.color} opacity-60`}>{m.icon}</div>
            <span className="text-xs text-pixii-muted font-medium">{m.label}</span>
          </div>
          <p className={`text-xl font-bold font-mono ${m.color}`}>{m.value}</p>
        </motion.div>
      ))}
    </div>
  )
}

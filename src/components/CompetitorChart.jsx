import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const formatRevenue = (value) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
  return `$${value}`
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="glass rounded-card p-4 shadow-xl min-w-[200px]">
      <p className="text-sm font-semibold text-pixii-text mb-2">{d.name}</p>
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-pixii-muted">Price</span>
          <span className="text-pixii-text font-mono">${d.price?.toFixed(2) ?? 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-pixii-muted">Reviews</span>
          <span className="text-pixii-text font-mono">{d.reviews?.toLocaleString() ?? 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-pixii-muted">Revenue</span>
          <span className="text-pixii-green font-mono font-semibold">
            {formatRevenue(d.estimated_revenue)}/mo
          </span>
        </div>
        {d.is_main && (
          <div className="pt-1.5 mt-1.5 border-t border-pixii-border/50">
            <span className="text-pixii-green text-[10px] font-semibold uppercase tracking-wider">Your Listing</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CompetitorChart({ competitors = [] }) {
  if (!competitors.length) return null
  const sorted = [...competitors].sort((a, b) => (b.estimated_revenue || 0) - (a.estimated_revenue || 0))

  return (
    <div className="glass rounded-card overflow-hidden h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-pixii-border/30 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-pixii-text">Competitor Revenue Map</h2>
          <p className="text-xs text-pixii-muted mt-0.5">Estimated monthly revenue (BSR model)</p>
        </div>
        <span className="text-[10px] font-mono text-pixii-muted bg-pixii-elevated px-2 py-1 rounded">
          {competitors.length} listings
        </span>
      </div>

      {/* Chart */}
      <div className="p-5">
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={sorted} margin={{ top: 5, right: 5, bottom: 60, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3F3F46" strokeOpacity={0.3} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#A1A1AA', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#3F3F46', strokeOpacity: 0.3 }}
              angle={-35}
              textAnchor="end"
              height={70}
              interval={0}
            />
            <YAxis
              tickFormatter={formatRevenue}
              tick={{ fill: '#A1A1AA', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(110, 231, 183, 0.05)' }} />
            <Bar dataKey="estimated_revenue" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {sorted.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.is_main ? '#6EE7B7' : '#3F3F46'}
                  fillOpacity={entry.is_main ? 1 : 0.7}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

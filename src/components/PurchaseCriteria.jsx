import { motion } from 'framer-motion'

export default function PurchaseCriteria({ criteria }) {
  if (!criteria || criteria.length === 0) return null

  return (
    <div className="glass rounded-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-pixii-border/30">
        <h2 className="text-sm font-semibold text-pixii-text">Purchase Criteria</h2>
        <p className="text-xs text-pixii-muted mt-0.5">Top drivers from customer reviews</p>
      </div>

      {/* Criteria List */}
      <div className="p-5 space-y-4">
        {criteria.map((item, index) => {
          const isPositive = item.sentiment === 'positive'
          const barColor = isPositive ? 'bg-pixii-green' : 'bg-pixii-red/70'
          const dotColor = isPositive ? 'bg-pixii-green' : 'bg-pixii-red'
          const textColor = isPositive ? 'text-pixii-green' : 'text-pixii-red'

          return (
            <div key={item.topic} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
                  <span className="text-sm text-pixii-text/90 truncate">{item.topic}</span>
                </div>
                <span className={`text-xs font-mono ml-3 flex-shrink-0 ${textColor}`}>
                  {item.percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-1.5 rounded-full bg-pixii-border/30 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${barColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'

const formatMoney = (val) => {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`
  return `$${val}`
}

export default function ActionPanel({ actionResponse }) {
  if (!actionResponse) return null

  const action = actionResponse.action || 'No strategy generated.'
  const estimated_roi_dollars = actionResponse.estimated_roi_dollars || 0
  const estimated_roi_percentage = actionResponse.estimated_roi_percentage || 0

  return (
    <div className="glass rounded-card overflow-hidden relative">
      {/* Glow accent */}
      <div className="absolute -top-20 -right-20 w-52 h-52 bg-pixii-green/8 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="px-5 py-4 border-b border-pixii-border/30 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-pixii-green/15 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-pixii-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-pixii-text">Actionable Strategy</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 relative z-10">
        {/* Recommendation Text */}
        <p className="text-sm text-pixii-text/85 leading-relaxed mb-5">
          {action}
        </p>

        {/* ROI Card */}
        <div className="bg-pixii-bg/60 border border-pixii-border/40 rounded-input p-4">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-xs text-pixii-muted">Estimated Monthly Lift</span>
            <motion.span
              className="text-pixii-green font-mono text-xl font-bold"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            >
              +{formatMoney(estimated_roi_dollars)}/mo
            </motion.span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-[10px] text-pixii-muted/70">Conversion rate delta</span>
            <span className="text-pixii-green/70 font-mono text-xs">
              +{estimated_roi_percentage}%
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-pixii-border/30">
            <p className="text-[10px] text-pixii-muted/50 italic">
              BSR velocity × avg order value model. Results may vary.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          id="apply-fix-btn"
          onClick={() => {
            navigator.clipboard?.writeText(action).catch(() => {})
          }}
          className="mt-4 w-full h-11 rounded-input text-sm font-semibold text-pixii-bg bg-gradient-to-r from-pixii-green to-emerald-400 hover:brightness-110 hover:shadow-lg hover:shadow-pixii-green/20 transition-all duration-200 active:scale-[0.98]"
        >
          Copy Strategy to Clipboard
        </button>
      </div>
    </div>
  )
}

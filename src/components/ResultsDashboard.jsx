import { motion } from 'framer-motion'
import MetricsSummary from './MetricsSummary'
import CompetitorChart from './CompetitorChart'
import PurchaseCriteria from './PurchaseCriteria'
import ActionPanel from './ActionPanel'

export default function ResultsDashboard({ data, onReset }) {
  if (!data) return null

  const competitors = data.competitors || []
  const action_response = data.action_response || {}

  return (
    <div className="min-h-screen pb-12">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 glass border-b border-pixii-border/40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <h1 className="font-display text-lg font-bold tracking-tight">
            <span className="text-pixii-text">Pixii</span>
            <span className="text-pixii-green"> Engine</span>
          </h1>
          <button
            id="reset-btn"
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-input text-sm text-pixii-muted hover:text-pixii-text hover:bg-pixii-elevated/60 border border-pixii-border/50 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 14.652" />
            </svg>
            New Analysis
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6">
        {/* Metrics Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <MetricsSummary competitors={competitors} />
        </motion.div>

        {/* Main Grid: 60/40 */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Left Column — 60% */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <CompetitorChart competitors={competitors} />
          </motion.div>

          {/* Right Column — 40% */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <ActionPanel actionResponse={action_response} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <PurchaseCriteria criteria={action_response?.purchase_criteria || []} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'

const SAMPLE_URL = 'https://www.amazon.com/Pure-Encapsulations-Magnesium-Glycinate-Capsules/dp/B0058HWV9S'

export default function URLInput({ url, setUrl, onAnalyze }) {
  const isValidUrl = url && url.toLowerCase().includes('amazon.')

  const handleSampleData = () => {
    setUrl(SAMPLE_URL)
    // NOTE: Intentionally does NOT trigger analysis.
    // User must click "Analyze Live URL" separately.
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-pixii-green/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        className="relative z-10 max-w-2xl w-full text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <motion.div
          className="mb-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h1 className="font-display text-5xl md:text-6xl font-extrabold tracking-tight">
            <span className="text-pixii-text">Pixii</span>
            <span className="text-pixii-green"> Engine</span>
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-pixii-muted text-base md:text-lg mb-10 max-w-md mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          AI-powered Amazon intelligence. Paste a product URL, get a full competitive breakdown in seconds.
        </motion.p>

        {/* Input Card */}
        <motion.div
          className="glass rounded-card p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          {/* URL Input */}
          <div className="relative group mb-5">
            <div className="absolute inset-0 rounded-input bg-gradient-to-r from-pixii-green/20 to-emerald-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-xl" />
            <input
              id="url-input"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.amazon.com/dp/B0058HWV9S or any Amazon regional URL"
              className="relative w-full bg-pixii-bg border border-pixii-border rounded-input px-4 py-3.5 text-sm text-pixii-text placeholder:text-pixii-muted/50 focus:outline-none focus:border-pixii-green/50 focus:ring-1 focus:ring-pixii-green/20 transition-all duration-200 font-mono"
              onKeyDown={(e) => e.key === 'Enter' && onAnalyze()}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              id="analyze-btn"
              onClick={onAnalyze}
              disabled={!isValidUrl}
              className="flex-1 h-12 rounded-input font-semibold text-sm transition-all duration-200 relative overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed bg-pixii-green text-pixii-bg hover:shadow-lg hover:shadow-pixii-green/20 hover:brightness-110 active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                Analyze Live URL
              </span>
            </button>

            <button
              id="sample-btn"
              onClick={handleSampleData}
              className="flex-1 h-12 rounded-input text-sm font-medium border border-pixii-border text-pixii-muted hover:text-pixii-text hover:border-pixii-muted/50 hover:bg-pixii-elevated/50 transition-all duration-200 active:scale-[0.98]"
            >
              Load Sample Data
            </button>
          </div>

          {/* Hint */}
          {url && !isValidUrl && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-xs text-pixii-amber flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              Please enter a valid Amazon product URL
            </motion.p>
          )}
        </motion.div>

        {/* Footer Info */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-6 text-xs text-pixii-muted/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-pixii-green/60" />
            Rainforest API
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-pixii-green/60" />
            NVIDIA NIM
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-pixii-green/60" />
            Llama 3.1 70B
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}

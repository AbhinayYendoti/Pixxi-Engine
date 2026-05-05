import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import URLInput from './components/URLInput'
import ProcessingAnimation from './components/ProcessingAnimation'
import ResultsDashboard from './components/ResultsDashboard'

export default function App() {
  const [appState, setAppState] = useState('idle')
  const [url, setUrl] = useState('')
  const [analysisData, setAnalysisData] = useState(null)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    if (!url || !url.toLowerCase().includes('amazon.')) return
    setAppState('processing')
    setError(null)
    try {
      const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/+$/, '')
      const res = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Server error: ${res.status}`)

      console.log('Received data from backend:', data)

      // Validate the LLM returned the expected schema
      if (data.competitors && data.action_response) {
        setAnalysisData(data)
        setAppState('results')
      } else {
        throw new Error('The AI generated incomplete data. Please try again.')
      }
    } catch (err) {
      setError(err.message)
      setAppState('error')
    }
  }

  const handleReset = () => {
    setAppState('idle')
    setUrl('')
    setAnalysisData(null)
    setError(null)
  }

  return (
    <div className="min-h-screen animated-gradient-bg">
      <AnimatePresence mode="wait">
        {appState === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <URLInput url={url} setUrl={setUrl} onAnalyze={handleAnalyze} />
          </motion.div>
        )}

        {appState === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ProcessingAnimation />
          </motion.div>
        )}

        {appState === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ResultsDashboard data={analysisData} onReset={handleReset} />
          </motion.div>
        )}

        {appState === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
          >
            <div className="glass rounded-card p-8 text-center max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-pixii-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <h2 className="font-display text-xl font-bold text-pixii-text mb-2">Analysis Failed</h2>
              <p className="text-pixii-muted text-sm mb-6">{error}</p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-input bg-pixii-elevated hover:bg-pixii-border text-pixii-text text-sm font-medium transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

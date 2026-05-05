import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const STATUS_LINES = [
  'Extracting ASIN from URL...',
  'Connecting to Rainforest API...',
  'Scraping live product data...',
  'Sending to NVIDIA NIM (Llama 3.1 70B)...',
  'Synthesizing competitor intelligence...',
  'Finalizing report...',
]

export default function ProcessingAnimation() {
  const [currentLine, setCurrentLine] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % STATUS_LINES.length)
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Pulse */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-[500px] h-[500px] rounded-full bg-pixii-green/5"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-[300px] h-[300px] rounded-full bg-pixii-green/8"
          animate={{
            scale: [1.2, 0.9, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
      </div>

      {/* Scan Line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="scan-line w-full h-px bg-gradient-to-r from-transparent via-pixii-green/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Pulsing Logo */}
        <motion.div
          className="mb-8"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <h1 className="font-display text-4xl font-extrabold tracking-tight">
            <span className="text-pixii-text">Pixii</span>
            <span className="text-pixii-green"> Engine</span>
          </h1>
        </motion.div>

        {/* Spinner Ring */}
        <div className="mx-auto mb-8 relative w-16 h-16">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-pixii-border"
            style={{ borderTopColor: '#6EE7B7' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-transparent"
            style={{ borderBottomColor: '#6EE7B7', opacity: 0.4 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Status Ticker */}
        <div className="h-6 overflow-hidden">
          <motion.p
            key={currentLine}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-pixii-green font-mono"
          >
            {STATUS_LINES[currentLine]}
          </motion.p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {STATUS_LINES.map((_, i) => (
            <motion.div
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${
                i <= currentLine ? 'bg-pixii-green' : 'bg-pixii-border'
              }`}
              animate={i === currentLine ? { scale: [1, 1.5, 1] } : {}}
              transition={{ duration: 0.5 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

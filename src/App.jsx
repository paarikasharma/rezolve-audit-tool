import { useState, useEffect } from 'react'
import './index.css'
import Header from './components/Header'
import Typewriter from './components/Typewriter'
import FloatingBadges from './components/FloatingBadges'
import CursorGlow from './components/CursorGlow'
import InputPanel from './components/InputPanel'
import { ScoreHero, DimensionList } from './components/ScoreGauge'
import ListingImprover from './components/ListingImprover'
import RezolveMap from './components/RezolveMap'
import GTMBrief from './components/GTMBrief'
import { auditListing, auditCsv } from './lib/audit'

const LOADING_STEPS = [
  'Parsing listing…',
  'Scoring discovery friction…',
  'Mapping capability gaps…',
  'Building recommendations…',
]

export default function App() {
  const [mode, setMode] = useState('idle')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [originalText, setOriginalText] = useState('')
  const [loadStep, setLoadStep] = useState(0)

  useEffect(() => {
    if (mode !== 'loading') return
    setLoadStep(0)
    const id = setInterval(() => setLoadStep(s => Math.min(s + 1, LOADING_STEPS.length - 1)), 2200)
    return () => clearInterval(id)
  }, [mode])

  const handleAnalyze = async (text, type) => {
    setMode('loading')
    setError('')
    setOriginalText(text)
    try {
      const data = type === 'csv' ? await auditCsv(text) : await auditListing(text)
      setResult(data)
      setMode('results')
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
    } catch (e) {
      setError(e.message || 'Something went wrong. Try again.')
      setMode('error')
    }
  }

  const reset = () => { setMode('idle'); setResult(null); setError('') }

  return (
    <div className="app">
      <CursorGlow />
      <Header />

      <main className="container">
        {mode !== 'results' && (
          <div className="hero">
            <FloatingBadges />
            <h1 className="hero-h1">Why can't customers find<br />your <span><Typewriter /></span>?</h1>
            <p className="hero-p">Paste any listing. Get a discovery score, missing attributes, better search terms, and the exact capabilities that fix each gap.</p>

            <div className="stat-strip hero-p">
              <span className="stat-item"><strong>3</strong> input modes</span>
              <span className="stat-div">·</span>
              <span className="stat-item"><strong>7</strong> dimensions scored</span>
              <span className="stat-div">·</span>
              <span className="stat-item"><strong>6</strong> capabilities mapped</span>
            </div>
          </div>
        )}

        {(mode === 'idle' || mode === 'loading' || mode === 'error') && (
          <>
            <div className="input-appear input-panel-wrap">
              <InputPanel onAnalyze={handleAnalyze} loading={mode === 'loading'} />
            </div>

            {mode === 'loading' && (
              <div className="loading-state">
                <div className="loading-orb">
                  <div className="loading-ring" />
                  <div className="loading-ring r2" />
                </div>
                <div className="loading-steps">
                  {LOADING_STEPS.map((step, i) => (
                    <div key={i} className={`loading-step ${i === loadStep ? 'active' : i < loadStep ? 'done' : ''}`}>
                      <span className="step-dot" />
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mode === 'error' && (
              <div className="error-banner">
                <span className="error-icon">⚠</span>
                <span>{error}</span>
              </div>
            )}
          </>
        )}

        {mode === 'results' && result && (
          <div className="results fade-in">
            <div className="results-bar">
              <span className="results-label">Audit complete</span>
              <button className="btn-ghost" onClick={reset}>← New audit</button>
            </div>

            <ScoreHero score={result.overallScore} summary={result.summary} />
            <DimensionList dimensions={result.dimensions} />
            <ListingImprover data={result} originalText={originalText} />
            <RezolveMap rezolveMap={result.rezolveMap} />
            <GTMBrief gtm={result.gtm} enablementAsset={result.enablementAsset} />

            <div className="results-footer">
              <button className="btn-ghost" onClick={reset}>← Run another audit</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

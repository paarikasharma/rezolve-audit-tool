import { useState } from 'react'
import './index.css'
import Header from './components/Header'
import InputPanel from './components/InputPanel'
import { ScoreHero, DimensionList } from './components/ScoreGauge'
import ListingImprover from './components/ListingImprover'
import RezolveMap from './components/RezolveMap'
import GTMBrief from './components/GTMBrief'
import { auditListing, auditCsv } from './lib/audit'

export default function App() {
  const [mode, setMode] = useState('idle')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [originalText, setOriginalText] = useState('')

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
      <Header />

      <main className="container">
        {mode !== 'results' && (
          <div className="hero">
            <div className="hero-pill">AI-powered · Rezolve</div>
            <h1>Why can't customers find<br /><span>your product?</span></h1>
            <p>Paste any listing. Get a discovery score, missing attributes, better search terms, and the exact Rezolve capabilities that fix each gap.</p>
          </div>
        )}

        {(mode === 'idle' || mode === 'loading' || mode === 'error') && (
          <>
            <InputPanel onAnalyze={handleAnalyze} loading={mode === 'loading'} />

            {mode === 'loading' && (
              <div className="loading-state">
                <div className="loader-ring" />
                <div className="loading-text">Auditing your listing…</div>
                <div className="loading-sub">Scoring searchability, attributes, confidence signals & Rezolve fit</div>
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

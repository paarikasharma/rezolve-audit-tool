import { useState } from 'react'
import './index.css'
import Header from './components/Header'
import InputPanel from './components/InputPanel'
import { ScoreGauge, DimensionGrid } from './components/ScoreGauge'
import ListingImprover from './components/ListingImprover'
import IntentMap from './components/IntentMap'
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
      setError(e.message || 'Something went wrong. Check your API key in .env and try again.')
      setMode('error')
    }
  }

  const reset = () => {
    setMode('idle')
    setResult(null)
    setError('')
  }

  return (
    <div className="app">
      <Header />

      <main className="container" style={{ paddingTop: 0, paddingBottom: 40 }}>
        {mode !== 'results' && (
          <div className="hero">
            <h1>
              Find why customers can't find<br />
              <span>your products</span>
            </h1>
            <p>
              Paste any product listing. Get a discovery friction score, missing attributes,
              better search terms, and the Rezolve capabilities that fix each gap.
            </p>
          </div>
        )}

        {(mode === 'idle' || mode === 'loading' || mode === 'error') && (
          <>
            <div className="env-setup">
              <h3>⚙️ Setup required</h3>
              <p>Create a <strong>.env</strong> file in the <code>app/</code> folder with your Anthropic API key:</p>
              <div className="env-code">ANTHROPIC_API_KEY=sk-ant-api03-your-key-here</div>
            </div>

            <InputPanel onAnalyze={handleAnalyze} loading={mode === 'loading'} />

            {mode === 'loading' && (
              <div className="loading-state">
                <div className="spinner" />
                <div className="loading-text">Analyzing discovery friction…</div>
                <div className="loading-sub">Claude is auditing searchability, attributes, confidence signals, and Rezolve fit</div>
              </div>
            )}

            {mode === 'error' && (
              <div className="error-banner">
                ⛔ <span>{error}</span>
              </div>
            )}
          </>
        )}

        {mode === 'results' && result && (
          <div className="results fade-in">
            <div className="results-header">
              <h2 style={{ fontSize: 22, fontWeight: 700 }}>Audit Results</h2>
              <button className="btn-reset" onClick={reset}>← New Audit</button>
            </div>

            <div className="section card">
              <div className="card-title">Discovery Friction Score</div>
              <ScoreGauge score={result.overallScore} summary={result.summary} />
              <hr className="divider" style={{ margin: '20px 0' }} />
              <DimensionGrid dimensions={result.dimensions} />
            </div>

            <ListingImprover data={result} originalText={originalText} />

            <IntentMap intentMap={result.intentMap} />

            <RezolveMap rezolveMap={result.rezolveMap} />

            <GTMBrief gtm={result.gtm} enablementAsset={result.enablementAsset} />

            <div style={{ textAlign: 'center', paddingTop: 12 }}>
              <button className="btn-reset" onClick={reset}>← Run Another Audit</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

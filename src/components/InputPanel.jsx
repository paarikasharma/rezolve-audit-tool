import { useState, useRef } from 'react'
import { SAMPLE_LISTINGS, auditCsv } from '../lib/audit'

export default function InputPanel({ onAnalyze, loading }) {
  const [tab, setTab] = useState('paste')
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [drag, setDrag] = useState(false)
  const [csvName, setCsvName] = useState('')
  const [csvContent, setCsvContent] = useState('')
  const fileRef = useRef()

  const loadSample = (key) => {
    setText(SAMPLE_LISTINGS[key].text)
    setTab('paste')
  }

  const handleFile = (file) => {
    if (!file) return
    setCsvName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => setCsvContent(e.target.result)
    reader.readAsText(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDrag(false)
    handleFile(e.dataTransfer.files[0])
  }

  const canAnalyze = () => {
    if (tab === 'paste') return text.trim().length > 10
    if (tab === 'url') return url.trim().length > 10
    if (tab === 'csv') return csvContent.trim().length > 10
    return false
  }

  const submit = () => {
    if (tab === 'paste') onAnalyze(text, 'text')
    if (tab === 'url') onAnalyze(url, 'url')
    if (tab === 'csv') onAnalyze(csvContent, 'csv')
  }

  return (
    <section className="input-section">
      <div className="card">
        <div className="card-title">Input</div>

        <div className="tabs">
          {[
            { id: 'paste', label: 'Paste listing', icon: '📋' },
            { id: 'url', label: 'URL', icon: '🔗' },
            { id: 'csv', label: 'Upload CSV', icon: '📊' },
            { id: 'samples', label: 'Try a sample', icon: '✨' },
          ].map(t => (
            <button
              key={t.id}
              className={`tab-btn ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === 'paste' && (
          <textarea
            rows={8}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={`Paste your product listing here. Include any combination of:\n\nTitle: ...\nCategory: ...\nDescription: ...\nPrice: ...\nTags: ...\nBullet points, attributes, etc.`}
          />
        )}

        {tab === 'url' && (
          <>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://www.amazon.com/dp/... or any product URL"
            />
            <div className="url-note">
              ⚠️ <span><strong>Prototype mode:</strong> URL extraction isn't live in this build. If the page can't be fetched, we'll use the URL as context. For best results, use the <strong>Paste listing</strong> tab to copy the product text directly.</span>
            </div>
          </>
        )}

        {tab === 'csv' && (
          <div
            className={`csv-zone ${drag ? 'drag' : ''}`}
            onClick={() => fileRef.current.click()}
            onDragOver={e => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onDrop={handleDrop}
          >
            <input type="file" ref={fileRef} accept=".csv,.tsv,.txt" onChange={e => handleFile(e.target.files[0])} />
            <div className="csv-zone-icon">📂</div>
            {csvName
              ? <><div className="csv-zone-text">✅ {csvName}</div><div className="csv-zone-sub">Click to replace</div></>
              : <><div className="csv-zone-text">Drop a CSV or click to browse</div><div className="csv-zone-sub">Expected columns: title, category, description, tags, price (any order)</div></>
            }
          </div>
        )}

        {tab === 'samples' && (
          <div className="sample-grid">
            {Object.entries(SAMPLE_LISTINGS).map(([key, s]) => (
              <button key={key} className="sample-btn" onClick={() => loadSample(key)}>
                <span className="sample-icon">{s.icon}</span>
                <div className="sample-label">{s.label}</div>
                <div className="sample-desc">Load and audit →</div>
              </button>
            ))}
          </div>
        )}

        <div className="analyze-row">
          <button
            className="btn-analyze"
            disabled={!canAnalyze() || loading}
            onClick={submit}
          >
            {loading ? '⏳ Analyzing...' : '🔍 Run Discovery Audit'}
          </button>
          {tab === 'paste' && text.length > 0 && (
            <span className="char-count">{text.length} chars</span>
          )}
        </div>
      </div>
    </section>
  )
}

import { useState, useRef } from 'react'
import { SAMPLE_LISTINGS } from '../lib/audit'

export default function InputPanel({ onAnalyze, loading }) {
  const [tab, setTab] = useState('paste')
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [drag, setDrag] = useState(false)
  const [csvName, setCsvName] = useState('')
  const [csvContent, setCsvContent] = useState('')
  const fileRef = useRef()

  const loadSample = (key) => { setText(SAMPLE_LISTINGS[key].text); setTab('paste') }

  const handleFile = (file) => {
    if (!file) return
    setCsvName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => setCsvContent(e.target.result)
    reader.readAsText(file)
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

  const tabs = [
    { id: 'paste',   icon: '📋', label: 'Paste listing' },
    { id: 'url',     icon: '🔗', label: 'URL' },
    { id: 'csv',     icon: '📊', label: 'CSV upload' },
    { id: 'samples', icon: '✨', label: 'Try a sample' },
  ]

  return (
    <div className="input-panel section">
      <div className="tabs">
        {tabs.map(t => (
          <button key={t.id} data-tab={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="tab-content">
        {tab === 'paste' && (
          <textarea
            rows={7}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={`Title: Women's Blue Satin Top\nCategory: Fashion\nDescription: ...\nTags: ...\nPrice: ₹999`}
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
              ℹ️ Prototype mode — live URL fetching isn't enabled. For best results, copy the product text and use Paste listing instead.
            </div>
          </>
        )}

        {tab === 'csv' && (
          <div
            className={`csv-zone ${drag ? 'drag' : ''}`}
            onClick={() => fileRef.current.click()}
            onDragOver={e => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]) }}
          >
            <input type="file" ref={fileRef} accept=".csv,.tsv,.txt" onChange={e => handleFile(e.target.files[0])} />
            <div className="csv-zone-icon">📂</div>
            {csvName
              ? <div className="csv-zone-text">✅ {csvName} — click to replace</div>
              : <>
                  <div className="csv-zone-text">Drop a CSV or click to browse</div>
                  <div className="csv-zone-sub">Columns: title, category, description, tags, price</div>
                </>
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
      </div>

      <div className="panel-footer">
        <button className="btn-primary" disabled={!canAnalyze() || loading} onClick={submit}>
          {loading ? '⏳ Analyzing…' : '→ Run audit'}
        </button>
        {tab === 'paste' && text.length > 0 && (
          <span className="char-count">{text.length} chars</span>
        )}
      </div>
    </div>
  )
}

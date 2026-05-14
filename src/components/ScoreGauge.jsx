function scoreColor(s) {
  if (s <= 40) return { text: 'score-red', bar: 'bar-red', hex: '#ef4444', label: 'High Friction' }
  if (s <= 60) return { text: 'score-amber', bar: 'bar-amber', hex: '#f59e0b', label: 'Moderate Friction' }
  if (s <= 80) return { text: 'score-blue', bar: 'bar-blue', hex: '#4f6ef7', label: 'Low Friction' }
  return { text: 'score-green', bar: 'bar-green', hex: '#10b981', label: 'Discovery Ready' }
}

export function ScoreGauge({ score, summary }) {
  const c = scoreColor(score)
  const r = 54
  const circ = 2 * Math.PI * r
  const dash = circ * (score / 100)

  return (
    <div className="score-hero">
      <div className="score-circle">
        <svg width="130" height="130" viewBox="0 0 130 130">
          <circle cx="65" cy="65" r={r} fill="none" stroke="var(--border)" strokeWidth="10" />
          <circle
            cx="65" cy="65" r={r} fill="none"
            stroke={c.hex} strokeWidth="10"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="score-value">
          <span className={`score-num ${c.text}`}>{score}</span>
          <span className="score-label">/ 100</span>
        </div>
      </div>
      <div className="score-meta">
        <h2 className={c.text}>{c.label}</h2>
        <p>{summary}</p>
      </div>
    </div>
  )
}

const DIM_LABELS = {
  searchability: 'Searchability',
  attributeCompleteness: 'Attribute Completeness',
  visualDiscovery: 'Visual Discovery',
  customerConfidence: 'Customer Confidence',
  conversionClarity: 'Conversion Clarity',
  alternativePath: 'Alternative Path',
  aiCommerceReadiness: 'AI Commerce Readiness',
}

export function DimensionGrid({ dimensions }) {
  return (
    <div className="dim-grid">
      {Object.entries(dimensions).map(([key, dim]) => {
        const c = scoreColor(dim.score)
        return (
          <div key={key} className="dim-card">
            <div className="dim-header">
              <span className="dim-name">{DIM_LABELS[key] || key}</span>
              <span className={`dim-score ${c.text}`}>{dim.score}</span>
            </div>
            <div className="dim-bar-bg">
              <div className={`dim-bar ${c.bar}`} style={{ width: `${dim.score}%` }} />
            </div>
            <div className="dim-issue">{dim.issue}</div>
            {(dim.fixes || dim.missing) && (
              <div className="dim-fixes">
                {(dim.fixes || dim.missing || []).slice(0, 3).map((f, i) => (
                  <div key={i} className="dim-fix">{f}</div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

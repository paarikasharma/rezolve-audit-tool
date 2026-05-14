function scoreClass(s) {
  if (s <= 40) return { cls: 'red',   label: 'High Friction' }
  if (s <= 60) return { cls: 'amber', label: 'Moderate Friction' }
  if (s <= 80) return { cls: 'blue',  label: 'Low Friction' }
  return           { cls: 'green',  label: 'Discovery Ready' }
}

const DIM_NAMES = {
  searchability:        'Searchability',
  attributeCompleteness:'Attribute Completeness',
  visualDiscovery:      'Visual Discovery',
  customerConfidence:   'Customer Confidence',
  conversionClarity:    'Conversion Clarity',
  alternativePath:      'Alternative Path',
  aiCommerceReadiness:  'AI Commerce Readiness',
}

export function ScoreHero({ score, summary }) {
  const { cls, label } = scoreClass(score)
  return (
    <div className={`score-card ${cls} section`}>
      <div className={`score-number ${cls}`}>{score}</div>
      <div className="score-right">
        <div className={`score-label ${cls}`}>{label}</div>
        <div className="score-summary">{summary}</div>
      </div>
    </div>
  )
}

export function DimensionList({ dimensions }) {
  const barColor = { red: '#ef4444', amber: '#f59e0b', blue: '#6b84f9', green: '#10b981' }

  return (
    <div className="dim-list-card section">
      <div className="dim-list-header">Dimension breakdown</div>
      {Object.entries(dimensions).map(([key, dim]) => {
        const { cls } = scoreClass(dim.score)
        return (
          <div key={key} className="dim-row">
            <div>
              <div className="dim-name-col">{DIM_NAMES[key] || key}</div>
              <div className="dim-issue-col">{dim.issue}</div>
            </div>
            <div className="dim-bar-wrap">
              <div className="dim-bar-bg">
                <div className="dim-bar-fill" style={{ width: `${dim.score}%`, background: barColor[cls] }} />
              </div>
            </div>
            <div className={`dim-score-col`} style={{ color: barColor[cls] }}>{dim.score}</div>
          </div>
        )
      })}
    </div>
  )
}

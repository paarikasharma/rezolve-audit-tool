function badgeClass(badge) {
  const map = {
    'Brain Commerce': 'brain-commerce',
    'Visual Search': 'visual-search',
    'Product Enrichment': 'product-enrichment',
    'Brain Checkout': 'brain-checkout',
    'Geolocation': 'geolocation',
    'brainpowa': 'brainpowa',
  }
  return map[badge] || 'brain-commerce'
}

export default function RezolveMap({ rezolveMap }) {
  return (
    <div className="section card">
      <div className="card-title">Rezolve Opportunity Map</div>
      {rezolveMap.map((row, i) => (
        <div key={i} className="rezolve-row">
          <div className="rezolve-friction">
            <span className="friction-icon">⚠</span>
            {row.friction}
          </div>
          <div className="rezolve-arrow">→</div>
          <div className="rezolve-cap">
            <span className={`cap-badge ${badgeClass(row.badge)}`}>
              {row.badge}
            </span>
            <span className="cap-why">{row.why}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

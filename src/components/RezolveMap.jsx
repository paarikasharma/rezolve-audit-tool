function badgeCls(badge) {
  return {
    'Brain Commerce':     'brain-commerce',
    'Visual Search':      'visual-search',
    'Product Enrichment': 'product-enrichment',
    'Brain Checkout':     'brain-checkout',
    'Geolocation':        'geolocation',
    'brainpowa':          'brainpowa',
  }[badge] || 'brain-commerce'
}

export default function RezolveMap({ rezolveMap }) {
  return (
    <div className="s-card section">
      <div className="s-card-header">
        <span className="s-card-title">Opportunity Map</span>
        <span className="s-card-sub">Friction → Fix</span>
      </div>
      <div className="rezolve-rows">
        {rezolveMap.map((row, i) => (
          <div key={i} className="r-row">
            <div className="r-friction">{row.friction}</div>
            <div className="r-arrow">→</div>
            <div className="r-cap">
              <span className={`r-badge ${badgeCls(row.badge)}`}>{row.badge}</span>
              <span className="r-why">{row.why}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

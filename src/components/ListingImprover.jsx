export default function ListingImprover({ data, originalText }) {
  const originalTitle = originalText.match(/title[:\s]+([^\n]+)/i)?.[1]?.trim() || 'Original listing title'

  return (
    <div className="section card">
      <div className="card-title">Improved Listing</div>

      <div className="before-after">
        <div className="ba-block">
          <div className="ba-label before">Before</div>
          <div className="ba-text">{originalTitle}</div>
        </div>
        <div className="ba-block">
          <div className="ba-label after">After</div>
          <div className="ba-text">{data.improvedTitle}</div>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="section-label">Missing Attributes</div>
        <div className="tag-list">
          {data.missingAttributes.map((a, i) => (
            <span key={i} className="tag missing">{a}</span>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="section-label">Customer Search Terms</div>
        <div className="tag-list">
          {data.searchTerms.map((t, i) => (
            <span key={i} className="tag accent">{t}</span>
          ))}
        </div>
      </div>

      <div>
        <div className="section-label">Improved Bullet Points</div>
        <div className="bullet-list">
          {data.improvedBullets.map((b, i) => (
            <div key={i} className="bullet-item">
              <div className="bullet-dot" />
              {b}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

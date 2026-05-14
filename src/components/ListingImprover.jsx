export default function ListingImprover({ data, originalText }) {
  const originalTitle = originalText.match(/title[:\s]+([^\n]+)/i)?.[1]?.trim() || 'Original title'

  return (
    <div className="s-card section">
      <div className="s-card-header">
        <span className="s-card-title">Improved Listing</span>
      </div>
      <div className="s-card-body">

        <div className="ba-grid">
          <div className="ba-block before">
            <div className="ba-tag before">Before</div>
            <div className="ba-text">{originalTitle}</div>
          </div>
          <div className="ba-block after">
            <div className="ba-tag after">After</div>
            <div className="ba-text">{data.improvedTitle}</div>
          </div>
        </div>

        <div className="sub-label">Missing Attributes</div>
        <div className="chip-row">
          {data.missingAttributes.map((a, i) => <span key={i} className="chip missing">{a}</span>)}
        </div>

        <div className="sub-label">Search Terms to Add</div>
        <div className="chip-row">
          {data.searchTerms.map((t, i) => <span key={i} className="chip search">{t}</span>)}
        </div>

        <div className="sub-label">Rewritten Bullets</div>
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

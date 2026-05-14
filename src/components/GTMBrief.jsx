export default function GTMBrief({ gtm, enablementAsset }) {
  return (
    <div className="section card">
      <div className="card-title">Partner GTM Brief</div>

      <div className="talk-track">
        <div className="talk-track-label">Partner Talk Track</div>
        <div className="talk-track-text">{gtm.talkTrack}</div>
      </div>

      <div className="gtm-grid">
        <div className="gtm-block">
          <div className="gtm-block-label">Customer Problem</div>
          <div className="gtm-block-text">{gtm.customerProblem}</div>
        </div>
        <div className="gtm-block">
          <div className="gtm-block-label">Commerce Friction</div>
          <div className="gtm-block-text">{gtm.commerceFriction}</div>
        </div>
        <div className="gtm-block">
          <div className="gtm-block-label">Rezolve Angle</div>
          <div className="gtm-block-text">{gtm.rezolveAngle}</div>
        </div>
        <div className="gtm-block">
          <div className="gtm-block-label">Suggested Metrics</div>
          <div className="metric-chips">
            {gtm.metrics.map((m, i) => (
              <span key={i} className="metric-chip">{m}</span>
            ))}
          </div>
        </div>
      </div>

      {enablementAsset && (
        <div className="enablement-box">
          💡 <span><strong>Suggested enablement asset:</strong> {enablementAsset}</span>
        </div>
      )}
    </div>
  )
}

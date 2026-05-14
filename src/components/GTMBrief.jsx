export default function GTMBrief({ gtm, enablementAsset }) {
  return (
    <div className="s-card section">
      <div className="s-card-header">
        <span className="s-card-title">Partner GTM Brief</span>
      </div>
      <div className="s-card-body">

        <div className="talk-block">
          <div className="talk-label">Talk track</div>
          <div className="talk-text">{gtm.talkTrack}</div>
        </div>

        <div className="gtm-rows">
          <div className="gtm-cell">
            <div className="gtm-cell-label">Customer Problem</div>
            <div className="gtm-cell-text">{gtm.customerProblem}</div>
          </div>
          <div className="gtm-cell">
            <div className="gtm-cell-label">Commerce Friction</div>
            <div className="gtm-cell-text">{gtm.commerceFriction}</div>
          </div>
          <div className="gtm-cell">
            <div className="gtm-cell-label">Rezolve Angle</div>
            <div className="gtm-cell-text">{gtm.rezolveAngle}</div>
          </div>
          <div className="gtm-cell">
            <div className="gtm-cell-label">Metrics to Track</div>
            <div className="metric-row">
              {gtm.metrics.map((m, i) => <span key={i} className="metric-pill">{m}</span>)}
            </div>
          </div>
        </div>

        {enablementAsset && (
          <div className="tip-box">
            💡 <span><strong>Suggested asset:</strong> {enablementAsset}</span>
          </div>
        )}

      </div>
    </div>
  )
}

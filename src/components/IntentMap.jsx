export default function IntentMap({ intentMap }) {
  return (
    <div className="section card">
      <div className="card-title">Customer Intent Map</div>
      <div className="table-wrap">
        <table className="intent-table">
          <thead>
            <tr>
              <th>Customer Intent</th>
              <th>How They Search</th>
              <th>Listing Gap</th>
            </tr>
          </thead>
          <tbody>
            {intentMap.map((row, i) => (
              <tr key={i}>
                <td><span className="intent-badge">{row.intent}</span></td>
                <td>{row.searchBehavior}</td>
                <td style={{ color: 'var(--danger)', opacity: 0.85 }}>{row.gap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

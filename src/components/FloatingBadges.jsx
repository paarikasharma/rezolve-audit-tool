const BADGES = [
  { score: 62, label: 'Fashion',     top: '12%',  left: '4%',   size: 1,    delay: '0s',    duration: '22s' },
  { score: 43, label: 'Health',      top: '55%',  left: '2%',   size: 0.8,  delay: '5s',    duration: '28s' },
  { score: 78, label: 'B2B',         top: '20%',  right: '5%',  size: 0.9,  delay: '2s',    duration: '25s' },
  { score: 31, label: 'Supplements', top: '70%',  right: '3%',  size: 0.75, delay: '8s',    duration: '32s' },
  { score: 85, label: 'Electronics', top: '40%',  left: '7%',   size: 0.7,  delay: '12s',   duration: '20s' },
  { score: 54, label: 'Beauty',      top: '80%',  left: '40%',  size: 0.85, delay: '4s',    duration: '26s' },
]

function scoreColor(s) {
  if (s <= 40) return '#ef4444'
  if (s <= 60) return '#f59e0b'
  if (s <= 80) return '#7b93fa'
  return '#10b981'
}

export default function FloatingBadges() {
  return (
    <div className="floating-badges" aria-hidden="true">
      {BADGES.map((b, i) => (
        <div
          key={i}
          className="float-badge"
          style={{
            top: b.top,
            left: b.left,
            right: b.right,
            '--scale': b.size,
            '--delay': b.delay,
            '--duration': b.duration,
            '--color': scoreColor(b.score),
          }}
        >
          <span className="float-score" style={{ color: scoreColor(b.score) }}>{b.score}</span>
          <span className="float-divider">/</span>
          <span className="float-total">100</span>
          <span className="float-label">{b.label}</span>
        </div>
      ))}
    </div>
  )
}

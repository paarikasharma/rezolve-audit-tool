const ITEMS = [
  { label: 'Brain Commerce',     color: '#818cf8' },
  { label: 'Visual Search',      color: '#c084fc' },
  { label: 'Product Enrichment', color: '#34d399' },
  { label: 'Brain Checkout',     color: '#fbbf24' },
  { label: 'Geolocation',        color: '#f87171' },
  { label: 'brainpowa',          color: '#22d3ee' },
]

const ALL = [...ITEMS, ...ITEMS, ...ITEMS]

export default function Marquee() {
  return (
    <div className="marquee-wrap" aria-hidden="true">
      <div className="marquee-track">
        {ALL.map((item, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-dot" style={{ background: item.color }} />
            <span className="marquee-label" style={{ color: item.color }}>{item.label}</span>
            <span className="marquee-sep">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

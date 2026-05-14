import { useState, useEffect } from 'react'

const WORDS = [
  'blue top',
  'vegan supplement',
  'luxury handbag',
  'running shoes',
  'skincare serum',
  'industrial filter',
  'wireless earbuds',
  'cotton kurta',
]

export default function Typewriter() {
  const [index, setIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState('typing') // typing | pausing | deleting

  useEffect(() => {
    const word = WORDS[index]

    if (phase === 'typing') {
      if (displayed.length < word.length) {
        const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setPhase('deleting'), 1800)
        return () => clearTimeout(t)
      }
    }

    if (phase === 'deleting') {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(d => d.slice(0, -1)), 45)
        return () => clearTimeout(t)
      } else {
        setIndex(i => (i + 1) % WORDS.length)
        setPhase('typing')
      }
    }
  }, [displayed, phase, index])

  return (
    <span className="typewriter-word">
      {displayed}
      <span className="typewriter-cursor" />
    </span>
  )
}

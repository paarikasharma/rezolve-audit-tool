import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const ref = useRef()

  useEffect(() => {
    const el = ref.current
    const move = (e) => {
      el.style.setProperty('--x', `${e.clientX}px`)
      el.style.setProperty('--y', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return <div className="cursor-glow" ref={ref} aria-hidden="true" />
}

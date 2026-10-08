import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

const HOVERABLE = 'a, button, [data-cursor]'

export default function Cursor() {
  const root = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useGSAP(
    (_, contextSafe) => {
      // Touch devices keep their normal behaviour
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

      const el = root.current!
      document.documentElement.classList.add('has-cursor')
      gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0.35, autoAlpha: 0 })

      const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' })

      const grow = contextSafe!((target: Element | null) => {
        const text = target?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor ?? ''
        label.current!.textContent = text
        gsap.to(el, { scale: target ? (text ? 3.4 : 2.4) : 0.35, duration: 0.4, ease: 'power3.out', overwrite: 'auto' })
      })

      const move = contextSafe!((e: PointerEvent) => {
        gsap.to(el, { autoAlpha: 1, duration: 0.3, overwrite: 'auto' })
        xTo(e.clientX)
        yTo(e.clientY)
      })
      const over = (e: PointerEvent) => grow((e.target as Element).closest(HOVERABLE))
      const out = (e: PointerEvent) => {
        if (!e.relatedTarget) gsap.to(el, { autoAlpha: 0, duration: 0.3 }) // left the window
      }
      const down = contextSafe!(() => gsap.to(el, { scale: '*=0.8', duration: 0.15, yoyo: true, repeat: 1 }))

      window.addEventListener('pointermove', move)
      document.addEventListener('pointerover', over)
      document.addEventListener('pointerout', out)
      window.addEventListener('pointerdown', down)

      return () => {
        document.documentElement.classList.remove('has-cursor')
        window.removeEventListener('pointermove', move)
        document.removeEventListener('pointerover', over)
        document.removeEventListener('pointerout', out)
        window.removeEventListener('pointerdown', down)
      }
    },
    { scope: root },
  )

  return (
    <div className="cursor" ref={root} aria-hidden="true">
      <span ref={label} />
    </div>
  )
}

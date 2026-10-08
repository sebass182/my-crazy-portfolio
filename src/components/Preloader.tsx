import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

type Props = { images: string[]; onDone: () => void }

const preload = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new Image()
    img.onload = img.onerror = () => resolve()
    img.src = src
  })

export default function Preloader({ images, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const counter = { value: 0 }
      const write = () => {
        count.current!.textContent = String(Math.round(counter.value)).padStart(2, '0')
      }

      let loaded = false
      const tl = gsap.timeline({
        onComplete: () => {
          try {
            sessionStorage.setItem('seen-preloader', '1')
          } catch {
            /* storage unavailable — the loader will simply show again next visit */
          }
          onDone()
        },
      })

      // Runs to 90% on a timer, then waits at the pause until the hero images (and fonts) are really loaded
      tl.to(counter, { value: 90, duration: 1.6, ease: 'power2.out', onUpdate: write })
        .to('.preloader__bar', { scaleX: 0.9, duration: 1.6, ease: 'power2.out' }, 0)
        .addPause('>', () => {
          if (loaded) gsap.delayedCall(0.05, () => tl.resume())
        })
        .to(counter, { value: 100, duration: 0.5, ease: 'power2.inOut', onUpdate: write })
        .to('.preloader__bar', { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, '<')
        .to({}, { duration: 0.25 }) // brief hold on 100
        .to(root.current, { autoAlpha: 0, duration: 0.7, ease: 'power2.out' })

      const timeout = new Promise<void>((r) => setTimeout(r, 8000)) // never trap the visitor on a slow network
      Promise.race([Promise.all([...images.map(preload), document.fonts?.ready]), timeout]).then(() => {
        loaded = true
        if (tl.paused()) tl.resume()
      })
    },
    { scope: root },
  )

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="hero__bg">
        <i className="blob blob--yellow" />
        <i className="blob blob--cyan" />
        <i className="blob blob--pink" />
        <i className="blob blob--lilac" />
      </div>
      <span className="preloader__label">Revue de portfolio — Sébastien Lemyre</span>
      <span className="preloader__count" ref={count}>
        00
      </span>
      <div className="preloader__bar" />
    </div>
  )
}

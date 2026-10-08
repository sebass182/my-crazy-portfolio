import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

type Props = { onDone: () => void }

export default function Preloader({ onDone }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const counter = { value: 0 }

      gsap
        .timeline({ onComplete: onDone })
        .to(counter, {
          value: 100,
          duration: 2.4,
          ease: 'power2.inOut',
          onUpdate: () => {
            count.current!.textContent = String(Math.round(counter.value)).padStart(2, '0')
          },
        })
        .to('.preloader__bar', { scaleX: 1, duration: 2.4, ease: 'power2.inOut' }, 0)
        .to({}, { duration: 0.25 }) // brief hold on 100
        .to(root.current, { autoAlpha: 0, duration: 0.7, ease: 'power2.out' })
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

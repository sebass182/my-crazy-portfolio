import { useRef } from 'react'
import { gsap, SplitText, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { projects, mockupOf } from '../data/projects'

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const intro = useRef<gsap.core.Timeline | null>(null)

  // Build the intro once (paused) — the split title stays hidden until the preloader hands over
  useGSAP(
    () => {
      const reduce = prefersReducedMotion()
      const tl = gsap.timeline({ paused: true })
      if (reduce) tl.timeScale(40) // same end state, no visible motion
      intro.current = tl
      let charsTween: gsap.core.Tween | undefined

      SplitText.create('.hero__title', {
        type: 'chars',
        mask: 'chars',
        autoSplit: true,
        onSplit: (self) => {
          gsap.set('.hero__title', { visibility: 'visible' })
          gsap.set(self.chars, { yPercent: 110, rotate: 8 })
          if (charsTween) tl.remove(charsTween)
          charsTween = gsap.to(self.chars, {
            yPercent: 0,
            rotate: 0,
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.05,
          })
          tl.add(charsTween, 0)
          return charsTween
        },
      })

      tl.fromTo(
        '.hero__meta > *, .hero__lede, .hero__cta > *',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
        '-=0.6',
      ).fromTo(
        '.hero__marquee',
        { y: 120, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out' },
        '-=1',
      )

      if (reduce) return // no drifting blobs, no endless strip, no scroll-linked fade

      // Gradient blobs drift forever
      gsap.utils.toArray<HTMLElement>('.hero .blob').forEach((b, i) => {
        gsap.to(b, {
          x: () => gsap.utils.random(-18, 18) + 'vw',
          y: () => gsap.utils.random(-14, 14) + 'vh',
          duration: gsap.utils.random(7, 11),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: -i * 2,
        })
      })

      // Project strip scrolls endlessly (track holds two copies → -50% loops seamlessly)
      gsap.to('.hero__track', { xPercent: -50, duration: 50, ease: 'none', repeat: -1 })

      // Title drifts and fades as you scroll away
      gsap.to('.hero__title', {
        yPercent: -25,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    },
    { scope: root },
  )

  // Play when the preloader is done (immediately, if it was skipped)
  useGSAP(
    () => {
      if (ready) intro.current?.play()
    },
    { dependencies: [ready], revertOnUpdate: false },
  )

  const strip = [...projects, ...projects]

  return (
    <section className="hero" ref={root} id="top">
      <div className="hero__bg" aria-hidden="true">
        <i className="blob blob--yellow" />
        <i className="blob blob--cyan" />
        <i className="blob blob--pink" />
        <i className="blob blob--lilac" />
      </div>

      <div className="hero__meta">
        <span>Revue de portfolio — 2026</span>
        <span>St-Jean-sur-Richelieu, QC</span>
      </div>

      <div className="hero__main">
        <h1 className="hero__title" aria-label="Sébastien Lemyre">
          Sébastien
          <br />
          Lemyre
        </h1>
        <p className="hero__lede">
          <strong>Designer UI/UX Senior.</strong> Design systems, direction artistique et IA générative — 15 ans à
          transformer des produits complexes en interfaces simples.
        </p>
        <div className="hero__cta">
          <a className="btn" href="#work">
            Voir les travaux <span aria-hidden="true">↓</span>
          </a>
          <a className="btn btn--outline" href="#contact">
            Me contacter
          </a>
        </div>
      </div>

      <div className="hero__marquee" aria-hidden="true">
        <div className="hero__track">
          {strip.map((p, i) => (
            <img key={i} src={mockupOf(p)} alt="" draggable={false} decoding="async" />
          ))}
        </div>
      </div>
    </section>
  )
}

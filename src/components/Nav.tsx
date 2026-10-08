import { useRef } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'

const links = [
  { href: '#work', label: 'Travaux' },
  { href: '#about', label: 'À propos' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)

  // Slides in once the preloader has handed over
  useGSAP(
    () => {
      if (!ready) return
      gsap.fromTo(
        root.current,
        { y: -24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: prefersReducedMotion() ? 0 : 0.9, delay: prefersReducedMotion() ? 0 : 0.6, ease: 'power3.out' },
      )
    },
    { dependencies: [ready], scope: root },
  )

  return (
    <header className="nav" ref={root}>
      <a className="nav__brand" href="#top">
        Sébastien Lemyre
      </a>
      <nav aria-label="Navigation principale">
        {links.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  )
}

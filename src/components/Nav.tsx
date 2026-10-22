import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { jumpTo } from '../lib/jump'

const links = [
  { href: '#work', label: 'Travaux' },
  { href: '#about', label: 'À propos' },
  { href: '#contact', label: 'Contact' },
]

const MOBILE = '(max-width: 800px)'
const NAME = 'Sébastien Lemyre'

export default function Nav({ ready }: { ready: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const burger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const menuTl = useRef<gsap.core.Timeline | null>(null)
  const [open, setOpen] = useState(false)

  // Header slides in once the preloader has handed over
  useGSAP(
    () => {
      if (!ready) return
      const reduce = prefersReducedMotion()
      gsap.fromTo(
        '.nav',
        { y: -24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.6, ease: 'power3.out' },
      )
    },
    { dependencies: [ready], scope: root },
  )

  // Mobile menu timeline, built once and paused. Opening plays it; closing plays it backwards.
  useGSAP(
    () => {
      const reduce = prefersReducedMotion()
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'expo.out' },
        onReverseComplete: () => {
          gsap.set(panel.current, { visibility: 'hidden' })
        },
      })

      tl
        // hamburger → cross
        .to('.burger__line--top', { y: 4, rotate: 45, duration: 0.5, ease: 'power3.inOut' }, 0)
        .to('.burger__line--bottom', { y: -4, rotate: -45, duration: 0.5, ease: 'power3.inOut' }, 0)
        // panel opens as a circle growing out of the burger
        .fromTo(
          panel.current,
          { clipPath: 'circle(0px at calc(100% - 2.2rem) 1.9rem)' },
          { clipPath: 'circle(160vmax at calc(100% - 2.2rem) 1.9rem)', duration: 1.1, ease: 'expo.inOut' },
          0,
        )
        // links rise out of their masks one after another
        .fromTo('.menu__text', { yPercent: 115 }, { yPercent: 0, duration: 1, stagger: 0.09 }, 0.35)
        .fromTo('.menu__rule', { scaleX: 0 }, { scaleX: 1, duration: 1, stagger: 0.09 }, 0.4)
        .fromTo('.menu__foot > *', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.07 }, 0.7)
        // the gradient blobs breathe in behind it
        .fromTo('.menu .blob', { scale: 0.6 }, { scale: 1, duration: 1.6, stagger: 0.1 }, 0.1)

      if (reduce) tl.timeScale(40) // same end states, no visible motion
      menuTl.current = tl
    },
    { scope: root },
  )

  const close = useCallback(() => setOpen(false), [])

  // ── Show / hide: the bar leaves when you scroll down (it would sit on top of the page's headlines and photos) and comes
  //    back the moment you scroll up, or when focus reaches it. Away from the top it gets a frosted dark ground, so its
  //    white text stays readable over anything. At the very top it keeps the difference-blend look over the hero. ──
  const header = useRef<HTMLElement>(null)
  const shown = useRef(true)
  const setShown = useCallback((show: boolean) => {
    if (shown.current === show || !header.current) return
    shown.current = show
    gsap.to(header.current, { yPercent: show ? 0 : -125, duration: prefersReducedMotion() ? 0 : 0.5, ease: 'power3.out', overwrite: 'auto' })
  }, [])

  useEffect(() => {
    if (!ready) return
    const el = header.current
    if (!el) return
    let last = window.scrollY
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const y = window.scrollY
        const dy = y - last
        el.classList.toggle('nav--bar', y > 90)
        if (y <= 90 || dy < -6) setShown(true)
        else if (dy > 6 && !document.body.classList.contains('is-locked')) setShown(false)
        if (Math.abs(dy) > 6) last = y
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [ready, setShown])

  // ── Home link: a house icon that types out the name on hover/focus, and erases it again on leave ──
  const typed = useRef<HTMLSpanElement>(null)
  const typing = useRef<gsap.core.Tween | null>(null)
  const cursor = useRef({ n: 0 }) // how many letters are currently shown

  const typeTo = (target: number) => {
    const el = typed.current
    if (!el) return
    const speed = target > cursor.current.n ? 0.05 : 0.022 // typing is slower than erasing
    typing.current?.kill()
    if (prefersReducedMotion()) {
      cursor.current.n = target
      el.textContent = NAME.slice(0, target)
      return
    }
    typing.current = gsap.to(cursor.current, {
      n: target,
      duration: Math.abs(target - cursor.current.n) * speed,
      ease: 'none',
      onUpdate: () => {
        el.textContent = NAME.slice(0, Math.round(cursor.current.n))
      },
    })
  }
  useEffect(() => () => void typing.current?.kill(), [])

  // React to open/close: play the timeline, lock scroll, manage focus and the page behind
  useEffect(() => {
    const tl = menuTl.current
    const main = document.querySelector('main')
    const burgerEl = burger.current
    if (!tl) return

    if (open) {
      document.body.classList.add('is-locked')
      main?.setAttribute('inert', '')
      gsap.set(panel.current, { visibility: 'visible' })
      tl.timeScale(prefersReducedMotion() ? 40 : 1).play()
      panel.current?.querySelector<HTMLElement>('.menu__link')?.focus({ preventScroll: true })

      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
      const mq = window.matchMedia(MOBILE)
      const onResize = () => !mq.matches && close() // rotated/resized to desktop: the inline nav takes over
      window.addEventListener('keydown', onKey)
      mq.addEventListener('change', onResize)

      return () => {
        window.removeEventListener('keydown', onKey)
        mq.removeEventListener('change', onResize)
        document.body.classList.remove('is-locked')
        main?.removeAttribute('inert')
        tl.timeScale(prefersReducedMotion() ? 40 : 1.5).reverse()
        burgerEl?.focus({ preventScroll: true })
      }
    }
  }, [open, close])

  // Anchor links: close the menu first (the page is scroll-locked while it is open), then go to the section —
  // straight there when it is far, so "À propos" skips the whole Travaux slider
  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!document.querySelector(href)) return
    e.preventDefault()
    document.body.classList.remove('is-locked')
    setOpen(false)
    jumpTo(href)
  }

  return (
    <div className="nav-root" ref={root}>
      <header className="nav" ref={header} onFocus={() => setShown(true)}>
        <a
          className="nav__brand"
          href="#top"
          aria-label="Retour en haut de la page — Sébastien Lemyre"
          onClick={(e) => go(e, '#top')}
          onMouseEnter={() => typeTo(NAME.length)}
          onMouseLeave={() => typeTo(0)}
          onFocus={() => typeTo(NAME.length)}
          onBlur={() => typeTo(0)}
        >
          <svg className="nav__home" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5.5 9.2V20a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1V9.2" />
          </svg>
          <span className="nav__typed" ref={typed} aria-hidden="true" />
          <span className="nav__caret" aria-hidden="true" />
        </a>

        <nav className="nav__links" aria-label="Navigation principale">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)}>
              {l.label}
            </a>
          ))}
        </nav>

        <button
          ref={burger}
          className="burger"
          aria-expanded={open}
          aria-controls="menu"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="burger__line burger__line--top" />
          <span className="burger__line burger__line--bottom" />
        </button>
      </header>

      <div className="menu" id="menu" ref={panel} aria-hidden={!open} inert={!open}>
        <div className="hero__bg" aria-hidden="true">
          <i className="blob blob--yellow" />
          <i className="blob blob--cyan" />
          <i className="blob blob--pink" />
          <i className="blob blob--lilac" />
        </div>

        <nav className="menu__nav" aria-label="Menu mobile">
          {links.map((l, i) => (
            <a key={l.href} className="menu__link" href={l.href} onClick={(e) => go(e, l.href)}>
              <span className="menu__mask">
                <span className="menu__text">
                  <i>{String(i + 1).padStart(2, '0')}</i>
                  {l.label}
                </span>
              </span>
              <span className="menu__rule" />
            </a>
          ))}
        </nav>

        <div className="menu__foot">
          <a href="mailto:sebasslemyre@gmail.com">sebasslemyre@gmail.com</a>
          <a href="tel:5144428885">514.442.8885</a>
          <span>St-Jean-sur-Richelieu, QC</span>
        </div>
      </div>
    </div>
  )
}

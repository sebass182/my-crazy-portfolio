import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { projects, slidesOf, type Project } from '../data/projects'

type Props = { project: Project; onClose: () => void; onNavigate: (p: Project) => void }

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function ProjectView({ project, onClose, onNavigate }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null) // the scrolling layer; the panel itself never scrolls
  const closeBtn = useRef<HTMLButtonElement>(null)
  const closing = useRef(false)
  // the card that opened us, captured before focus moves into the dialog (survives strict-mode re-runs)
  const openerRef = useRef(document.activeElement as HTMLElement | null)

  const idx = projects.findIndex((p) => p.slug === project.slug)
  const next = projects[(idx + 1) % projects.length]

  // Slide the panel in; reveal each slide as it enters the panel's own scroll
  useGSAP(
    () => {
      const el = root.current!
      const scroller = scrollRef.current!
      scroller.scrollTop = 0

      if (prefersReducedMotion()) {
        gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 })
        return
      }

      gsap.fromTo(el, { yPercent: 100 }, { yPercent: 0, duration: 0.9, ease: 'expo.out' })
      gsap.from('.pv__head > *', { y: 50, opacity: 0, stagger: 0.08, duration: 0.9, delay: 0.35, ease: 'power3.out' })

      // Brand panel: logo, swatches and type specimens rise in as it enters the panel's scroll
      if (scroller.querySelector('.pv__brand')) {
        const reveal = (targets: string, vars: gsap.TweenVars = {}) =>
          gsap.from(targets, {
            y: 50,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.pv__brand', scroller, start: 'top 80%', toggleActions: 'play none none none' },
            ...vars,
          })
        reveal('.pv__brand-logo')
        reveal('.pv__swatch', { stagger: 0.08, delay: 0.15 })
        reveal('.pv__font', { stagger: 0.12, delay: 0.3 })
      }

      gsap.utils.toArray<HTMLElement>('.pv__slide').forEach((s) =>
        gsap.from(s, {
          y: 80,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: s, scroller, start: 'top 92%', toggleActions: 'play none none none' },
        }),
      )
    },
    { scope: root, dependencies: [project.slug], revertOnUpdate: true },
  )

  // Plain handler: the exit tween is one-shot and ends by unmounting this component, so it needs no context
  const close = () => {
    if (closing.current) return
    closing.current = true
    if (prefersReducedMotion()) return onClose()
    gsap.to(root.current, { yPercent: 100, duration: 0.7, ease: 'expo.inOut', onComplete: onClose })
  }

  // `close` is rebuilt every render; keep the latest in a ref so the key listener is registered exactly once
  const closeRef = useRef<() => void>(() => {})
  useEffect(() => {
    closeRef.current = close
  })

  // Focus management: move focus in, keep Tab inside, hand focus back to the card that opened us
  useEffect(() => {
    const opener = openerRef.current
    document.body.classList.add('is-locked')
    closeBtn.current?.focus({ preventScroll: true })

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return closeRef.current()
      if (e.key !== 'Tab') return
      const items = [...root.current!.querySelectorAll<HTMLElement>(FOCUSABLE)]
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('is-locked')
      // wait a frame: the page behind is still inert until App re-renders without us
      requestAnimationFrame(() => opener?.focus?.({ preventScroll: true }))
    }
  }, [])

  return (
    <div
      className="pv"
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
      style={{ background: project.bg, ['--accent' as string]: project.accent }}
    >
      <button className="pv__close" ref={closeBtn} onClick={close} aria-label="Fermer l'étude de cas">
        Fermer <span aria-hidden="true">✕</span>
      </button>

      <div className="pv__scroll" ref={scrollRef}>
      <header className="pv__head">
        <span className="pv__n">
          {project.n} / {String(projects.length).padStart(2, '0')}
        </span>
        <h2>{project.name}</h2>
        <p className="pv__tags">{project.tags}</p>
        <p className="pv__summary">{project.summary}</p>
        {project.meta && (
          <dl className="pv__meta">
            <div>
              <dt>Rôle</dt>
              <dd>{project.meta.role}</dd>
            </div>
            <div>
              <dt>Agence</dt>
              <dd>{project.meta.agency}</dd>
            </div>
            <div>
              <dt>Portée</dt>
              <dd>{project.meta.scope}</dd>
            </div>
            <div>
              <dt>Outils</dt>
              <dd>{project.meta.tools}</dd>
            </div>
          </dl>
        )}
      </header>

      {project.brand && (
        <section className="pv__brand" aria-label={`Identité visuelle — ${project.name}`}>
          <div className="pv__brand-logo" style={{ ['--pattern' as string]: `url(${project.brand.pattern})` }}>
            <img src={project.brand.logo} alt={`Logo ${project.name}`} width={122} height={40} />
          </div>

          <div className="pv__palette">
            {project.brand.palette.map((c) => (
              <div className="pv__swatch" key={c.hex} style={{ background: c.hex, color: c.ink }}>
                <strong>{c.name}</strong>
                <span>{c.hex}</span>
              </div>
            ))}
          </div>

          <div className="pv__fonts">
            {project.brand.fonts.map((f) => (
              <div className="pv__font" key={f.name} style={{ fontFamily: f.family }}>
                <span className="pv__font-aa" aria-hidden="true">
                  Aa
                </span>
                <div>
                  <strong>{f.name}</strong>
                  <em>{f.role}</em>
                  <p>{f.sample}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="pv__slides">
        {slidesOf(project).map((s) => (
          <img
            className="pv__slide"
            key={s.src}
            src={s.src}
            alt={s.alt}
            width={1920}
            height={1080}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>

      <button className="pv__next" onClick={() => onNavigate(next)}>
        <span>Projet suivant</span>
        <strong>{next.name} →</strong>
      </button>
      </div>
    </div>
  )
}

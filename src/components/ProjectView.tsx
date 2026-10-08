import { useEffect, useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { projects, slidesOf, type Project } from '../data/projects'

type Props = { project: Project; onClose: () => void; onNavigate: (p: Project) => void }

export default function ProjectView({ project, onClose, onNavigate }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const closing = useRef(false)

  const idx = projects.findIndex((p) => p.slug === project.slug)
  const next = projects[(idx + 1) % projects.length]

  // Slide the panel in; reveal each slide as it enters the panel's own scroll
  const { contextSafe } = useGSAP(
    () => {
      const el = root.current!
      el.scrollTop = 0
      gsap.fromTo(el, { yPercent: 100 }, { yPercent: 0, duration: 0.9, ease: 'expo.out' })
      gsap.from('.pv__head > *', { y: 50, opacity: 0, stagger: 0.08, duration: 0.9, delay: 0.35, ease: 'power3.out' })

      gsap.utils.toArray<HTMLElement>('.pv__slide').forEach((s) =>
        gsap.from(s, {
          y: 80,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: s, scroller: el, start: 'top 92%', toggleActions: 'play none none none' },
        }),
      )
    },
    { scope: root, dependencies: [project.slug], revertOnUpdate: true },
  )

  const close = contextSafe(() => {
    if (closing.current) return
    closing.current = true
    gsap.to(root.current, { yPercent: 100, duration: 0.7, ease: 'expo.inOut', onComplete: onClose })
  })

  // `close` is rebuilt every render; read it through a ref so the listener is registered exactly once
  const closeRef = useRef(close)
  closeRef.current = close

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeRef.current()
    window.addEventListener('keydown', onKey)
    document.body.classList.add('is-locked')
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('is-locked')
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
      <button className="pv__close" onClick={close} aria-label="Fermer">
        Fermer <span aria-hidden="true">✕</span>
      </button>

      <header className="pv__head">
        <span className="pv__n">
          {project.n} / {String(projects.length).padStart(2, '0')}
        </span>
        <h2>{project.name}</h2>
        <p className="pv__tags">{project.tags}</p>
        <p className="pv__summary">{project.summary}</p>
      </header>

      <div className="pv__slides">
        {slidesOf(project).map((src, i) => (
          <img className="pv__slide" key={src} src={src} alt={`${project.name} — ${i + 1}`} loading="lazy" />
        ))}
      </div>

      <button className="pv__next" onClick={() => onNavigate(next)}>
        <span>Projet suivant</span>
        <strong>{next.name} →</strong>
      </button>
    </div>
  )
}

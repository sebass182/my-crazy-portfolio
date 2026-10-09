import { useRef } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { projects, mockupOf, altOf, type Project } from '../data/projects'

const INK = '#0a0a0f'

// Keep in sync with the desktop block in index.css: only there does the section pin and slide sideways.
const DESKTOP = '(min-width: 801px) and (prefers-reduced-motion: no-preference)'
const STACKED = '(max-width: 800px), (prefers-reduced-motion: reduce)'

export default function Work({ onOpen }: { onOpen: (p: Project) => void }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = root.current!
      const q = <T extends Element>(sel: string) => section.querySelector<T>(sel)!
      const cards = gsap.utils.toArray<HTMLElement>('.card', section)
      const total = String(projects.length).padStart(2, '0')

      // The section background takes on the colour of the project on screen
      const paintTo = (duration: number) => (color: string) =>
        gsap.to(section, { backgroundColor: color, duration, ease: 'power2.out', overwrite: 'auto' })

      const mm = gsap.matchMedia()

      // ── Desktop: pinned horizontal slider, one colour per client ──────────────────────────────
      mm.add(DESKTOP, () => {
        const track = q<HTMLElement>('.work__track')
        const counter = q('.work__count')
        const setBar = gsap.quickSetter(q('.work__bar'), 'scaleX') as (v: number) => void
        const paint = paintTo(0.7)
        const distance = () => track.scrollWidth - window.innerWidth

        const scroll = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1,
            start: 'top top',
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => setBar(self.progress),
          },
        })

        const stops: [Element, string][] = [
          [q('.work__intro'), INK],
          ...cards.map((c, i): [Element, string] => [c, projects[i].bg]),
        ]
        stops.forEach(([el, color], i) =>
          ScrollTrigger.create({
            trigger: el,
            containerAnimation: scroll,
            start: 'left 65%',
            end: 'right 35%',
            onToggle: (self) => {
              if (!self.isActive) return
              paint(color)
              counter.textContent = `${String(i).padStart(2, '0')} / ${total}`
            },
          }),
        )

        // Caption slides up as each card arrives (the picture itself stays at its true size — no zoom)
        cards.forEach((card) => {
          gsap.from(card.querySelectorAll('.card__meta > *'), {
            y: 40,
            opacity: 0,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, containerAnimation: scroll, start: 'left 85%', toggleActions: 'play none none reverse' },
          })
        })
      })

      // ── Phones, tablets, reduced motion: stacked cards, colour follows the scroll ──────────────
      mm.add(STACKED, () => {
        const reduce = prefersReducedMotion()
        const paint = paintTo(reduce ? 0 : 0.7)

        ScrollTrigger.create({
          trigger: q('.work__intro'),
          start: 'top 60%',
          end: 'bottom 40%',
          onToggle: (self) => self.isActive && paint(INK),
        })

        cards.forEach((card, i) => {
          ScrollTrigger.create({
            trigger: card,
            start: 'top 55%',
            end: 'bottom 45%',
            onToggle: (self) => self.isActive && paint(projects[i].bg),
          })

          if (reduce) return // content stays put; only the background colour changes

          // Frame wipes open, caption slides up (the picture itself stays at its true size — no zoom)
          gsap.fromTo(
            card.querySelector('.card__frame'),
            { clipPath: 'inset(0 0 100% 0)' },
            {
              clipPath: 'inset(0 0 0% 0)',
              duration: 1.2,
              ease: 'expo.out',
              scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none reverse' },
            },
          )
          gsap.from(card.querySelectorAll('.card__meta > *'), {
            y: 40,
            opacity: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 75%', toggleActions: 'play none none reverse' },
          })
        })

        if (reduce) return
        gsap.from(q('.work__intro').children, {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: q('.work__intro'), start: 'top 85%' },
        })
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section className="work" ref={root} id="work" aria-labelledby="work-title">
      <div className="work__hud" aria-hidden="true">
        <span className="work__count">00 / {String(projects.length).padStart(2, '0')}</span>
        <span className="work__hint">Défiler ↓</span>
      </div>
      <div className="work__bar" aria-hidden="true" />

      <div className="work__track">
        <div className="work__intro">
          <div>
            <span className="label">Études de cas</span>
            <h2 id="work-title">
              Travaux
              <br />
              sélectionnés
            </h2>
          </div>
          <p>{String(projects.length).padStart(2, '0')} projets</p>
        </div>

        <div className="work__grid">
          {projects.map((p) => (
            <article className="card" key={p.slug}>
              <button
                className="card__open"
                onClick={() => onOpen(p)}
                aria-label={`Voir l'étude de cas : ${p.name}`}
                data-cursor="Voir"
                style={{ ['--accent' as string]: p.accent }}
              >
                <div className="card__frame">
                  {p.scene ? (
                    <div className="scene" role="img" aria-label={p.scene.alt}>
                      <img className="scene__pattern" src={p.scene.pattern} alt="" draggable={false} />
                      <div className="scene__laptop">
                        <img className="scene__screen" src={p.scene.desktop} alt="" draggable={false} decoding="async" />
                        <img className="scene__device" src={p.scene.laptop} alt="" draggable={false} decoding="async" />
                      </div>
                      <div className="scene__phone">
                        <img src={p.scene.mobile} alt="" draggable={false} decoding="async" />
                      </div>
                    </div>
                  ) : (
                    /* eager: in the slider these start off-screen to the right, where lazy-loading would show blanks */
                    <img className="card__img" src={mockupOf(p)} alt="" draggable={false} decoding="async" />
                  )}
                  {/* swaps in on hover so each project shows something other than the shared laptop frame */}
                  <img className="card__alt" src={altOf(p)} alt="" draggable={false} loading="lazy" decoding="async" />
                </div>
              </button>
              <div className="card__meta">
                <span className="card__n" style={{ color: p.accent }}>
                  {p.n}
                </span>
                <h3>{p.name}</h3>
                <p>{p.tags}</p>
                <span className="card__cta" style={{ color: p.accent }} aria-hidden="true">
                  Voir le projet <span className="card__arrow">→</span>
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="work__outro">
          <span className="label">Fin</span>
          <a href="#contact">Travaillons ensemble →</a>
        </div>
      </div>
    </section>
  )
}

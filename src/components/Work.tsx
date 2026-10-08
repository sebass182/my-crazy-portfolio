import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { projects, mockupOf, type Project } from '../data/projects'

const INK = '#0a0a0f'

export default function Work({ onOpen }: { onOpen: (p: Project) => void }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // The section background takes on the colour of the project nearest the middle of the screen
      const paint = (color: string) =>
        gsap.to(root.current, { backgroundColor: color, duration: 0.7, ease: 'power2.out', overwrite: 'auto' })

      ScrollTrigger.create({
        trigger: '.work__intro',
        start: 'top 60%',
        end: 'bottom 40%',
        onToggle: (self) => self.isActive && paint(INK),
      })

      gsap.utils.toArray<HTMLElement>('.card').forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 55%',
          end: 'bottom 45%',
          onToggle: (self) => self.isActive && paint(projects[i].bg),
        })

        // Frame wipes open, image settles from a zoom while you scroll, caption slides up
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
        gsap.fromTo(
          card.querySelector('.card__img'),
          { scale: 1.3 },
          { scale: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'center center', scrub: true } },
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

      gsap.from('.work__intro > *', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.work__intro', start: 'top 85%' },
      })
    },
    { scope: root },
  )

  return (
    <section className="work" ref={root} id="work">
      <div className="work__intro">
        <div>
          <span className="label">Études de cas</span>
          <h2>
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
            >
              <div className="card__frame" style={{ ['--accent' as string]: p.accent }}>
                <img className="card__img" src={mockupOf(p)} alt="" draggable={false} loading="lazy" />
              </div>
            </button>
            <div className="card__meta">
              <span className="card__n" style={{ color: p.accent }}>
                {p.n}
              </span>
              <h3>{p.name}</h3>
              <p>{p.tags}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

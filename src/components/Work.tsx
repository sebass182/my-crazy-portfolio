import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { projects, mockupOf, type Project } from '../data/projects'

const INK = '#0a0a0f'

export default function Work({ onOpen }: { onOpen: (p: Project) => void }) {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const distance = () => track.current!.scrollWidth - window.innerWidth

      const scroll = gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
        },
      })

      // The section background takes on the colour of whichever project is centred
      const paint = (color: string) =>
        gsap.to(root.current, { backgroundColor: color, duration: 0.7, ease: 'power2.out', overwrite: 'auto' })

      const stops: [string, string][] = [
        ['.work__intro', INK],
        ...projects.map((p, i): [string, string] => [`.card:nth-of-type(${i + 1})`, p.bg]),
      ]
      stops.forEach(([sel, color]) =>
        ScrollTrigger.create({
          trigger: sel,
          containerAnimation: scroll,
          start: 'left 65%',
          end: 'right 35%',
          onToggle: (self) => self.isActive && paint(color),
        }),
      )

      // Cards lift and the image settles as each one arrives
      gsap.utils.toArray<HTMLElement>('.card').forEach((card) => {
        gsap.from(card.querySelector('.card__img'), {
          scale: 1.25,
          ease: 'none',
          scrollTrigger: { trigger: card, containerAnimation: scroll, start: 'left 100%', end: 'left 30%', scrub: true },
        })
        gsap.from(card.querySelectorAll('.card__meta > *'), {
          y: 40,
          opacity: 0,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, containerAnimation: scroll, start: 'left 85%', toggleActions: 'play none none reverse' },
        })
      })
    },
    { scope: root },
  )

  return (
    <section className="work" ref={root} id="work">
      <div className="work__track" ref={track}>
        <div className="work__intro">
          <span className="label">Études de cas</span>
          <h2>
            Travaux
            <br />
            sélectionnés
          </h2>
          <p>
            {String(projects.length).padStart(2, '0')} projets <span aria-hidden="true">→</span>
          </p>
        </div>

        {projects.map((p) => (
          <article className="card" key={p.slug}>
            <button
              className="card__open"
              onClick={() => onOpen(p)}
              aria-label={`Voir l'étude de cas : ${p.name}`}
              data-cursor="Voir"
            >
              <div className="card__frame" style={{ ['--accent' as string]: p.accent }}>
                <img className="card__img" src={mockupOf(p)} alt="" draggable={false} />
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

        <div className="work__outro">
          <span className="label">Fin</span>
          <p>Et la suite ?</p>
        </div>
      </div>
    </section>
  )
}

import { useRef } from 'react'
import { gsap, SplitText, prefersReducedMotion, useGSAP } from '../lib/gsap'

const bio =
  "Avec plus de 15 ans d'expérience en design numérique, UI/UX et direction artistique, j'accompagne les entreprises, agences et grands comptes dans la création de produits digitaux performants, d'architectures d'information complexes et d'identités visuelles mémorables."

const columns = [
  { title: 'Expertise', items: ['Figma', 'Suite Adobe CC', 'WordPress', 'Midjourney · Ideogram · Claude Code · Suno · Veo · Gemini · NotebookLM'] },
  {
    title: 'Compétences',
    items: ['Design systems & composants', 'Prototypage haute fidélité', 'Direction créative & branding', "Architecture de l'information", 'IA générative'],
  },
  {
    title: 'Intérêts',
    items: ['Photographie & drone', 'Création musicale & audio génératif', 'Curation typographique & culture visuelle', 'Fat-bike & exploration plein air'],
  },
]

const experience = [
  { years: '2024—2026', company: 'SmartBug Media', role: 'Senior UI/UX & Lead Product Designer' },
  { years: '2022—2024', company: 'Globalia', role: 'UI/UX Designer & Directeur artistique' },
  { years: '2017—2021', company: 'Inovision Web', role: 'Designer UI/UX' },
  { years: '2012—2016', company: 'Empire Sport', role: 'Directeur artistique & image de marque' },
]

export default function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // Reduced motion: the bio is solid ink (see CSS), photo and lists are simply there
      if (prefersReducedMotion()) return

      // Bio: each line carries a copy of itself; the solid layer is masked open as you scroll
      SplitText.create('.about__text', {
        type: 'lines',
        autoSplit: true,
        onSplit: (self) => {
          self.lines.forEach((line) => line.setAttribute('data-text', line.textContent ?? ''))
          return gsap.fromTo(
            self.lines,
            { '--r': '0%' },
            {
              '--r': '100%',
              ease: 'none',
              stagger: 1,
              scrollTrigger: { trigger: '.about__text', start: 'top 80%', end: 'bottom 45%', scrub: true },
            },
          )
        },
      })

      gsap.fromTo(
        '.about__photo',
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          ease: 'power3.out',
          duration: 1.2,
          scrollTrigger: { trigger: '.about__photo', start: 'top 85%' },
        },
      )
      gsap.to('.about__photo img', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: { trigger: '.about__photo', start: 'top bottom', end: 'bottom top', scrub: true },
      })

      gsap.from('.about__col, .xp__row', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about__cols', start: 'top 85%' },
      })
    },
    { scope: root },
  )

  return (
    <section className="about" ref={root} id="about">
      <div className="about__top">
        <div>
          <span className="tag">À propos de moi</span>
          <p className="about__text">{bio}</p>
        </div>
        <figure className="about__photo">
          <img
            src={`${import.meta.env.BASE_URL}me.webp`}
            alt="Sébastien Lemyre en selfie dans les montagnes, entouré de photos : fat-bike, appareil photo, basse sur scène et skateboard"
            loading="lazy"
            decoding="async"
          />
        </figure>
      </div>

      <div className="about__cols">
        {columns.map((c) => (
          <div className="about__col" key={c.title}>
            <h3 className="label">{c.title}</h3>
            <ul>
              {c.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="xp">
        <h3 className="label">Expérience</h3>
        {experience.map((x) => (
          <div className="xp__row" key={x.company}>
            <span>{x.years}</span>
            <strong>{x.company}</strong>
            <span>{x.role}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

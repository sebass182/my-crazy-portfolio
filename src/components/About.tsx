import { useRef } from 'react'
import { gsap, SplitText, prefersReducedMotion, useGSAP } from '../lib/gsap'

const base = import.meta.env.BASE_URL

// The montage: x / y / w are % of the montage box (positions taken from the original deck collage), r = resting tilt (deg).
// Every photo has its own speed: d = cursor depth, sy / sx = how far it travels (px) over the scroll, z0 → z1 = its zoom range.
// The nearer a photo is, the faster it moves and the more it zooms.
const photos = [
  { f: 'selfie', w: 900, h: 1159, x: 24.2, y: 10.8, wd: 73.2, z: 1, r: 0, d: 0.6, sy: 45, sx: 0, z0: 0.9, z1: 1.07, alt: 'Sébastien en selfie, casquette à l’envers, au sommet d’une montagne' },
  { f: 'bass', w: 600, h: 860, x: 75.3, y: 0.5, wd: 24.7, z: 2, r: 3, d: 1.2, sy: 150, sx: -26, z0: 0.72, z1: 1.22, alt: 'Sur scène à la basse, dans des traînées de lumière rouge' },
  { f: 'bike', w: 148, h: 202, x: 17.4, y: 2, wd: 19.3, z: 3, r: -4, d: 1.7, sy: 240, sx: 34, z0: 0.6, z1: 1.45, alt: 'Un fat-bike sur un pont de métal au coucher du soleil' },
  { f: 'camera', w: 640, h: 824, x: 0, y: 40, wd: 34.7, z: 4, r: -2.5, d: 1.4, sy: 100, sx: 30, z0: 0.78, z1: 1.18, alt: 'Reflet derrière une vitre, un appareil photo devant le visage' },
  { f: 'skate', w: 560, h: 722, x: 65, y: 68.5, wd: 27, z: 4, r: 4, d: 1.9, sy: 195, sx: -34, z0: 0.66, z1: 1.32, alt: 'Un saut de skateboard devant une clôture, photo d’archive' },
]

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

      gsap.from('.about__col, .xp__row', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about__cols', start: 'top 85%', end: 'bottom top', toggleActions: 'play reverse play reverse' },
      })

      /* Montage.
         Channels per layer, so nothing fights: .aura = entrance; .aura__b = scroll swirl;
         .cp = entrance (scale, opacity) + cursor parallax (x, y); .cp__s = scroll travel + scroll zoom (y, x, scale);
         img = a slower zoom inside the photo's own frame; .cp__f = resting tilt (CSS). */
      const cps = gsap.utils.toArray<HTMLElement>('.cp')
      // the montage's own journey: from entering at the bottom of the screen to leaving at the top
      const journey = { trigger: '.about__top', start: 'top bottom', end: 'bottom top' }

      // the soft round gradient swells in, then the photos zoom in one after another (replays after you go back above it)
      gsap.from('.aura', {
        scale: 0.4,
        opacity: 0,
        duration: 1.8,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.about__photo', start: 'top 88%', toggleActions: 'play none none reverse' },
      })
      gsap.from(cps, {
        scale: 0.55,
        opacity: 0,
        duration: 1.4,
        ease: 'expo.out',
        stagger: 0.11,
        scrollTrigger: { trigger: '.about__photo', start: 'top 82%', toggleActions: 'play none none reverse' },
      })

      // the colours drift while you scroll
      gsap.fromTo('.aura__b', { rotation: -40, scale: 0.9 }, { rotation: 140, scale: 1.12, ease: 'none', scrollTrigger: { ...journey, scrub: 1 } })

      photos.forEach((p, i) => {
        const cp = cps[i]
        // each photo travels its own distance (nearer = faster) and zooms from far to near; a longer scrub = a lazier follow
        gsap.fromTo(
          cp.querySelector('.cp__s'),
          { y: p.sy, x: -p.sx, scale: p.z0 },
          { y: -p.sy, x: p.sx, scale: p.z1, ease: 'none', scrollTrigger: { ...journey, scrub: 0.4 + p.sy / 220 } },
        )
        // and the picture inside its frame zooms a little more
        gsap.fromTo(cp.querySelector('img'), { scale: 1 }, { scale: 1.16, ease: 'none', scrollTrigger: { ...journey, scrub: true } })
      })

      // cursor parallax (mouse only)
      const photo = root.current!.querySelector<HTMLElement>('.about__photo')!
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const movers = cps.map((cp) => ({
          d: Number(cp.dataset.depth),
          x: gsap.quickTo(cp, 'x', { duration: 0.9, ease: 'power3.out' }),
          y: gsap.quickTo(cp, 'y', { duration: 0.9, ease: 'power3.out' }),
        }))
        const onMove = (e: PointerEvent) => {
          const r = photo.getBoundingClientRect()
          const nx = (e.clientX - r.left) / r.width - 0.5
          const ny = (e.clientY - r.top) / r.height - 0.5
          movers.forEach((m) => (m.x(-nx * m.d * 14), m.y(-ny * m.d * 14)))
        }
        const onLeave = () => movers.forEach((m) => (m.x(0), m.y(0)))
        photo.addEventListener('pointermove', onMove)
        photo.addEventListener('pointerleave', onLeave)
        return () => {
          photo.removeEventListener('pointermove', onMove)
          photo.removeEventListener('pointerleave', onLeave)
        }
      }

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
        <figure className="about__photo" aria-label="Montage de photos de Sébastien : selfie en montagne, fat-bike, appareil photo, basse sur scène et skateboard">
          <div className="aura" aria-hidden="true">
            <div className="aura__b" />
          </div>
          <div className="collage">
            {photos.map((p) => (
              <div
                className="cp"
                key={p.f}
                data-depth={p.d}
                style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.wd}%`, zIndex: p.z, ['--tilt' as string]: `${p.r}deg` }}
              >
                <div className="cp__s">
                  <div className="cp__f">
                    <img src={`${base}about/${p.f}.webp`} width={p.w} height={p.h} alt={p.alt} decoding="async" draggable={false} />
                  </div>
                </div>
              </div>
            ))}
          </div>
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

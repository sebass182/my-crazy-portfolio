import { useMemo, useRef, useState } from 'react'
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion, useGSAP } from '../lib/gsap'
import Lightbox, { type LightboxItem } from './Lightbox'

const base = import.meta.env.BASE_URL
const src = (file: string) => `${base}cards/holo-md/${file}`

// Every image carries its real size so the browser reserves the space before it loads
// (otherwise the page grows after the scroll triggers were measured and they fire in the wrong place).
const IMG = {
  login: ['login.webp', 1600, 1021],
  woman: ['woman.webp', 839, 1080],
  site: ['microsite.webp', 900, 1289],
  drcard: ['drcard.webp', 420, 846],
  bruce: ['bruce.webp', 360, 574],
  diamond: ['diamond.webp', 429, 735],
  gem: ['gem.svg', 40, 38],
  swoosh: ['swoosh.svg', 1142, 1090],
  welcome: ['phone-welcome.webp', 520, 1127],
  chat: ['phone-chat.webp', 520, 1127],
  history: ['phone-history.webp', 520, 1127],
  dash: ['dash.webp', 1100, 550],
  patient: ['patient.webp', 1100, 550],
  doctor: ['doctor.webp', 1100, 550],
} as const
type Key = keyof typeof IMG

function Pic({ k, alt = '', className }: { k: Key; alt?: string; className?: string }) {
  const [file, w, h] = IMG[k]
  return <img className={className} src={src(file)} width={w} height={h} alt={alt} decoding="async" draggable={false} />
}

// ─────────────────────────────────────────────────────────────────────────────────────────────
// The three numbered sections rebuild the deck slides. Each layer's x / y / w are percentages of the
// slide's right-hand panel (839×1080), measured on the Figma slides, so the arrangement matches the PDF.
// d = depth: how far the layer travels with the scroll and follows the cursor (back ≈ 0.3, front ≈ 2).
// ─────────────────────────────────────────────────────────────────────────────────────────────
type Layer = { k: Key; alt?: string; x: number; y: number; w: number; z: number; d: number; kind: 'card' | 'phone' | 'screen' | 'page' | 'free' }

const BRAND: Layer[] = [
  { k: 'site', alt: 'Micro-site Holo MD : « Rehumanizing Psychiatry in a New Era of AI-Powered Care »', x: 12.9, y: 8.6, w: 74.4, z: 1, d: 0.5, kind: 'page' },
  { k: 'diamond', x: 83.3, y: 26.2, w: 17, z: 2, d: 1.8, kind: 'free' },
  { k: 'drcard', alt: 'Carte « Dr. Holo is designed to be an empathetic, caring, trustworthy… »', x: -4.1, y: 43.1, w: 21, z: 3, d: 1.3, kind: 'card' },
  { k: 'bruce', alt: 'Carte de Bruce A. Kehr, fondateur et chef de la direction', x: 80.1, y: 76.2, w: 15.5, z: 3, d: 1.6, kind: 'card' },
  { k: 'gem', x: 4, y: 91.5, w: 4.8, z: 3, d: 2.4, kind: 'free' },
  { k: 'gem', x: 78, y: 31.8, w: 2.1, z: 3, d: 2.8, kind: 'free' },
]

const APP: Layer[] = [
  { k: 'swoosh', x: -4, y: -8, w: 142, z: 0, d: 0.3, kind: 'free' },
  { k: 'chat', alt: "Application Holo MD : conversation avec l'assistant Dr. Holo", x: 4.3, y: 29.5, w: 27.3, z: 1, d: 1.0, kind: 'phone' },
  { k: 'history', alt: 'Application Holo MD : historique des échanges par période', x: 68.7, y: 29.5, w: 27.3, z: 1, d: 1.0, kind: 'phone' },
  { k: 'welcome', alt: "Application Holo MD : écran d'accueil « Welcome », saisie du code fourni par le clinicien", x: 34.4, y: 26.1, w: 31.3, z: 2, d: 1.7, kind: 'phone' },
  { k: 'gem', x: 9.8, y: 88.7, w: 8, z: 3, d: 2.4, kind: 'free' },
]

const DASH: Layer[] = [
  { k: 'dash', alt: "Dashboard : vue d'ensemble des patients, statistiques mensuelles et liste", x: 16.4, y: 7.2, w: 67.7, z: 1, d: 0.5, kind: 'screen' },
  { k: 'patient', alt: "Fiche patient : informations, notes et historique d'humeur", x: 10.8, y: 30.2, w: 78.9, z: 2, d: 1.0, kind: 'screen' },
  { k: 'doctor', alt: 'Profil du Dr Bruce et liste des patients avec leur humeur', x: 6.6, y: 57.9, w: 87.5, z: 3, d: 1.6, kind: 'screen' },
]

const slides = [
  {
    id: 'brand',
    n: '01',
    title: "Branding global, Brandbook & vitrine d'investissement",
    text: "Création de l'identité visuelle HoloMD. Déclinaison sur le Brandbook institutionnel et design du micro-site responsive conçu pour présenter la technologie aux investisseurs et partenaires cliniques.",
    layers: BRAND,
  },
  {
    id: 'app',
    n: '02',
    title: 'Application patient & suivi thérapeutique à distance (RTM)',
    text: "Conception UX/UI de l'application mobile intégrant l'assistant IA Dr. Holo™. L'interface assure un onboarding sécurisé (HIPAA), la gestion des consentements et des échanges quotidiens empathiques pour évaluer l'évolution des symptômes.",
    layers: APP,
  },
  {
    id: 'dash',
    n: '03',
    title: 'Dashboard psychiatre & aide à la décision clinique',
    text: 'Design de la plateforme web pour les médecins : visualisation en temps réel des données patients, alertes cliniques pour ajuster les traitements et automatisation de la facturation via les codes de remboursement RTM (Medicare / Assurances).',
    layers: DASH,
  },
]

// what can be enlarged on a slide: the modules (the diamond, gems and swoosh are decoration)
const zoomable = (layers: Layer[]) => layers.filter((l) => l.kind !== 'free')

export default function HoloCase() {
  const root = useRef<HTMLDivElement>(null)

  // Enlarging (the Agrandir button under each text): one group per slide, its modules in order
  const [zoom, setZoom] = useState<{ g: number; i: number } | null>(null)
  const groups = useMemo<LightboxItem[][]>(() => {
    const item = (k: Key, alt: string, round = false): LightboxItem => ({ src: src(IMG[k][0]), alt, w: IMG[k][1], h: IMG[k][2], round })
    return [
      ...slides.map((s) => zoomable(s.layers).map((l, i) => item(l.k, l.alt ?? `${s.title} : maquette ${i + 1}`, l.kind === 'page'))),
    ]
  }, [])

  useGSAP(
    () => {
      if (prefersReducedMotion()) return // static: the compositions simply sit there

      const el = root.current!
      const scroller = el.closest<HTMLElement>('.pv__scroll')
      if (!scroller) return

      const q = <T extends Element>(sel: string) => el.querySelector<T>(sel)!
      const all = <T extends Element>(sel: string, from: ParentNode = el) => gsap.utils.toArray<T>(sel, from)
      // Plays when the trigger scrolls into view from EITHER direction and rewinds when it leaves,
      // so the animation can be watched again on the way back up. Sticky triggers (the stacking cards) stay on screen
      // while "scrolled past", so they only rewind when you go back above their start.
      const view = (trigger: Element, start = 'top 85%', sticky = false) => ({
        trigger,
        scroller,
        start,
        end: 'bottom top',
        toggleActions: sticky ? 'play none none reverse' : 'play reverse play reverse',
      })
      const rise = (targets: gsap.TweenTarget, trigger: Element, start?: string, extra: gsap.TweenVars = {}, sticky = false) =>
        gsap.from(targets, { y: 28, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, scrollTrigger: view(trigger, start, sticky), ...extra })

      /* Hero: the sign-in screen opens like a curtain */
      gsap.fromTo(
        q('.hc-hero__frame'),
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'expo.out', scrollTrigger: view(q('.hc-hero'), 'top 92%') },
      )

      /* Context */
      SplitText.create('.hc-lead', {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, { yPercent: 110, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: view(q('.hc-intro'), 'top 78%') }),
      })
      gsap.fromTo(
        q('.hc-photo'),
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'expo.out', scrollTrigger: view(q('.hc-photo'), 'top 88%') },
      )

      /* The three slides are the stacking cards: each one is sticky, the next slides over it while the covered slide
         steps back (scale + a shade). The sticky offset is clamped so a slide taller than the screen (phones) parks with
         its bottom edge in view instead of being cut off. (Same as CaseStudy.tsx.) */
      const phone = window.matchMedia('(max-width: 800px)').matches
      const stack = all<HTMLElement>('.hc-slide--card')
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
      const park = () =>
        stack.forEach((li, i) => {
          const wanted = (phone ? 4.6 + i : 5.6 + i * 1.5) * rem
          li.style.top = `${Math.min(wanted, scroller.clientHeight - li.offsetHeight - 14)}px`
        })
      park()
      ScrollTrigger.addEventListener('refreshInit', park)
      stack.forEach((li, i) => {
        const next = stack[i + 1]
        if (!next) return
        const cover = { trigger: next, scroller, start: 'top bottom', end: () => `top ${parseFloat(next.style.top) || 0}px`, scrub: true, invalidateOnRefresh: true }
        gsap.to(li, { scale: 0.93, ease: 'none', scrollTrigger: cover })
        gsap.to(li.querySelector('.hc-slide__shade'), { opacity: 0.66, ease: 'none', scrollTrigger: cover })
      })

      /* The three slides.
         Three independent channels per layer so the effects never fight each other:
           .hl     → entrance (opacity, scale) + pointer parallax (x, y)
           .hl__s  → scroll parallax (y)
           img     → hover lift (CSS)                                                              */
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      const cleanups: Array<() => void> = []

      all<HTMLElement>('.hc-slide').forEach((slide) => {
        const stage = slide.querySelector<HTMLElement>('.hc-slide__stage')!
        const layers = all<HTMLElement>('.hl', stage)

        rise(slide.querySelector('.hc-slide__copy')!.children, slide, 'top 78%', {}, true) // a parked card is still on screen once "scrolled past"

        // entrance: the layers settle in one after another, back to front
        gsap.from(layers, {
          opacity: 0,
          scale: 0.92,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: view(slide, 'top 72%', true),
        })

        // scroll parallax: the deeper the layer, the further it travels
        const amp = phone ? 22 : 38
        layers.forEach((l) => {
          const d = Number(l.dataset.depth)
          gsap.fromTo(
            l.querySelector('.hl__s'),
            { y: d * amp },
            { y: -d * amp, ease: 'none', scrollTrigger: { trigger: slide, scroller, start: 'top bottom', end: 'bottom top', scrub: true } },
          )
        })

        // pointer parallax + a soft spotlight that follows the cursor (mouse only)
        if (fine) {
          const movers = layers.map((l) => ({
            d: Number(l.dataset.depth),
            x: gsap.quickTo(l, 'x', { duration: 0.9, ease: 'power3.out' }),
            y: gsap.quickTo(l, 'y', { duration: 0.9, ease: 'power3.out' }),
          }))
          let raf = 0
          const onMove = (e: PointerEvent) => {
            const r = stage.getBoundingClientRect()
            const nx = (e.clientX - r.left) / r.width - 0.5
            const ny = (e.clientY - r.top) / r.height - 0.5
            movers.forEach((m) => {
              m.x(-nx * m.d * 26)
              m.y(-ny * m.d * 26)
            })
            if (!raf)
              raf = requestAnimationFrame(() => {
                raf = 0
                stage.style.setProperty('--mx', `${(nx + 0.5) * 100}%`)
                stage.style.setProperty('--my', `${(ny + 0.5) * 100}%`)
              })
          }
          const onLeave = () => movers.forEach((m) => (m.x(0), m.y(0)))
          stage.addEventListener('pointermove', onMove)
          stage.addEventListener('pointerleave', onLeave)
          cleanups.push(() => {
            stage.removeEventListener('pointermove', onMove)
            stage.removeEventListener('pointerleave', onLeave)
            cancelAnimationFrame(raf)
          })
        }
      })

      // The page is at its final size: measure every trigger once more after the images are decoded.
      let alive = true
      Promise.all([...el.querySelectorAll('img')].map((img) => img.decode().catch(() => {}))).then(() => alive && ScrollTrigger.refresh())
      return () => {
        alive = false
        ScrollTrigger.removeEventListener('refreshInit', park)
        cleanups.forEach((fn) => fn())
      }
    },
    { scope: root },
  )

  return (
    <div className="hc" ref={root}>
      {/* Hero visual */}
      <section className="hc-hero" aria-label="Écran de connexion de la plateforme Holo MD">
        <div className="hc-hero__frame">
          <Pic k="login" className="hc-hero__img" alt="Écran de connexion Holo MD : « Imagine a New Era of AI-Powered Psychiatric Care »" />
        </div>
      </section>

      {/* Context */}
      <section className="hc-intro" aria-label="Contexte du projet">
        <div>
          <span className="hc-eyebrow">À propos</span>
          <p className="hc-lead">
            Projet d'innovation pour des leaders de la psychiatrie. HoloMD combine un assistant IA conversationnel (Dr. Holo™) pour le suivi
            thérapeutique à distance (RTM) et un tableau de bord analytique permettant aux psychiatres d'ajuster les traitements et
            d'automatiser la facturation médicale.
          </p>
        </div>
        <figure className="hc-photo">
          <Pic k="woman" alt="Une femme assise dans un fauteuil, son téléphone à la main" />
        </figure>
      </section>

      {/* 01 · 02 · 03 — the slides, rebuilt; they are the cards that stack */}
      <div className="hc-stack">
        {slides.map((s, si) => (
          <section className={`hc-slide hc-slide--card hc-slide--${s.id}`} key={s.id} aria-labelledby={`hc-${s.id}-title`}>
            <div className="hc-slide__copy">
              <span className="hc-slide__n">{s.n}</span>
              <div>
                <h3 id={`hc-${s.id}-title`}>{s.title}</h3>
                <p>{s.text}</p>
                <button className="hc-zoom" onClick={() => setZoom({ g: si, i: 0 })} aria-label={`Agrandir les maquettes : ${s.title}`}>
                  Agrandir <span aria-hidden="true">⤢</span>
                </button>
              </div>
            </div>
            <div className="hc-slide__stage">
              {s.layers.map((l, i) => (
                <div
                  className={`hl hl--${l.kind}`}
                  key={`${l.k}-${i}`}
                  data-depth={l.d}
                  style={{ left: `${l.x}%`, top: `${l.y}%`, width: `${l.w}%`, zIndex: l.z }}
                  aria-hidden={l.alt ? undefined : true}
                >
                  <div className="hl__s">
                    <Pic k={l.k} alt={l.alt ?? ''} />
                  </div>
                </div>
              ))}
            </div>
            <i className="hc-slide__shade" />
          </section>
        ))}
      </div>

      {zoom && (
        <Lightbox
          items={groups[zoom.g]}
          index={zoom.i}
          label={slides[zoom.g].title}
          onIndex={(i) => setZoom({ g: zoom.g, i })}
          onClose={() => setZoom(null)}
        />
      )}
    </div>
  )
}

import { useRef } from 'react'
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion, useGSAP } from '../lib/gsap'

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

const goals = [
  {
    n: '01',
    art: 'identity',
    title: "Forger l'identité de marque et le micro-site d'investissement",
    text: 'Déployer le logo, la charte visuelle et le site vitrine pour présenter la vision technologique aux investisseurs et cliniques.',
  },
  {
    n: '02',
    art: 'app',
    title: "Concevoir l'app patient et l'assistant IA (Dr. Holo™)",
    text: 'Structurer une interface mobile empathique réalisant un suivi RTM quotidien via SMS/chat conversationnel.',
  },
  {
    n: '03',
    art: 'dash',
    title: 'Développer le dashboard clinique et la facturation RTM',
    text: "Bâtir un outil d'aide à la décision centralisant les métriques de santé mentale et l'intégration des codes de remboursement.",
  },
]

export default function HoloCase() {
  const root = useRef<HTMLDivElement>(null)

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

      /* Goals: three cards that stack. Each one is sticky; the next slides over it while the covered card
         steps back (scale + shade) and its art drifts up — depth from a single scroll. */
      rise(q('.hc-goals__head').children, q('.hc-goals__head'))
      const stack = all<HTMLElement>('.hc-goal')
      stack.forEach((li, i) => {
        const card = li.querySelector<HTMLElement>('.hc-goal__card')!
        const art = li.querySelector<HTMLElement>('.hc-goal__art')!
        const ghost = li.querySelector<HTMLElement>('.hc-goal__ghost')!
        const shade = li.querySelector<HTMLElement>('.hc-goal__shade')!
        const stuckAt = parseFloat(getComputedStyle(li).top) || 0 // the sticky offset set in CSS

        // arrival: a slight tilt straightens, the art rises into place, the big numeral drifts slower than the card
        gsap.fromTo(li, { rotate: i % 2 ? -2.2 : 2.2 }, { rotate: 0, ease: 'none', scrollTrigger: { trigger: li, scroller, start: 'top bottom', end: `top ${stuckAt + 160}px`, scrub: true } })
        gsap.fromTo(art, { y: 110 }, { y: 0, ease: 'none', scrollTrigger: { trigger: li, scroller, start: 'top bottom', end: `top ${stuckAt}px`, scrub: true } })
        gsap.fromTo(ghost, { y: 70 }, { y: -40, ease: 'none', scrollTrigger: { trigger: li, scroller, start: 'top bottom', end: 'bottom top', scrub: true } })
        rise(li.querySelectorAll('.hc-goal__n, strong, p'), li, 'top 80%', {}, true)

        // being covered by the next card
        const next = stack[i + 1]
        if (next) {
          const nextStuck = parseFloat(getComputedStyle(next).top) || 0
          const cover = { trigger: next, scroller, start: 'top bottom', end: `top ${nextStuck}px`, scrub: true }
          gsap.to(card, { scale: 0.92, ease: 'none', scrollTrigger: cover })
          gsap.to(shade, { opacity: 0.62, ease: 'none', scrollTrigger: cover })
          gsap.to(art, { yPercent: -12, ease: 'none', scrollTrigger: cover })
        }
      })

      /* The three slides.
         Three independent channels per layer so the effects never fight each other:
           .hl     → entrance (opacity, scale) + pointer parallax (x, y)
           .hl__s  → scroll parallax (y)
           img     → hover lift (CSS)                                                              */
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      const phone = window.matchMedia('(max-width: 800px)').matches
      const cleanups: Array<() => void> = []

      all<HTMLElement>('.hc-slide').forEach((slide) => {
        const stage = slide.querySelector<HTMLElement>('.hc-slide__stage')!
        const layers = all<HTMLElement>('.hl', stage)

        rise(slide.querySelector('.hc-slide__copy')!.children, slide, 'top 78%')

        // entrance: the layers settle in one after another, back to front
        gsap.from(layers, {
          opacity: 0,
          scale: 0.92,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: view(slide, 'top 72%'),
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

      {/* Goals */}
      <section className="hc-goals" aria-labelledby="hc-goals-title">
        <div className="hc-goals__head">
          <div>
            <span className="hc-eyebrow">Objectifs</span>
            <h3 id="hc-goals-title">Une expérience médicale hautement sécurisée (HIPAA)</h3>
          </div>
          <p>Bâtir une expérience médicale hautement sécurisée (HIPAA) qui connecte en continu le patient à son équipe de soins.</p>
        </div>
        <ol className="hc-stack">
          {goals.map((g, i) => (
            <li className={`hc-goal hc-goal--${g.art}`} key={g.n} style={{ ['--i' as string]: i }}>
              <div className="hc-goal__card">
                <span className="hc-goal__ghost" aria-hidden="true">
                  {g.n}
                </span>
                <div className="hc-goal__body">
                  <span className="hc-goal__n">{g.n} / 03</span>
                  <div>
                    <strong>{g.title}</strong>
                    <p>{g.text}</p>
                  </div>
                </div>
                <div className="hc-goal__art" aria-hidden="true">
                  {g.art === 'identity' && (
                    <>
                      <Pic k="diamond" className="ga ga--diamond" />
                      <Pic k="gem" className="ga ga--gem" />
                    </>
                  )}
                  {g.art === 'app' && (
                    <>
                      <Pic k="history" className="ga ga--phone-b" />
                      <Pic k="welcome" className="ga ga--phone-a" />
                    </>
                  )}
                  {g.art === 'dash' && (
                    <>
                      <Pic k="dash" className="ga ga--screen-b" />
                      <Pic k="doctor" className="ga ga--screen-a" />
                    </>
                  )}
                </div>
                <i className="hc-goal__shade" />
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 01 · 02 · 03 — the slides, rebuilt */}
      {slides.map((s) => (
        <section className={`hc-slide hc-slide--${s.id}`} key={s.id} aria-labelledby={`hc-${s.id}-title`}>
          <div className="hc-slide__copy">
            <span className="hc-slide__n">{s.n}</span>
            <div>
              <h3 id={`hc-${s.id}-title`}>{s.title}</h3>
              <p>{s.text}</p>
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
        </section>
      ))}
    </div>
  )
}

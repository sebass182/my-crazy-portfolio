import { useRef } from 'react'
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion, useGSAP } from '../lib/gsap'

const base = import.meta.env.BASE_URL
const src = (file: string) => `${base}cards/holo-md/${file}`

// Every image carries its real size so the browser reserves the space before it loads.
// (Without it the page jumped ~500px when images arrived and the scroll triggers fired in the wrong place.)
const IMG = {
  login: ['login.webp', 1600, 1021],
  woman: ['woman.webp', 839, 1080],
  site: ['microsite.webp', 900, 1289],
  drcard: ['drcard.webp', 420, 846],
  bruce: ['bruce.webp', 360, 574],
  diamond: ['diamond.webp', 429, 735],
  gem: ['gem.svg', 40, 38],
  welcome: ['phone-welcome.webp', 520, 1127],
  chat: ['phone-chat.webp', 520, 1127],
  history: ['phone-history.webp', 520, 1127],
  dash: ['dash.webp', 1100, 550],
  patient: ['patient.webp', 1100, 550],
  doctor: ['doctor.webp', 1100, 550],
} as const

function Pic({ k, alt, className }: { k: keyof typeof IMG; alt: string; className?: string }) {
  const [file, w, h] = IMG[k]
  return <img className={className} src={src(file)} width={w} height={h} alt={alt} decoding="async" draggable={false} />
}

// Copy is word for word from the deck slides.
const goals = [
  {
    n: '01',
    title: "Forger l'identité de marque et le micro-site d'investissement",
    text: 'Déployer le logo, la charte visuelle et le site vitrine pour présenter la vision technologique aux investisseurs et cliniques.',
  },
  {
    n: '02',
    title: "Concevoir l'app patient et l'assistant IA (Dr. Holo™)",
    text: 'Structurer une interface mobile empathique réalisant un suivi RTM quotidien via SMS/chat conversationnel.',
  },
  {
    n: '03',
    title: 'Développer le dashboard clinique et la facturation RTM',
    text: "Bâtir un outil d'aide à la décision centralisant les métriques de santé mentale et l'intégration des codes de remboursement.",
  },
]

// Short labels read off the screens
const appSteps = ['Onboarding sécurisé', 'Échanges avec Dr. Holo', 'Historique des symptômes']
const dashSteps = ["Vue d'ensemble des patients", "Fiche patient et historique d'humeur", 'Profil du médecin et liste des patients']

function Eyebrow({ n, label }: { n: string; label: string }) {
  return (
    <span className="hc-eyebrow">
      <img src={src('gem.svg')} width={14} height={13} alt="" />
      {n} — {label}
    </span>
  )
}

function Steps({ items, onPick, label }: { items: string[]; onPick: (i: number) => void; label: string }) {
  return (
    <ol className="hc-steps" aria-label={label}>
      {items.map((s, i) => (
        <li key={s}>
          <button type="button" onClick={() => onPick(i)}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            {s}
          </button>
        </li>
      ))}
    </ol>
  )
}

export default function HoloCase() {
  const root = useRef<HTMLDivElement>(null)

  // Clicking a step jumps to it: scroll to that third of the pinned section (or just show the item when motion is off)
  const jump = (sel: string, i: number) => {
    const el = root.current
    const scroller = el?.closest<HTMLElement>('.pv__scroll')
    const section = el?.querySelector<HTMLElement>(sel)
    if (!el || !scroller || !section) return
    if (prefersReducedMotion()) {
      section.querySelectorAll('.hc-item')[i]?.scrollIntoView({ block: 'center' })
      return
    }
    const top = section.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop
    const travel = section.offsetHeight - scroller.clientHeight
    scroller.scrollTo({ top: top + ((i + 0.5) / 3) * travel, behavior: 'smooth' })
  }

  useGSAP(
    () => {
      if (prefersReducedMotion()) return // static layout: everything simply sits in the page

      const el = root.current!
      const scroller = el.closest<HTMLElement>('.pv__scroll')
      if (!scroller) return

      const q = <T extends Element>(sel: string) => el.querySelector<T>(sel)!
      const all = <T extends Element>(sel: string) => gsap.utils.toArray<T>(sel, el)
      const once = (trigger: Element, start = 'top 85%') => ({ trigger, scroller, start, once: true })

      // Reveal helper: a short, quiet rise. Used everywhere so the page moves with one voice.
      const rise = (targets: gsap.TweenTarget, trigger: Element, start?: string, extra: gsap.TweenVars = {}) =>
        gsap.from(targets, { y: 28, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, scrollTrigger: once(trigger, start), ...extra })

      /* ── Hero: the sign-in screen opens like a curtain, the image drifts a touch ── */
      gsap.fromTo(
        q('.hc-hero__frame'),
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'expo.out', scrollTrigger: once(q('.hc-hero'), 'top 92%') },
      )
      gsap.fromTo(
        q('.hc-hero__img'),
        { yPercent: -4 },
        { yPercent: 4, ease: 'none', scrollTrigger: { trigger: q('.hc-hero'), scroller, start: 'top bottom', end: 'bottom top', scrub: true } },
      )

      /* ── Context ── */
      SplitText.create('.hc-lead', {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, { yPercent: 110, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: once(q('.hc-intro'), 'top 78%') }),
      })
      gsap.fromTo(
        q('.hc-photo'),
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'expo.out', scrollTrigger: once(q('.hc-photo'), 'top 88%') },
      )

      /* ── Goals ── */
      rise(q('.hc-goals__head').children, q('.hc-goals'))
      all('.hc-goal').forEach((g, i) => {
        gsap.from(g.querySelector('.hc-goal__line'), { scaleX: 0, duration: 1, ease: 'expo.out', delay: i * 0.08, scrollTrigger: once(g, 'top 90%') })
        rise(g.querySelectorAll('.hc-goal__n, strong, p'), g, 'top 90%', { delay: 0.12 + i * 0.08 })
      })

      /* ── 01 Brand: the grid assembles itself ── */
      rise(q('.hc-brand .hc-sec__head').children, q('.hc-brand'))
      gsap.from(q('.hc-bento__site'), { clipPath: 'inset(0 0 100% 0)', duration: 1.3, ease: 'expo.out', scrollTrigger: once(q('.hc-bento'), 'top 82%') })
      rise(all('.hc-bento > :not(.hc-bento__site)'), q('.hc-bento'), 'top 78%', { delay: 0.2 })

      /* ── Pinned sections: one step per third of the scroll, played as a short tween (not scrubbed) ── */
      const pinned = (sel: string, apply: (i: number, instant: boolean) => void) => {
        const section = q<HTMLElement>(sel)
        const steps = all<HTMLElement>(`${sel} .hc-steps li`)
        let current = -1
        const show = (i: number, instant = false) => {
          if (i === current) return
          current = i
          steps.forEach((s, k) => s.classList.toggle('is-on', k === i))
          apply(i, instant)
        }
        show(0, true)
        ScrollTrigger.create({
          trigger: section,
          scroller,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            section.style.setProperty('--p', self.progress.toFixed(4)) // drives the progress line
            show(Math.min(2, Math.floor(self.progress * 3)))
          },
        })
        rise(section.querySelector('.hc-sec__head')!.children, section, 'top 70%')
      }

      // Patient app: the screen in focus sits in the middle, its neighbours step back.
      const phones = all<HTMLElement>('.hc-app .hc-ph')
      gsap.set(phones, { xPercent: -50, yPercent: -50 })
      pinned('.hc-app', (i, instant) =>
        phones.forEach((p, k) => {
          const d = k - i
          gsap.to(p, {
            xPercent: -50 + d * 88,
            scale: d === 0 ? 1 : 0.72,
            opacity: d === 0 ? 1 : Math.abs(d) === 1 ? 0.35 : 0,
            zIndex: 3 - Math.abs(d),
            duration: instant ? 0 : 0.9,
            ease: 'expo.out',
            overwrite: 'auto',
          })
        }),
      )

      // Dashboard: one screen at a time inside a fixed frame; the next slides up, the last lifts away.
      const decks = all<HTMLElement>('.hc-dash .hc-deck')
      pinned('.hc-dash', (i, instant) =>
        decks.forEach((d, k) => {
          const rel = k - i
          gsap.to(d, {
            opacity: rel === 0 ? 1 : 0,
            yPercent: rel === 0 ? 0 : rel < 0 ? -6 : 6,
            scale: rel === 0 ? 1 : 0.97,
            duration: instant ? 0 : 0.8,
            ease: 'power3.out',
            overwrite: 'auto',
          })
        }),
      )

      // The page is now at its final size: measure every trigger again once the images are decoded.
      let alive = true
      Promise.all([...el.querySelectorAll('img')].map((img) => img.decode().catch(() => {}))).then(() => alive && ScrollTrigger.refresh())
      return () => {
        alive = false
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
        <ol>
          {goals.map((g) => (
            <li className="hc-goal" key={g.n}>
              <i className="hc-goal__line" />
              <span className="hc-goal__n">{g.n}</span>
              <strong>{g.title}</strong>
              <p>{g.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 01 · Branding */}
      <section className="hc-brand" aria-labelledby="hc-brand-title">
        <div className="hc-row">
          <header className="hc-sec__head">
            <Eyebrow n="01" label="Branding" />
            <h3 id="hc-brand-title">Branding global, Brandbook &amp; vitrine d'investissement</h3>
            <p>
              Création de l'identité visuelle HoloMD. Déclinaison sur le Brandbook institutionnel et design du micro-site responsive conçu pour
              présenter la technologie aux investisseurs et partenaires cliniques.
            </p>
          </header>
          <div className="hc-bento">
            <Pic k="site" className="hc-bento__site" alt="Micro-site Holo MD : « Rehumanizing Psychiatry in a New Era of AI-Powered Care »" />
            <Pic k="drcard" className="hc-bento__dr" alt="Carte « Dr. Holo is designed to be an empathetic, caring, trustworthy… »" />
            <Pic k="bruce" className="hc-bento__bruce" alt="Carte de Bruce A. Kehr, fondateur et chef de la direction" />
            <div className="hc-bento__tile hc-bento__tile--a" aria-hidden="true">
              <Pic k="diamond" alt="" />
            </div>
            <div className="hc-bento__tile hc-bento__tile--b" aria-hidden="true">
              <Pic k="gem" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* 02 · Patient app (pinned) */}
      <section className="hc-app" aria-labelledby="hc-app-title">
        <div className="hc-pin hc-row">
          <header className="hc-sec__head">
            <Eyebrow n="02" label="Application patient" />
            <h3 id="hc-app-title">Application patient &amp; suivi thérapeutique à distance (RTM)</h3>
            <p>
              Conception UX/UI de l'application mobile intégrant l'assistant IA Dr. Holo™. L'interface assure un onboarding sécurisé (HIPAA), la
              gestion des consentements et des échanges quotidiens empathiques pour évaluer l'évolution des symptômes.
            </p>
          </header>
          <Steps items={appSteps} label="Écrans de l'application" onPick={(i) => jump('.hc-app', i)} />
          <div className="hc-stage hc-app__stage">
            <Pic k="welcome" className="hc-ph hc-item" alt="Application Holo MD : écran d'accueil « Welcome », saisie du code fourni par le clinicien" />
            <Pic k="chat" className="hc-ph hc-item" alt="Application Holo MD : conversation avec l'assistant Dr. Holo" />
            <Pic k="history" className="hc-ph hc-item" alt="Application Holo MD : historique des échanges par période" />
          </div>
        </div>
      </section>

      {/* 03 · Clinical dashboard (pinned) */}
      <section className="hc-dash" aria-labelledby="hc-dash-title">
        <div className="hc-pin hc-row">
          <header className="hc-sec__head">
            <Eyebrow n="03" label="Dashboard clinique" />
            <h3 id="hc-dash-title">Dashboard psychiatre &amp; aide à la décision clinique</h3>
            <p>
              Design de la plateforme web pour les médecins : visualisation en temps réel des données patients, alertes cliniques pour ajuster
              les traitements et automatisation de la facturation via les codes de remboursement RTM (Medicare / Assurances).
            </p>
          </header>
          <Steps items={dashSteps} label="Écrans du dashboard" onPick={(i) => jump('.hc-dash', i)} />
          <div className="hc-stage hc-dash__stage">
            <Pic k="dash" className="hc-deck hc-item" alt="Dashboard : vue d'ensemble des patients, statistiques mensuelles et liste" />
            <Pic k="patient" className="hc-deck hc-item" alt="Fiche patient : informations, notes et historique d'humeur" />
            <Pic k="doctor" className="hc-deck hc-item" alt="Profil du Dr Bruce et liste des patients avec leur humeur" />
          </div>
        </div>
      </section>
    </div>
  )
}

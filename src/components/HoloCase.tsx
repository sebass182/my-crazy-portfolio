import { useRef } from 'react'
import { gsap, SplitText, prefersReducedMotion, useGSAP } from '../lib/gsap'

const base = import.meta.env.BASE_URL
const m = (file: string) => `${base}cards/holo-md/${file}`

// Copy comes word for word from the deck slides; the screens and cards are the Figma modules.
const goals = [
  {
    n: '01',
    title: "Forger l'identité de marque et le micro-site d'investissement :",
    text: 'Déployer le logo, la charte visuelle et le site vitrine pour présenter la vision technologique aux investisseurs et cliniques.',
  },
  {
    n: '02',
    title: "Concevoir l'app patient et l'assistant IA (Dr. Holo™) :",
    text: 'Structurer une interface mobile empathique réalisant un suivi RTM quotidien via SMS/chat conversationnel.',
  },
  {
    n: '03',
    title: 'Développer le dashboard clinique et la facturation RTM :',
    text: "Bâtir un outil d'aide à la décision centralisant les métriques de santé mentale et l'intégration des codes de remboursement.",
  },
]

// Short labels read off the screens themselves
const appSteps = ['Onboarding sécurisé', 'Échanges avec Dr. Holo', 'Historique des symptômes']
const dashSteps = ["Vue d'ensemble des patients", "Fiche patient et historique d'humeur", 'Profil du médecin et liste des patients']

export default function HoloCase() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return // static layout: everything simply sits in the page

      const el = root.current!
      const scroller = el.closest<HTMLElement>('.pv__scroll')
      if (!scroller) return
      el.classList.add('is-anim') // switches the two scrubbed sections to their sticky, stacked layout

      const q = <T extends Element>(sel: string) => el.querySelector<T>(sel)!
      const all = <T extends Element>(sel: string) => gsap.utils.toArray<T>(sel, el)
      const enter = (trigger: Element, start = 'top 85%') => ({ trigger, scroller, start, toggleActions: 'play none none none' })
      const scrub = (trigger: Element, extra = {}) => ({ trigger, scroller, start: 'top bottom', end: 'bottom top', scrub: true, ...extra })

      /* ── Hero: the login screen wipes open, the image drifts inside its frame ── */
      gsap.fromTo(
        q('.hc-hero__frame'),
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.out', scrollTrigger: enter(q('.hc-hero'), 'top 92%') },
      )
      gsap.fromTo(q('.hc-hero__img'), { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: scrub(q('.hc-hero')) })

      /* ── Context: lead text rises line by line, photo wipes open, the brand line drifts ── */
      SplitText.create('.hc-lead', {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, { yPercent: 110, duration: 1, stagger: 0.09, ease: 'expo.out', scrollTrigger: enter(q('.hc-intro'), 'top 78%') }),
      })
      gsap.fromTo(
        q('.hc-photo__frame'),
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'expo.out', scrollTrigger: enter(q('.hc-photo'), 'top 85%') },
      )
      gsap.fromTo(q('.hc-swoosh'), { yPercent: 8, rotate: -4 }, { yPercent: -8, rotate: 4, ease: 'none', scrollTrigger: scrub(q('.hc-intro')) })

      /* ── Goals: heading, lead, then each objective draws its rule and rises ── */
      gsap.from(['.hc-goals__title', '.hc-goals__lead'].map((s) => q(s)), {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: enter(q('.hc-goals')),
      })
      all('.hc-goal').forEach((g, i) => {
        const tl = gsap.timeline({ scrollTrigger: enter(g, 'top 88%'), delay: i * 0.08 })
        tl.from(g.querySelector('.hc-goal__line'), { scaleX: 0, duration: 1, ease: 'expo.out' })
          .from(g.querySelectorAll('.hc-goal__n, strong, p'), { y: 30, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, 0.15)
      })

      /* ── 01 Brand: header, the microsite and the cards slide into a clean grid ── */
      gsap.from(q('.hc-brand .hc-sec__head').children, { y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out', scrollTrigger: enter(q('.hc-brand')) })
      gsap.fromTo(q('.hc-brand__site'), { yPercent: 7 }, { yPercent: -7, ease: 'none', scrollTrigger: scrub(q('.hc-brand__stage')) })
      gsap.from(all('.hc-brand__card'), {
        x: 70,
        opacity: 0,
        duration: 1.1,
        stagger: 0.15,
        ease: 'expo.out',
        scrollTrigger: enter(q('.hc-brand__stage'), 'top 75%'),
      })
      gsap.fromTo(q('.hc-brand__diamond'), { rotate: -14, yPercent: 6 }, { rotate: 6, yPercent: -6, ease: 'none', scrollTrigger: scrub(q('.hc-brand__stage')) })
      gsap.fromTo(q('.hc-brand__gem'), { rotate: -90, scale: 0.7 }, { rotate: 90, scale: 1.1, ease: 'none', scrollTrigger: scrub(q('.hc-brand__stage')) })

      /* ── 02 Patient app: pinned. Three screens take the centre one after the other ── */
      {
        const section = q('.hc-app')
        const [welcome, chat, history] = all<HTMLElement>('.hc-ph')
        const steps = all<HTMLElement>('.hc-app .hc-steps li')
        gsap.set([welcome, chat, history], { xPercent: -50, yPercent: -50 })
        const center = { xPercent: -50, scale: 1, opacity: 1 }
        const left = { xPercent: -135, scale: 0.78, opacity: 0.45 }
        const farLeft = { xPercent: -215, scale: 0.6, opacity: 0 }
        const right = { xPercent: 35, scale: 0.78, opacity: 0.45 }
        const farRight = { xPercent: 115, scale: 0.6, opacity: 0 }
        gsap.set(welcome, center)
        gsap.set(chat, right)
        gsap.set(history, farRight)
        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut', duration: 1 },
          scrollTrigger: {
            trigger: section,
            scroller,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            onUpdate: (self) => {
              const i = self.progress < 0.36 ? 0 : self.progress < 0.7 ? 1 : 2
              steps.forEach((s, k) => s.classList.toggle('is-on', k === i))
            },
          },
        })
        tl.to({}, { duration: 0.3 })
          .to(welcome, left, '>')
          .to(chat, center, '<')
          .to(history, right, '<')
          .to({}, { duration: 0.3 })
          .to(welcome, farLeft, '>')
          .to(chat, left, '<')
          .to(history, center, '<')
          .to({}, { duration: 0.3 })
        steps[0].classList.add('is-on')
      }

      /* ── 03 Dashboard: pinned. The three clinical screens peel off the deck one by one ── */
      {
        const section = q('.hc-dash')
        const [a, b, c] = all<HTMLElement>('.hc-deck')
        const steps = all<HTMLElement>('.hc-dash .hc-steps li')
        const front = { yPercent: 0, scale: 1, opacity: 1, rotateX: 0 }
        const second = { yPercent: 9, scale: 0.94, opacity: 0.85, rotateX: 0 }
        const third = { yPercent: 18, scale: 0.88, opacity: 0.55, rotateX: 0 }
        const gone = { yPercent: -28, scale: 1.04, opacity: 0, rotateX: 14 }
        gsap.set([a, b, c], { transformOrigin: '50% 100%' })
        gsap.set(a, front)
        gsap.set(b, second)
        gsap.set(c, third)
        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut', duration: 1 },
          scrollTrigger: {
            trigger: section,
            scroller,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            onUpdate: (self) => {
              const i = self.progress < 0.36 ? 0 : self.progress < 0.7 ? 1 : 2
              steps.forEach((s, k) => s.classList.toggle('is-on', k === i))
            },
          },
        })
        tl.to({}, { duration: 0.3 })
          .to(a, gone, '>')
          .to(b, front, '<')
          .to(c, second, '<')
          .to({}, { duration: 0.3 })
          .to(b, gone, '>')
          .to(c, front, '<')
          .to({}, { duration: 0.3 })
        steps[0].classList.add('is-on')
      }

      for (const sel of ['.hc-app', '.hc-dash']) {
        gsap.from(q(`${sel} .hc-sec__head`).children, {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: enter(q(sel), 'top 60%'),
        })
      }

      return () => el.classList.remove('is-anim')
    },
    { scope: root },
  )

  return (
    <div className="hc" ref={root}>
      {/* Hero visual */}
      <section className="hc-hero" aria-label="Écran de connexion de la plateforme Holo MD">
        <div className="hc-hero__frame">
          <img className="hc-hero__img" src={m('login.webp')} alt="Écran de connexion Holo MD : « Imagine a New Era of AI-Powered Psychiatric Care »" />
        </div>
      </section>

      {/* Context */}
      <section className="hc-intro" aria-label="Contexte du projet">
        <div>
          <span className="hc-tag">À propos</span>
          <p className="hc-lead">
            Projet d'innovation pour des leaders de la psychiatrie. HoloMD combine un assistant IA conversationnel (Dr. Holo™) pour le suivi
            thérapeutique à distance (RTM) et un tableau de bord analytique permettant aux psychiatres d'ajuster les traitements et
            d'automatiser la facturation médicale.
          </p>
        </div>
        <figure className="hc-photo">
          <img className="hc-swoosh" src={m('swoosh.svg')} alt="" />
          <div className="hc-photo__frame">
            <img src={m('woman.webp')} alt="Une femme assise dans un fauteuil, son téléphone à la main" loading="lazy" />
          </div>
        </figure>
      </section>

      {/* Goals */}
      <section className="hc-goals" aria-labelledby="hc-goals-title">
        <div className="hc-goals__head">
          <h3 className="hc-goals__title" id="hc-goals-title">
            Objectifs
          </h3>
          <p className="hc-goals__lead">
            Bâtir une expérience médicale hautement sécurisée (HIPAA) qui connecte en continu le patient à son équipe de soins.
          </p>
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
        <header className="hc-sec__head">
          <span className="hc-tag">01</span>
          <h3 id="hc-brand-title">
            Branding global, Brandbook <br />& vitrine d'investissement
          </h3>
          <p>
            Création de l'identité visuelle HoloMD. Déclinaison sur le Brandbook institutionnel et design du micro-site responsive conçu pour
            présenter la technologie aux investisseurs et partenaires cliniques.
          </p>
        </header>
        <div className="hc-brand__stage">
          <img className="hc-brand__site" src={m('microsite.webp')} alt="Micro-site Holo MD : « Rehumanizing Psychiatry in a New Era of AI-Powered Care »" loading="lazy" />
          <div className="hc-brand__col">
            <img className="hc-brand__card" src={m('drcard.webp')} alt="Carte « Dr. Holo is designed to be an empathetic, caring, trustworthy… »" loading="lazy" />
            <img className="hc-brand__diamond" src={m('diamond.webp')} alt="" loading="lazy" />
          </div>
          <div className="hc-brand__col hc-brand__col--b">
            <img className="hc-brand__card" src={m('bruce.webp')} alt="Carte de Bruce A. Kehr, fondateur et chef de la direction" loading="lazy" />
            <div className="hc-brand__tile" aria-hidden="true">
              <img className="hc-brand__gem" src={m('gem.svg')} alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* 02 · Patient app (pinned) */}
      <section className="hc-app" aria-labelledby="hc-app-title">
        <div className="hc-pin">
          <header className="hc-sec__head">
              <span className="hc-tag">02</span>
              <h3 id="hc-app-title">
                Application patient <br />& suivi thérapeutique à distance (RTM)
              </h3>
              <p>
                Conception UX/UI de l'application mobile intégrant l'assistant IA Dr. Holo™. L'interface assure un onboarding sécurisé (HIPAA), la
                gestion des consentements et des échanges quotidiens empathiques pour évaluer l'évolution des symptômes.
              </p>
            </header>
            <ol className="hc-steps" aria-label="Écrans de l'application">
              {appSteps.map((s, i) => (
                <li key={s}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {s}
                </li>
              ))}
            </ol>
          <div className="hc-app__stage">
            <img className="hc-ph" src={m('phone-welcome.webp')} alt="Application Holo MD : écran d'accueil « Welcome », saisie du code fourni par le clinicien" loading="lazy" />
            <img className="hc-ph" src={m('phone-chat.webp')} alt="Application Holo MD : conversation avec l'assistant Dr. Holo" loading="lazy" />
            <img className="hc-ph" src={m('phone-history.webp')} alt="Application Holo MD : historique des échanges par période" loading="lazy" />
          </div>
        </div>
      </section>

      {/* 03 · Clinical dashboard (pinned) */}
      <section className="hc-dash" aria-labelledby="hc-dash-title">
        <div className="hc-pin">
          <header className="hc-sec__head">
              <span className="hc-tag">03</span>
              <h3 id="hc-dash-title">
                Dashboard psychiatre <br />& aide à la décision clinique
              </h3>
              <p>
                Design de la plateforme web pour les médecins : visualisation en temps réel des données patients, alertes cliniques pour ajuster
                les traitements et automatisation de la facturation via les codes de remboursement RTM (Medicare / Assurances).
              </p>
            </header>
            <ol className="hc-steps" aria-label="Écrans du dashboard">
              {dashSteps.map((s, i) => (
                <li key={s}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {s}
                </li>
              ))}
            </ol>
          <div className="hc-dash__deck">
            <img className="hc-deck" src={m('dash.webp')} alt="Dashboard : vue d'ensemble des patients, statistiques mensuelles et liste" loading="lazy" />
            <img className="hc-deck" src={m('patient.webp')} alt="Fiche patient : informations, notes et historique d'humeur" loading="lazy" />
            <img className="hc-deck" src={m('doctor.webp')} alt="Profil du Dr Bruce et liste des patients avec leur humeur" loading="lazy" />
          </div>
        </div>
      </section>
    </div>
  )
}

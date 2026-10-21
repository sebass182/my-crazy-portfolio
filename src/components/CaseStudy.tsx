import { useRef, type CSSProperties } from 'react'
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion, useGSAP } from '../lib/gsap'
import type { CaseData, CaseLayer } from '../data/cases'
import type { Project } from '../data/projects'

/* A data-driven case study, built the way the Holo MD page is (same grid, type scale and motion voice, same holo.css):
     hero picture → context → three stacking goal cards → the three objective slides rebuilt layer by layer.
   Everything comes from src/data/cases.ts, itself generated from the Figma deck: each module of each slide is its own
   image, placed where the deck puts it. */

const base = import.meta.env.BASE_URL

function Pic({ data, f, iw, ih, alt = '', lazy = false, className, style }: { data: CaseData; f: string; iw: number; ih: number; alt?: string; lazy?: boolean; className?: string; style?: CSSProperties }) {
  // the real size is always given, so the browser reserves the space before the file arrives
  return <img className={className} style={style} src={`${base}${data.base}${f}`} width={iw} height={ih} alt={alt} loading={lazy ? 'lazy' : undefined} decoding="async" draggable={false} />
}

const place = (l: CaseLayer): CSSProperties => ({ left: `${l.x}%`, top: `${l.y}%`, width: `${l.w}%` })

// each goal card takes its colour from the project: its own dark ground, lit from a different corner each time
const GLOWS = ['100% 0%', '0% 100%', '40% 0%']
const cardBg = (project: Project, i: number) =>
  `radial-gradient(90% 120% at ${GLOWS[i % 3]}, color-mix(in srgb, ${project.accent} 42%, transparent) 0%, transparent 62%), linear-gradient(140deg, color-mix(in srgb, ${project.bg} 80%, white) 0%, ${project.bg} 100%)`

export default function CaseStudy({ project, data }: { project: Project; data: CaseData }) {
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

      /* Hero: the screen opens like a curtain */
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

        gsap.fromTo(li, { rotate: i % 2 ? -2.2 : 2.2 }, { rotate: 0, ease: 'none', scrollTrigger: { trigger: li, scroller, start: 'top bottom', end: `top ${stuckAt + 160}px`, scrub: true } })
        gsap.fromTo(art, { y: 110 }, { y: 0, ease: 'none', scrollTrigger: { trigger: li, scroller, start: 'top bottom', end: `top ${stuckAt}px`, scrub: true } })
        gsap.fromTo(ghost, { y: 70 }, { y: -40, ease: 'none', scrollTrigger: { trigger: li, scroller, start: 'top bottom', end: 'bottom top', scrub: true } })
        rise(li.querySelectorAll('.hc-goal__n, strong, p'), li, 'top 80%', {}, true)

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
           img     → hover lift (CSS)
         The full-panel backgrounds (.hl--bg) stay put: they are the ground the modules float over. */
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      const phone = window.matchMedia('(max-width: 800px)').matches
      const cleanups: Array<() => void> = []

      all<HTMLElement>('.hc-slide').forEach((slide) => {
        const stage = slide.querySelector<HTMLElement>('.hc-slide__stage')!
        const layers = all<HTMLElement>('.hl:not(.hl--bg)', stage)

        rise(slide.querySelector('.hc-slide__copy')!.children, slide, 'top 78%')

        gsap.from(layers, {
          opacity: 0,
          scale: 0.92,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: view(slide, 'top 72%'),
        })

        const amp = phone ? 22 : 38
        layers.forEach((l) => {
          const d = Number(l.dataset.depth)
          gsap.fromTo(
            l.querySelector('.hl__s'),
            { y: d * amp },
            { y: -d * amp, ease: 'none', scrollTrigger: { trigger: slide, scroller, start: 'top bottom', end: 'bottom top', scrub: true } },
          )
        })

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

      // Only the hero and the context photo take part in the page's flow (every other picture is absolutely placed in a box of
      // known size): once those are decoded the page is at its final size, so measure every trigger once more.
      let alive = true
      Promise.all([...el.querySelectorAll('.hc-hero img, .hc-photo img')].map((img) => (img as HTMLImageElement).decode().catch(() => {}))).then(
        () => alive && ScrollTrigger.refresh(),
      )
      return () => {
        alive = false
        cleanups.forEach((fn) => fn())
      }
    },
    { scope: root },
  )

  return (
    <div className="hc hc--x" ref={root}>
      {/* Hero visual */}
      <section className="hc-hero" aria-label={`Maquette principale — ${project.name}`}>
        <div className="hc-hero__frame" style={{ aspectRatio: `${data.hero.iw} / ${data.hero.ih}` }}>
          <Pic data={data} {...data.hero} className="hc-hero__img" />
        </div>
      </section>

      {/* Context */}
      <section className="hc-intro" aria-label="Contexte du projet">
        <div>
          <span className="hc-eyebrow">À propos</span>
          <p className="hc-lead">{data.intro.lead}</p>
        </div>
        <figure className="hc-photo">
          <Pic data={data} {...data.intro.photo} />
        </figure>
      </section>

      {/* Goals */}
      <section className="hc-goals" aria-labelledby="hc-goals-title">
        <div className="hc-goals__head">
          <div>
            <span className="hc-eyebrow">Objectifs</span>
            <h3 id="hc-goals-title">{data.goalsTitle}</h3>
          </div>
        </div>
        <ol className="hc-stack">
          {data.goals.map((g, i) => {
            const mods = data.slides[i].layers.filter((l) => l.kind === 'mod')
            const panels = data.slides[i].layers.filter((l) => l.kind === 'bg')
            return (
              <li className="hc-goal" key={g.n} style={{ ['--i' as string]: i, ['--card-bg' as string]: cardBg(project, i) }}>
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
                  {/* a window onto the slide's own composition, peeking in from the corner */}
                  <div className="hc-goal__art" aria-hidden="true">
                    {mods.length ? (
                      <div className="ga-peek">
                        {mods.map((l) => (
                          <Pic key={l.f} data={data} f={l.f} iw={l.iw} ih={l.ih} lazy style={place(l)} />
                        ))}
                      </div>
                    ) : (
                      <div className="ga-peek ga-peek--panel">
                        {panels.map((l) => (
                          <Pic key={l.f} data={data} f={l.f} iw={l.iw} ih={l.ih} lazy />
                        ))}
                      </div>
                    )}
                  </div>
                  <i className="hc-goal__shade" />
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      {/* 01 · 02 · 03 — the slides, rebuilt */}
      {data.slides.map((s, si) => (
        <section className={`hc-slide${s.bleed ? ' hc-slide--bleed' : ''}`} key={s.n} aria-labelledby={`hc-s${si}-title`}>
          <div className="hc-slide__copy">
            <span className="hc-slide__n">{s.n}</span>
            <div>
              <h3 id={`hc-s${si}-title`}>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          </div>
          <div className="hc-slide__stage" style={{ ['--stage' as string]: s.stage }}>
            {s.layers.map((l) => (
              <div
                className={`hl hl--${l.kind}`}
                key={l.f}
                data-depth={l.d}
                style={l.kind === 'bg' ? { zIndex: 0 } : { ...place(l), zIndex: l.z }}
                aria-hidden={l.alt ? undefined : true}
              >
                <div className="hl__s">
                  <Pic data={data} f={l.f} iw={l.iw} ih={l.ih} alt={l.alt} lazy />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

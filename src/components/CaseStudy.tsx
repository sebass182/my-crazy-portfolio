import { useRef, type CSSProperties } from 'react'
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion, useGSAP } from '../lib/gsap'
import type { CaseData, CaseLayer } from '../data/cases'
import type { Project } from '../data/projects'

/* A case study built like the Figma deck it comes from: five slides, one after the other —
     the laptop · the context (photo + the three goals floating over it) · the three objective slides.
   Each slide is rebuilt layer by layer from src/data/cases.ts (itself generated from the deck): every module is its own
   image, placed where the deck puts it, with scroll parallax, cursor parallax and a hover lift.
   Same grid, type scale and holo.css as the Holo MD page. */

const base = import.meta.env.BASE_URL

function Pic({ data, f, iw, ih, alt = '', lazy = false, className, style }: { data?: CaseData; f: string; iw: number; ih: number; alt?: string; lazy?: boolean; className?: string; style?: CSSProperties }) {
  // the real size is always given, so the browser reserves the space before the file arrives
  const src = data ? `${base}${data.base}${f}` : `${base}${f}`
  return <img className={className} style={style} src={src} width={iw} height={ih} alt={alt} loading={lazy ? 'lazy' : undefined} decoding="async" draggable={false} />
}

const place = (l: Pick<CaseLayer, 'x' | 'y' | 'w'>): CSSProperties => ({ left: `${l.x}%`, top: `${l.y}%`, width: `${l.w}%` })
// where a module runs off the slide its edge stays square (the deck crops it there); everywhere else it is rounded
const cuts = (l: CaseLayer) => (l.cut ? ' ' + [...l.cut].map((c) => `cut-${c}`).join(' ') : '')

// the laptop of every hero slide: same image, same spot (x, y, w in % of the slide)
const LAPTOP = { f: 'cases/_shared/laptop.webp', iw: 2400, ih: 1500, x: 11.7, y: 7.4, w: 76.7 }

export default function CaseStudy({ project, data }: { project: Project; data: CaseData }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return // static: the slides simply sit there

      const el = root.current!
      const scroller = el.closest<HTMLElement>('.pv__scroll')
      if (!scroller) return

      const all = <T extends Element>(sel: string, from: ParentNode = el) => gsap.utils.toArray<T>(sel, from)
      // Plays when the trigger scrolls into view from EITHER direction and rewinds when it leaves,
      // so the animation can be watched again on the way back up.
      const view = (trigger: Element, start = 'top 85%') => ({
        trigger,
        scroller,
        start,
        end: 'bottom top',
        toggleActions: 'play reverse play reverse',
      })
      const rise = (targets: gsap.TweenTarget, trigger: Element, start?: string) =>
        gsap.from(targets, { y: 28, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, scrollTrigger: view(trigger, start) })

      /* Context: the paragraph reads in line by line */
      SplitText.create('.hc-lead', {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, { yPercent: 110, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: view(el.querySelector('.hc-slide--intro')!, 'top 78%') }),
      })

      /* The slides.
         Three independent channels per layer so the effects never fight each other:
           .hl     → entrance (opacity, scale) + pointer parallax (x, y)
           .hl__s  → scroll parallax (y)
           img     → hover lift (CSS)
         The full-panel grounds (.hl--bg) stay put: they are what the modules float over. */
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      const phone = window.matchMedia('(max-width: 800px)').matches
      const cleanups: Array<() => void> = []

      all<HTMLElement>('.hc-slide').forEach((slide) => {
        const stage = slide.querySelector<HTMLElement>('.hc-slide__stage')!
        const layers = all<HTMLElement>('.hl:not(.hl--bg)', stage)
        const copy = slide.querySelector('.hc-slide__copy')

        if (copy) rise(slide.classList.contains('hc-slide--intro') ? copy.querySelectorAll('.hc-tag') : copy.children, slide, 'top 78%')

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
          // the laptop also leans towards the cursor
          const dev = stage.querySelector<HTMLElement>('.dev')
          const lean = dev && {
            ry: gsap.quickTo(dev, 'rotationY', { duration: 1, ease: 'power3.out' }),
            rx: gsap.quickTo(dev, 'rotationX', { duration: 1, ease: 'power3.out' }),
          }
          if (dev) gsap.set(dev, { transformPerspective: 1300, transformOrigin: '50% 70%' })
          let raf = 0
          const onMove = (e: PointerEvent) => {
            const r = stage.getBoundingClientRect()
            const nx = (e.clientX - r.left) / r.width - 0.5
            const ny = (e.clientY - r.top) / r.height - 0.5
            movers.forEach((m) => {
              m.x(-nx * m.d * 26)
              m.y(-ny * m.d * 26)
            })
            lean?.ry(nx * 9)
            lean?.rx(-ny * 6)
            if (!raf)
              raf = requestAnimationFrame(() => {
                raf = 0
                stage.style.setProperty('--mx', `${(nx + 0.5) * 100}%`)
                stage.style.setProperty('--my', `${(ny + 0.5) * 100}%`)
              })
          }
          const onLeave = () => {
            movers.forEach((m) => (m.x(0), m.y(0)))
            lean?.ry(0)
            lean?.rx(0)
          }
          stage.addEventListener('pointermove', onMove)
          stage.addEventListener('pointerleave', onLeave)
          cleanups.push(() => {
            stage.removeEventListener('pointermove', onMove)
            stage.removeEventListener('pointerleave', onLeave)
            cancelAnimationFrame(raf)
          })
        }
      })

      // Slides keep their proportions whatever loads, but text can re-wrap once the fonts are in (phones): measure again then.
      let alive = true
      document.fonts?.ready.then(() => alive && ScrollTrigger.refresh())
      return () => {
        alive = false
        cleanups.forEach((fn) => fn())
      }
    },
    { scope: root },
  )

  const { hero, intro } = data

  return (
    <div className="hc hc--x" ref={root}>
      {/* 1 · the laptop */}
      <section className="hc-slide hc-slide--hero" aria-label={`Maquette principale — ${project.name}`}>
        <div className="hc-slide__stage" style={{ ['--stage' as string]: '#f7f6f2' }}>
          <div className="hl hl--device" data-depth={0.9} style={place(LAPTOP)}>
            <div className="hl__s">
              <div className="dev">
                <Pic data={data} f={hero.f} iw={hero.iw} ih={hero.ih} alt={hero.alt} className="dev__screen" style={{ left: `${hero.x}%`, top: `${hero.y}%`, width: `${hero.w}%` }} />
                <Pic f={LAPTOP.f} iw={LAPTOP.iw} ih={LAPTOP.ih} className="dev__laptop" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 · the context: the paragraph, the photo and the three goals floating across the edge, as on the deck */}
      <section className="hc-slide hc-slide--intro hc-slide--bleed" aria-label="Contexte du projet">
        <div className="hc-slide__copy hc-slide__copy--intro">
          <span className="hc-tag">À propos</span>
          <p className="hc-lead">{intro.lead}</p>
        </div>
        <div className="hc-slide__stage" style={{ ['--stage' as string]: project.bg, ['--chip' as string]: project.bg }}>
          <div className="hl hl--bg" style={{ zIndex: 0 }}>
            <div className="hl__s">
              <Pic data={data} {...intro.photo} />
            </div>
          </div>
          <ol className="chips" aria-label="Les trois objectifs du projet">
            {intro.chips.map((c, i) => (
              <li className="hl hl--chip" key={c.n} data-depth={1 + i * 0.35} style={{ top: `${c.y}%`, width: `${c.w}%`, zIndex: 3 + i, ['--x' as string]: c.x, ['--h' as string]: c.h }}>
                <div className="hl__s">
                  <div className="chip">
                    <span className="chip__n" aria-hidden="true">
                      {c.n}
                    </span>
                    <span className="chip__t">{c.text}</span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3 · 4 · 5 — the three objective slides, rebuilt */}
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
                className={`hl hl--${l.kind}${cuts(l)}`}
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

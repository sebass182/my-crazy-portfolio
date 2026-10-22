import { useRef } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { others, othersTitle } from '../data/others'

const base = import.meta.env.BASE_URL
const NEAR = 0.5 // the nearest picture waits this many screen heights behind the screen (the stage's perspective is one screen height)
const DEEP = 1.5 // each unit of depth adds this much
const IN_X = 0.72 // the pictures start pulled this far towards the centre sideways...
const IN_Y = 0.55 // ...and more so vertically (what flies upward would be cut by the top of the stage)
const SIZE = 0.8
// on a tall, narrow screen (a phone, a tablet held upright) the same scene is laid out again: less pull towards the centre sideways (the
// width is scarce), more vertically (the height is not), and smaller pictures (their height is in screen heights, their width then follows)
const NARROW = { inX: 0.5, inY: 0.78, size: 0.4 }
const behind = (d: number) => NEAR + DEEP * d // how many screen heights behind the screen
// x / y in the data are where a picture is first SEEN; perspective pulls a deep one towards the centre (by 1 / (1 + behind)), so its real
// place is pushed out by the same factor
const place = (v: number, d: number, k: number) => 50 + (v - 50) * k * (1 + behind(d))

/* "Zoom through" scroll: the stage has a real perspective and the screenshots are scattered over it, in sight from the first moment the
   section peeks in, at different depths: the nearer, the bigger. As the section comes up the camera starts moving forward and keeps
   going once the stage is pinned: every picture comes to it and passes it, the deep ones having the furthest to go, so they zoom the
   most. The title's words light up meanwhile. At the end the footer rises over the stage, full screen, while the stage drifts up more
   slowly behind it (parallax). The same on a phone or a tablet (the pictures are laid out again for a tall screen); reduced motion gets a
   plain grid. */
export default function Others() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const section = root.current!
        const stage = section.querySelector<HTMLElement>('.others__stage')!
        const scene = section.querySelector<HTMLElement>('.others__scene')!
        const shots = gsap.utils.toArray<HTMLElement>('.others__img', section)
        const words = gsap.utils.toArray<HTMLElement>('.others__title .w', section)
        const P = () => stage.clientHeight // the perspective: one screen height
        const FADE = 0.7 // the title starts to fade at this share of the zoom, and that is when the footer starts to rise over the stage
        const RISE = () => P() // the footer takes one screen height to come up
        // the pin lasts until the footer has covered the stage; the zoom runs from the section's entrance (one screen height before the pin)
        // to the end of the pin, so the fade falls exactly where the footer starts: FADE * (P + PIN) - P = PIN - RISE
        const PIN = () => (FADE / (1 - FADE)) * P()
        gsap.set(words, { opacity: 0.16 })
        gsap.set(shots, { z: (i) => -behind(others[i].d) * P() })

        // The camera moves from the moment the section starts to enter (not only once it is pinned): the zoom runs over the screen
        // height of the entrance plus the pinned stretch.
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: section, start: 'top bottom', end: () => `+=${P() + PIN()}`, scrub: 0.7, invalidateOnRefresh: true },
        })

        // every picture has its own delay (how long it holds still), pace (the shorter its journey, the faster it goes) and reach (how
        // close to the camera it gets, so how big it ends up); the deep ones also have the furthest to go. Each leaves the screen on its
        // own side once it has grown enough, the ones near the edges first.
        shots.forEach((el, i) => {
          const o = others[i]
          tl.to(el, { z: () => o.reach * P(), duration: o.len }, o.delay)
        })
        // the title lights up word by word, then steps aside before the last pictures go
        tl.to(words, { opacity: 1, duration: 0.04, stagger: 0.035 }, 0.04)
        tl.to('.others__title', { opacity: 0, y: -40, duration: 0.12 }, FADE)
        
        // the stage stays pinned until the footer (pulled up over it, see the CSS) has come up the screen over it; the footer starts as the
        // title starts to fade, and the stage drifts up more slowly behind it meanwhile
        ScrollTrigger.create({ trigger: section, start: 'top top', end: () => `+=${PIN()}`, pin: stage, invalidateOnRefresh: true })
        gsap.to(scene, {
          yPercent: -22,
          ease: 'none',
          scrollTrigger: { trigger: section, start: () => `top top-=${PIN() - RISE()}`, end: () => `+=${RISE()}`, scrub: true, invalidateOnRefresh: true },
        })
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  // DOM order is paint order (the scene is flat so it can clip): the title, then the pictures back to front
  return (
    <section className="others" id="others" ref={root} aria-labelledby="others-title">
      <div className="others__stage">
        <div className="others__scene">
          <h2 className="others__title" id="others-title">
            {othersTitle.split(' ').map((w, i) => (
              <span className="w" key={i}>
                {w}{' '}
              </span>
            ))}
          </h2>
          <ul className="sr-only">
            {others.map((o) => (
              <li key={o.f}>{o.name}</li>
            ))}
          </ul>
          {others.map((o) => (
            <figure
              className="others__img"
              key={o.f}
              aria-hidden="true"
              style={{
                ['--x' as string]: place(o.x, o.d, IN_X),
                ['--y' as string]: place(o.y, o.d, IN_Y),
                ['--h' as string]: o.sh * SIZE * (1 + behind(o.d)),
                ['--nx' as string]: place(o.x, o.d, NARROW.inX),
                ['--ny' as string]: place(o.y, o.d, NARROW.inY),
                ['--nh' as string]: o.sh * NARROW.size * (1 + behind(o.d)),
                ['--ar' as string]: `${o.w} / ${o.h}`,
              }}
            >
              <img src={`${base}others/${encodeURIComponent(o.f)}`} width={o.w} height={o.h} alt="" loading="lazy" decoding="async" draggable={false} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

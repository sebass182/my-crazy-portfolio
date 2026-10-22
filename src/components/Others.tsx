import { useRef } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { others, othersTitle } from '../data/others'

const base = import.meta.env.BASE_URL
const NEAR = 0.5 // the nearest picture waits this many screen heights behind the screen (the stage's perspective is one screen height)
const DEEP = 1.5 // each unit of depth adds this much
const IN_X = 0.72 // the pictures start pulled this far towards the centre sideways...
const IN_Y = 0.55 // ...and more so vertically (what flies upward would be cut by the top of the stage)
const SIZE = 0.8
const behind = (d: number) => NEAR + DEEP * d // how many screen heights behind the screen
// x / y in the data are where a picture is first SEEN; perspective pulls a deep one towards the centre (by 1 / (1 + behind)), so its real
// place is pushed out by the same factor
const place = (v: number, d: number, k: number) => 50 + (v - 50) * k * (1 + behind(d))

/* "Zoom through" scroll: the stage has a real perspective and the screenshots are scattered over it, in sight from the first moment the
   section peeks in, at different depths: the nearer, the bigger. As the section comes up the camera starts moving forward and keeps
   going once the stage is pinned: every picture comes to it and passes it, the deep ones having the furthest to go, so they zoom the
   most. The title's words light up meanwhile. At the end the footer rises over the stage, full screen, while the stage drifts up more
   slowly behind it (parallax). Phones and reduced motion get a plain grid. */
export default function Others() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const mm = gsap.matchMedia()

      mm.add('(min-width: 801px)', () => {
        const section = root.current!
        const stage = section.querySelector<HTMLElement>('.others__stage')!
        const scene = section.querySelector<HTMLElement>('.others__scene')!
        const shots = gsap.utils.toArray<HTMLElement>('.others__img', section)
        const words = gsap.utils.toArray<HTMLElement>('.others__title .w', section)
        const P = () => stage.clientHeight // the perspective: one screen height
        const PIN = () => 3.3 * P() // how long the stage stays pinned while the pictures fly
        const RISE = () => P() // the last screen height of the pin: the footer rises over it

        gsap.set(words, { opacity: 0.16 })
        gsap.set(shots, { z: (i) => -behind(others[i].d) * P() })

        // The camera moves from the moment the section starts to enter (not only once it is pinned): the zoom runs over the screen
        // height of the entrance plus the pinned stretch.
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: section, start: 'top bottom', end: () => `+=${P() + PIN()}`, scrub: 0.7, invalidateOnRefresh: true },
        })

        // every picture makes the same journey at the same pace, from its depth to just in front of the camera: the one with the
        // furthest to go (the deepest) moves fastest, so it zooms the most, and each one leaves the screen on its own side when it has grown
        // enough, the ones near the edges first, left and right alike (the perspective is centred and symmetrical)
        shots.forEach((el) => tl.to(el, { z: () => 0.97 * P(), duration: 1 }, 0))
        // the title lights up word by word, then steps aside before the last pictures go
        tl.to(words, { opacity: 1, duration: 0.04, stagger: 0.035 }, 0.04)
        tl.to('.others__title', { opacity: 0, y: -40, duration: 0.12 }, 0.6)
        
        // the stage stays pinned for the whole zoom and one screen more, during which the footer (pulled up over it, see the CSS)
        // comes up the screen while the stage drifts up more slowly behind it
        ScrollTrigger.create({ trigger: section, start: 'top top', end: () => `+=${PIN() + RISE()}`, pin: stage, invalidateOnRefresh: true })
        gsap.to(scene, {
          yPercent: -22,
          ease: 'none',
          scrollTrigger: { trigger: section, start: () => `top top-=${PIN()}`, end: () => `+=${RISE()}`, scrub: true, invalidateOnRefresh: true },
        })
      })

      // phones: the grid rises in picture by picture
      mm.add('(max-width: 800px)', () => {
        gsap.from('.others__img', {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.06,
          scrollTrigger: { trigger: '.others__stage', start: 'top 70%', end: 'bottom top', toggleActions: 'play reverse play reverse' },
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

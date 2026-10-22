import { useRef } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { others, othersTitle } from '../data/others'

const base = import.meta.env.BASE_URL
const DEEP = 2 // the deepest picture waits this many screen heights behind the screen
const BLUR = 14 // px of blur on the deepest picture
// x / y in the data are where a picture is first SEEN; perspective pulls a deep one towards the centre (by 1 / (1 + DEEP * d)), so its real
// place is pushed out by the same factor
const spread = (v: number, d: number) => 50 + (v - 50) * (1 + DEEP * d)

/* "Zoom through" scroll: the stage has a real perspective (its depth is one screen height) and the screenshots are scattered all
   over it, in sight from the start, at different depths: the nearer, the bigger and sharper; the deeper, the smaller and blurrier.
   The section pins and the scroll carries the camera forward: every picture comes to it and passes it, the deep ones having the
   furthest to go, so they zoom the most, and each one sharpens as it nears. The title's words light up
   meanwhile. Once the last one has gone by, the camera comes out into the footer's own pastel world: a circle of it opens from the
   centre and fills the screen, and the footer follows without a seam. Phones and reduced motion get a plain grid. */
export default function Others() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const mm = gsap.matchMedia()

      mm.add('(min-width: 801px)', () => {
        const section = root.current!
        const stage = section.querySelector<HTMLElement>('.others__stage')!
        const shots = gsap.utils.toArray<HTMLElement>('.others__img', section)
        const words = gsap.utils.toArray<HTMLElement>('.others__title .w', section)
        const portal = section.querySelector<HTMLElement>('.others__portal')!
        const P = () => stage.clientHeight // the perspective: one screen height

        gsap.set(words, { opacity: 0.16 })
        gsap.set(shots, { z: (i) => -others[i].d * DEEP * P() })
        gsap.set(portal, { clipPath: 'circle(0% at 50% 50%)' })
        // the depth blur is written by hand, on the picture inside (a filter on the 3D-transformed figure itself can keep it from painting
        // in some browsers), and a sharp picture carries only its shadow
        const SHADOW = 'drop-shadow(0 16px 24px rgba(10, 10, 15, 0.2))'
        const blur = (el: HTMLElement, v: number) => ((el.firstElementChild as HTMLElement).style.filter = v < 0.3 ? SHADOW : `blur(${v}px) ${SHADOW}`)
        shots.forEach((el, i) => blur(el, others[i].d * BLUR))

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=560%',
            pin: stage,
            scrub: 0.7,
            invalidateOnRefresh: true,
            // a scrubbed timeline renders without firing its tweens' callbacks, so the blur follows the journey from here:
            // a picture is as blurred as it is deep and sharpens to nothing as it reaches the screen
            onUpdate: () =>
              shots.forEach((el, i) => {
                const z0 = -others[i].d * DEEP * P()
                const done = (Number(gsap.getProperty(el, 'z')) - z0) / (-z0 || 1)
                blur(el, others[i].d * BLUR * Math.max(0, 1 - done * 2.2))
              }),
          },
        })

        // each picture comes to the camera and passes it. A picture is out of sight once it has grown to about 2.2x (it is then at
        // z = 0.55 of the way to the camera), so its journey is timed backwards from the moment it should leave: the leaving
        // moments are spread over the whole scroll, in a shuffled order, so there are always pictures in view. The deep ones have
        // the furthest to go: they zoom the most.
        const rank = [5, 0, 8, 3, 11, 6, 1, 9, 4, 12, 2, 10, 7] // leaving order, per picture (the list is back to front)
        shots.forEach((el, i) => {
          const d = others[i].d
          const leave = 0.35 + (rank[i % rank.length] / (rank.length - 1)) * 0.75
          const share = (0.55 + DEEP * d) / (0.97 + DEEP * d) // how much of the journey is done when it leaves
          const start = Math.max(0, leave - share * 0.9)
          tl.to(el, { z: () => 0.97 * P(), duration: (leave - start) / share }, start)
        })

        // the title lights up word by word, then steps aside before the last pictures arrive
        tl.to(words, { opacity: 1, duration: 0.04, stagger: 0.035 }, 0.05)
        tl.to('.others__title', { opacity: 0, y: -40, duration: 0.14 }, 0.82)

        // coming out the other side: the footer's colours open from the centre until they fill the screen
        tl.to(portal, { clipPath: 'circle(80% at 50% 50%)', duration: 0.42, ease: 'power2.in' }, 1.0)
        tl.to({}, { duration: 0.06 }, 1.42) // a short hold before the footer scrolls in
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

  // DOM order is paint order (the stage is flat so it can clip): the portal behind, then the title, then the pictures back to front
  return (
    <section className="others" id="others" ref={root} aria-labelledby="others-title">
      <div className="others__stage">
        <div className="others__portal" aria-hidden="true" />
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
            style={{ ['--x' as string]: spread(o.x, o.d), ['--y' as string]: spread(o.y, o.d), ['--h' as string]: o.sh * (1 + DEEP * o.d), ['--ar' as string]: `${o.w} / ${o.h}` }}
          >
            <img src={`${base}others/${encodeURIComponent(o.f)}`} width={o.w} height={o.h} alt="" loading="lazy" decoding="async" draggable={false} />
          </figure>
        ))}
      </div>
    </section>
  )
}

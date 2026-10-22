import { useRef } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { others, othersTitle } from '../data/others'

const base = import.meta.env.BASE_URL

/* "Zoom through" scroll: the stage has a real perspective (its depth is one screen height) and every screenshot sits far behind
   the screen, small, blurred and invisible. The section pins and the scroll pulls the pictures towards the camera one after
   another: each one sharpens as it comes, grows as it nears and finally passes the camera and is gone. The title's words light up
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
        const FAR = -3 // how far behind the screen they wait, in perspective units

        gsap.set(words, { opacity: 0.16 })
        gsap.set(shots, { z: () => FAR * P(), opacity: 0 })
        gsap.set(portal, { clipPath: 'circle(0% at 50% 50%)' })
        // the blur is written by hand: a picture in focus carries no filter at all (a `blur(0px)` left on a 3D-transformed
        // element can keep it from painting in some browsers)
        const blur = (el: HTMLElement, v: number) => (el.style.filter = v < 0.3 ? 'none' : `blur(${v}px)`)
        shots.forEach((el) => blur(el, 20))

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=400%',
            pin: stage,
            scrub: 0.7,
            invalidateOnRefresh: true,
            // a scrubbed timeline renders without firing its tweens' callbacks, so the blur follows the opacity from here
            onUpdate: () => shots.forEach((el) => blur(el, 20 * (1 - Number(gsap.getProperty(el, 'opacity'))))),
          },
        })

        // each picture: comes into focus early in its journey, then keeps coming until it has passed the camera
        shots.forEach((el, i) => {
          const start = i * 0.05
          tl.to(el, { opacity: 1, duration: 0.14 }, start)
          tl.to(el, { z: () => 0.97 * P(), duration: 0.46 }, start)
        })

        // the title lights up word by word, then steps aside before the last pictures arrive
        tl.to(words, { opacity: 1, duration: 0.04, stagger: 0.035 }, 0.05)
        tl.to('.others__title', { opacity: 0, y: -40, duration: 0.12 }, 0.6)

        // coming out the other side: the footer's colours open from the centre until they fill the screen
        tl.to(portal, { clipPath: 'circle(80% at 50% 50%)', duration: 0.38, ease: 'power2.in' }, 0.72)
        tl.to({}, { duration: 0.06 }, 1.1) // a short hold before the footer scrolls in
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
            style={{ ['--x' as string]: o.x, ['--y' as string]: o.y, ['--h' as string]: o.sh, ['--ar' as string]: `${o.w} / ${o.h}` }}
          >
            <img src={`${base}others/${encodeURIComponent(o.f)}`} width={o.w} height={o.h} alt="" loading="lazy" decoding="async" draggable={false} />
          </figure>
        ))}
      </div>
    </section>
  )
}

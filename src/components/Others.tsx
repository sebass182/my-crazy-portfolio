import { useRef } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { others, othersHero, othersTitle } from '../data/others'

const base = import.meta.env.BASE_URL

/* "Zoom through" scroll: the stage has a real perspective (its depth is one screen height) and every picture sits far behind
   the screen, small, blurred and invisible. The section pins and the scroll pulls the pictures towards the camera one after
   another: each one sharpens as it comes, grows as it nears and finally passes the camera and is gone. The title's words light up
   meanwhile, and the last picture keeps coming until it fills the screen. Phones and reduced motion get a plain grid. */
export default function Others() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const mm = gsap.matchMedia()

      mm.add('(min-width: 801px)', () => {
        const section = root.current!
        const stage = section.querySelector<HTMLElement>('.others__stage')!
        const shots = gsap.utils.toArray<HTMLElement>('.others__img:not(.others__hero)', section)
        const words = gsap.utils.toArray<HTMLElement>('.others__title .w', section)
        const hero = section.querySelector<HTMLElement>('.others__hero')!
        const P = () => stage.clientHeight // the perspective: one screen height
        const FAR = -3 // how far behind the screen they wait, in perspective units

        gsap.set(words, { opacity: 0.16 })
        gsap.set([...shots, hero], { z: () => FAR * P(), opacity: 0 })
        // the blur is written by hand: a picture in focus carries no filter at all (a `blur(0px)` left on a 3D-transformed
        // element can keep it from painting in some browsers)
        const blur = (el: HTMLElement, v: number) => (el.style.filter = v < 0.3 ? 'none' : `blur(${v}px)`)
        ;[...shots, hero].forEach((el) => blur(el, 20))

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=360%',
            pin: stage,
            scrub: 0.7,
            invalidateOnRefresh: true,
            // a scrubbed timeline renders without firing its tweens' callbacks, so the blur follows the opacity from here
            onUpdate: () => [...shots, hero].forEach((el) => blur(el, 20 * (1 - Number(gsap.getProperty(el, 'opacity'))))),
          },
        })

        // each picture: comes into focus early in its journey, then keeps coming until it has passed the camera
        const fly = (el: HTMLElement, start: number, toZ: () => number, len: number) => {
          tl.to(el, { opacity: 1, duration: len * 0.3 }, start)
          tl.to(el, { z: toZ, duration: len }, start)
        }
        shots.forEach((el, i) => fly(el, i * 0.065, () => 0.97 * P(), 0.5))

        // the last one stops when it exactly fills the screen (scale on screen = perspective / (perspective - z))
        const heroZ = () => {
          const w = (stage.clientWidth * othersHero.w) / 100 // its width and height at z = 0 (16:10, see the CSS)
          const h = w / 1.6
          const need = Math.max(stage.clientWidth / w, stage.clientHeight / h) * 1.05
          return P() * (1 - 1 / need)
        }
        fly(hero, 0.42, heroZ, 0.5)

        // the title lights up word by word, then the picture growing out of the centre covers it
        tl.to(words, { opacity: 1, duration: 0.04, stagger: 0.035 }, 0.05)
        tl.to({}, { duration: 0.08 }, 0.92) // a short hold on the full picture
      })

      // phones: the grid rises in picture by picture
      mm.add('(max-width: 800px)', () => {
        gsap.from('.others__img', {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: '.others__stage', start: 'top 70%', end: 'bottom top', toggleActions: 'play reverse play reverse' },
        })
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  // DOM order is paint order (the stage is flat so it can clip): title, then the pictures back to front, then the last one on top
  return (
    <section className="others" id="others" data-nav="dark" ref={root} aria-labelledby="others-title">
      <div className="others__stage">
        <h2 className="others__title" id="others-title">
          {othersTitle.split(' ').map((w, i) => (
            <span className="w" key={i}>
              {w}{' '}
            </span>
          ))}
        </h2>
        {others.map((o, i) => (
          <figure className="others__img" key={i} aria-hidden="true" style={{ ['--x' as string]: o.x, ['--y' as string]: o.y, ['--w' as string]: o.w }}>
            <img src={`${base}${o.f}`} alt="" loading="lazy" decoding="async" draggable={false} />
          </figure>
        ))}
        <figure className="others__hero others__img" aria-hidden="true" style={{ ['--x' as string]: 50, ['--y' as string]: 50, ['--w' as string]: othersHero.w }}>
          <img src={`${base}${othersHero.f}`} alt="" decoding="async" draggable={false} />
        </figure>
      </div>
    </section>
  )
}

import { useRef } from 'react'
import { gsap, SplitText, prefersReducedMotion, useGSAP } from '../lib/gsap'

export default function Contact() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    (_, contextSafe) => {
      if (prefersReducedMotion()) return // headline shows as-is, buttons stay put

      SplitText.create('.contact__title', {
        type: 'words',
        mask: 'words',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.words, {
            yPercent: 110,
            duration: 1,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: { trigger: '.contact__title', start: 'top 85%' },
          }),
      })

      const cleanups = gsap.utils.toArray<HTMLElement>('.magnetic').map((el) => {
        const strength = Number(el.dataset.strength ?? 0.35)
        const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
        const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })

        const move = contextSafe!((e: PointerEvent) => {
          const r = el.getBoundingClientRect()
          xTo((e.clientX - (r.left + r.width / 2)) * strength)
          yTo((e.clientY - (r.top + r.height / 2)) * strength)
        })
        const leave = contextSafe!(() => {
          xTo(0)
          yTo(0)
        })

        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        return () => {
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerleave', leave)
        }
      })

      return () => cleanups.forEach((fn) => fn())
    },
    { scope: root },
  )

  return (
    <footer className="contact" ref={root} id="contact">
      <div className="hero__bg" aria-hidden="true">
        <i className="blob blob--yellow" />
        <i className="blob blob--cyan" />
        <i className="blob blob--pink" />
      </div>

      <span className="label">Contact</span>
      <h2 className="contact__title">Travaillons ensemble.</h2>

      <a className="magnetic magnetic--big" data-strength="0.6" href="mailto:sebasslemyre@gmail.com">
        sebasslemyre@gmail.com
      </a>

      <div className="contact__bottom">
        <div className="contact__links">
          <a className="magnetic pill" href="tel:5144428885">
            514.442.8885
          </a>
          <a className="magnetic pill pill--outline" href="https://sebass182.github.io/sebasslemyre-site/index.html">
            Portfolio
          </a>
        </div>
        <span className="label">Sébastien Lemyre — Designer UI/UX Senior</span>
      </div>
    </footer>
  )
}

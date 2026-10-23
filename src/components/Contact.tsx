import { useRef, useState } from 'react'
import { gsap, SplitText, prefersReducedMotion, useGSAP } from '../lib/gsap'
import HeroShader from './HeroShader'
import { useLang } from '../i18n/context'
import { magnetic } from '../lib/magnetic'
import { track } from '../lib/track'

export default function Contact({ ready }: { ready: boolean }) {
  const { t } = useLang()
  const root = useRef<HTMLElement>(null)
  const [shader, setShader] = useState(false) // true while the WebGL backdrop is drawing; the CSS blobs are the fallback

  useGSAP(
    (_, contextSafe) => {
      if (prefersReducedMotion()) return // headline shows as-is, buttons stay put

      // Fallback backdrop (no WebGL): the gradient blobs drift forever, like the hero's
      gsap.utils.toArray<HTMLElement>('.contact .blob').forEach((b, i) => {
        gsap.to(b, {
          x: () => gsap.utils.random(-18, 18) + 'vw',
          y: () => gsap.utils.random(-14, 14) + 'vh',
          duration: gsap.utils.random(7, 11),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: -i * 2,
        })
      })

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
            scrollTrigger: { trigger: '.contact__title', start: 'top 85%', end: 'bottom top', toggleActions: 'play reverse play reverse' },
          }),
      })

      return magnetic(gsap.utils.toArray<HTMLElement>('.magnetic'), contextSafe!)
    },
    { scope: root },
  )

  return (
    <footer className={shader ? 'contact has-shader' : 'contact'} ref={root} id="contact">
      <div className="hero__bg" aria-hidden="true">
        <i className="blob blob--yellow" />
        <i className="blob blob--cyan" />
        <i className="blob blob--pink" />
        <HeroShader ready={ready} onActive={setShader} variant="footer" />
      </div>

      <span className="label">{t.contact}</span>
      <h2 className="contact__title">{t.contactTitle}</h2>

      <a className="magnetic magnetic--big" data-strength="0.6" href="mailto:sebasslemyre@gmail.com">
        sebasslemyre@gmail.com
      </a>

      <div className="contact__bottom">
        <div className="contact__links">
          <a
            className="magnetic pill"
            href="https://www.linkedin.com/in/sebastien-lemyre/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.linkedinAria}
          >
            LinkedIn
          </a>
          <a className="magnetic pill pill--outline" href={t.cvHref} onClick={() => track('click-cv')}>
            {t.cvLabel}
          </a>
        </div>
        <span className="label">{t.footerLabel}</span>
      </div>
    </footer>
  )
}

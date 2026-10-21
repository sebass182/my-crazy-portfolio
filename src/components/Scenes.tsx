import { useEffect, useRef, type CSSProperties } from 'react'
import type { Project } from '../data/projects'

const base = import.meta.env.BASE_URL
const card = (slug: string, file: string, ext = 'webp') => `${base}cards/${slug}/${file}.${ext}`

// Every project gets a composition for its Work card, built from real material: the site's actual screen, panels cut
// from the case-study slides, or (Holo MD) the Figma modules. Six layouts, all square to the frame: nothing is rotated,
// skewed or cut on a slant — things are aligned on a shared centre line, with one margin and one corner radius.
// Layers are decorative — the wrapper carries the description.
type L = { src: string; cls: string }

function Layers({ items }: { items: L[] }) {
  return (
    <>
      {items.map((l) => (
        <img key={l.cls} className={l.cls} src={l.src} alt="" draggable={false} decoding="async" />
      ))}
    </>
  )
}

export default function Scene({ p }: { p: Project }) {
  const s = p.scene!
  const c = (f: string) => card(p.slug, f)

  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    root.current?.querySelectorAll('img').forEach((img) => void img.decode?.().catch(() => {}))
  }, [])

  const wrap = (children: React.ReactNode) => (
    <div
      ref={root}
      className={`scene scene--${s.kind} scene--${p.slug}${s.flip ? ' scene--flip' : ''}`}
      style={{ ['--bg' as string]: p.bg } as CSSProperties}
      role="img"
      aria-label={s.alt}
    >
      {children}
    </div>
  )

  switch (s.kind) {
    // The photo runs edge to edge; a panel from the case study sits in the lower right corner, on the frame's margin
    case 'bleed':
      return wrap(
        <Layers
          items={[
            { src: c('screen'), cls: 'sc-bleed__screen' },
            { src: c(s.panel ?? 'p1'), cls: 'sc-bleed__panel' },
          ]}
        />,
      )

    // The site's screen and a case-study panel side by side: same height, same top, same bottom
    case 'duo':
      return wrap(
        <Layers
          items={[
            { src: c('screen'), cls: 'sc-duo__screen' },
            { src: c(s.panel ?? 'p1'), cls: 'sc-duo__panel' },
          ]}
        />,
      )

    // Three panels in a row, equal in size and spacing
    case 'trio':
      return wrap(
        <Layers
          items={[
            { src: c('p1'), cls: 'sc-trio__a' },
            { src: c('p2'), cls: 'sc-trio__b' },
            { src: c('p3'), cls: 'sc-trio__c' },
          ]}
        />,
      )

    // Holo MD — the sign-in screen and the patient app's first screen, centred on one line
    case 'login':
      return wrap(
        <Layers
          items={[
            { src: c('login'), cls: 'sc-login__screen' },
            { src: c('phone-welcome'), cls: 'sc-login__phone' },
          ]}
        />,
      )

    // Maïa — the only laptop: transparent MacBook frame, real screen, the mobile page beside it on the same baseline
    case 'laptop':
      return wrap(
        <>
          <img className="sc-laptop__pattern" src={`${base}maia/hex.svg`} alt="" draggable={false} />
          <div className="sc-laptop__row">
            <div className="sc-laptop__device">
              <img className="sc-laptop__screen" src={`${base}maia/screen-desktop.webp`} alt="" draggable={false} decoding="async" />
              <img className="sc-laptop__frame" src={`${base}maia/laptop.webp`} alt="" draggable={false} decoding="async" />
            </div>
            <img className="sc-laptop__mobile" src={`${base}maia/screen-mobile.webp`} alt="" draggable={false} decoding="async" />
          </div>
        </>,
      )

    // Globalia — a bento on a two-column grid: the site on the left, two brand visuals stacked on the right
    case 'bento':
      return wrap(
        <Layers
          items={[
            { src: c('screen'), cls: 'sc-bento__main' },
            { src: c('p1'), cls: 'sc-bento__a' },
            { src: c('p2'), cls: 'sc-bento__b' },
          ]}
        />,
      )
  }
}

import { useEffect, useRef } from 'react'
import type { Project } from '../data/projects'

const base = import.meta.env.BASE_URL
const card = (slug: string, file: string, ext = 'webp') => `${base}cards/${slug}/${file}.${ext}`

// Every project gets its own composition for its Work card. They all use real material:
// the site's actual screen, panels cut from the case-study slides, or (Holo MD) the Figma modules.
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
    <div ref={root} className={`scene scene--${s.kind}`} role="img" aria-label={s.alt}>
      {children}
    </div>
  )

  switch (s.kind) {
    // Camping Québec — the forest photo runs edge to edge, a portrait panel leans in
    case 'bleed':
      return wrap(
        <Layers
          items={[
            { src: c('screen'), cls: 'sc-bleed__screen' },
            { src: c('p1'), cls: 'sc-bleed__panel' },
          ]}
        />,
      )

    // Air Transat — one browser window in perspective, a second panel floating in front
    case 'tilt':
      return wrap(
        <>
          <div className="sc-tilt__window">
            <i className="sc-tilt__bar" />
            <img src={c('screen')} alt="" draggable={false} decoding="async" />
          </div>
          <img className="sc-tilt__panel" src={c('p2')} alt="" draggable={false} decoding="async" />
        </>,
      )

    // ESSLLL — three posters at different heights over a ghosted channel page
    case 'posters':
      return wrap(
        <Layers
          items={[
            { src: c('screen'), cls: 'sc-posters__ghost' },
            { src: c('p1'), cls: 'sc-posters__a' },
            { src: c('p2'), cls: 'sc-posters__b' },
            { src: c('p3'), cls: 'sc-posters__c' },
          ]}
        />,
      )

    // Holo MD — the product modules from Figma, floating at different depths
    case 'modules':
      return wrap(
        <Layers
          items={[
            { src: c('doctor'), cls: 'sc-mod__doctor' },
            { src: c('dash'), cls: 'sc-mod__dash' },
            { src: c('phone-welcome'), cls: 'sc-mod__welcome' },
            { src: c('phone-chat'), cls: 'sc-mod__chat' },
            { src: c('drcard'), cls: 'sc-mod__drcard' },
            { src: c('diamond'), cls: 'sc-mod__diamond' },
            { src: card(p.slug, 'gem', 'svg'), cls: 'sc-mod__gem' },
          ]}
        />,
      )

    // Maïa — the only laptop: transparent MacBook frame, real screen, mobile card (no fake phone bezel)
    case 'laptop':
      return wrap(
        <>
          <img className="sc-laptop__pattern" src={`${base}maia/hex.svg`} alt="" draggable={false} />
          <div className="sc-laptop__device">
            <img className="sc-laptop__screen" src={`${base}maia/screen-desktop.webp`} alt="" draggable={false} decoding="async" />
            <img className="sc-laptop__frame" src={`${base}maia/laptop.webp`} alt="" draggable={false} decoding="async" />
          </div>
          <img className="sc-laptop__mobile" src={`${base}maia/screen-mobile.webp`} alt="" draggable={false} decoding="async" />
        </>,
      )

    // Lavigueur — the watch page sliced on a diagonal, the product sheet beside it
    case 'diagonal':
      return wrap(
        <Layers
          items={[
            { src: c('screen'), cls: 'sc-diag__screen' },
            { src: c('p2'), cls: 'sc-diag__panel' },
          ]}
        />,
      )

    // Intelli Jeunes — a tilted page with game "stickers" stuck around it
    case 'stickers':
      return wrap(
        <Layers
          items={[
            { src: c('screen'), cls: 'sc-stk__screen' },
            { src: c('p1'), cls: 'sc-stk__a' },
            { src: c('p3'), cls: 'sc-stk__b' },
          ]}
        />,
      )

    // Staking Data — a dashboard in perspective that runs off the card, alerts panel in front
    case 'dash':
      return wrap(
        <>
          <i className="sc-dash__grid" />
          <img className="sc-dash__screen" src={c('screen')} alt="" draggable={false} decoding="async" />
          <img className="sc-dash__panel" src={c('p3')} alt="" draggable={false} decoding="async" />
        </>,
      )

    // Globalia — an ecosystem bento: the site plus two brand visuals in tiles
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

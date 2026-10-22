import { useEffect, useRef, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'

/* A picture shown large over the case study. Several can be stepped through (← → or the buttons), Esc / the scrim / the
   button close it. It is a dialog of its own, rendered on <body> (the case study's panel scrolls; this must not), and it
   handles its keys before the case study does, so Esc closes only the picture and Tab stays inside it. */
export type LightboxItem = { src: string; alt: string; w: number; h: number; round?: boolean }

type Props = { items: LightboxItem[]; index: number; label: string; onIndex: (i: number) => void; onClose: () => void }

export default function Lightbox({ items, index, label, onIndex, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const n = items.length
  const it = items[index]

  // the key handler is registered once; it reads the latest props from here
  const live = useRef({ index, n, onIndex, onClose })
  useEffect(() => {
    live.current = { index, n, onIndex, onClose }
  })

  // what had focus when we opened, read before focus moves into the dialog (it survives a strict-mode re-run of the effect)
  const openerRef = useRef(document.activeElement as HTMLElement | null)
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    const opener = openerRef.current
    root.current?.querySelector<HTMLElement>('.lb__close')?.focus({ preventScroll: true })

    const onKey = (e: KeyboardEvent) => {
      const { index, n, onIndex, onClose } = live.current
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      } else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && n > 1) {
        e.stopPropagation()
        onIndex((index + (e.key === 'ArrowRight' ? 1 : -1) + n) % n)
      } else if (e.key === 'Tab') {
        e.stopPropagation()
        const items = [...(root.current?.querySelectorAll<HTMLElement>('button') ?? [])]
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        const active = document.activeElement
        if (!root.current?.contains(active)) {
          e.preventDefault()
          first.focus()
        } else if (e.shiftKey && active === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => {
      mounted.current = false
      window.removeEventListener('keydown', onKey, true)
      // give focus back only when the dialog is really gone (a strict-mode re-run mounts it again straight away)
      requestAnimationFrame(() => !mounted.current && opener?.focus?.({ preventScroll: true }))
    }
  }, [])

  if (!it) return null

  return createPortal(
    <div
      className="lb"
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      data-cursor="Fermer"
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest('.lb__img, .lb__bar, .lb__close')) onClose()
      }}
    >
      <button className="lb__close" onClick={onClose} aria-label="Fermer l'agrandissement">
        Fermer <span aria-hidden="true">✕</span>
      </button>

      <figure className="lb__fig">
        <img key={it.src} className={`lb__img${it.round ? ' is-round' : ''}`} src={it.src} alt={it.alt} width={it.w} height={it.h} style={{ ['--w' as string]: it.w, ['--h' as string]: it.h } as CSSProperties} draggable={false} data-cursor="" />
      </figure>

      {n > 1 && (
        <div className="lb__bar">
          <button className="lb__step" onClick={() => onIndex((index - 1 + n) % n)} aria-label="Image précédente">
            ←
          </button>
          <span className="lb__count" aria-live="polite">
            {index + 1} / {n}
          </span>
          <button className="lb__step" onClick={() => onIndex((index + 1) % n)} aria-label="Image suivante">
            →
          </button>
        </div>
      )}
    </div>,
    document.body,
  )
}

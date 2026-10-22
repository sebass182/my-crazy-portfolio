import { gsap } from './gsap'

/* Buttons that lean towards the pointer while it is over them and spring back on leave (the footer's links, the hero buttons,
   the language switch). Call it inside useGSAP with its contextSafe, and return the cleanup. */
export function magnetic(
  els: HTMLElement[],
  contextSafe: <T extends (...args: never[]) => unknown>(fn: T) => T,
  defaultStrength = 0.35,
) {
  const cleanups = els.map((el) => {
    const strength = Number(el.dataset.strength ?? defaultStrength)
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })

    const move = contextSafe((e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    })
    const leave = contextSafe(() => {
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
}

import { ScrollTrigger, prefersReducedMotion } from './gsap'

/* Scrolls to an in-page anchor. Short hops glide; a long one — the pinned Work slider alone is ~9 screens of scroll —
   jumps straight to its target instead of dragging the visitor through everything in between. */
export function jumpTo(href: string) {
  const anchor = document.querySelector(href)
  if (!anchor) return false
  // A pinned section (Work) is wrapped in a ScrollTrigger spacer; once you are past it, the section itself has been
  // moved to the bottom of that spacer, so measure the spacer — it always starts where the section starts.
  const target = anchor.parentElement?.classList.contains('pin-spacer') ? anchor.parentElement : anchor
  const top = target.getBoundingClientRect().top + window.scrollY
  const far = Math.abs(top - window.scrollY) > window.innerHeight * 1.5
  history.pushState(null, '', href)
  const instant = far || prefersReducedMotion()
  // html has `scroll-behavior: smooth`; an explicit 'instant' overrides it
  window.scrollTo({ top, behavior: instant ? ('instant' as ScrollBehavior) : 'smooth' })
  if (instant) settleScrubs()
  return true
}

/* Scrubbed animations ease towards their new position (scrub: 1 is about a second of catch-up). After a jump that reads
   as everything sliding in from where it was — the photos, the slider — so land them on their final state at once.
   Two passes: the cards' own triggers follow the slider's progress, which the first pass has just moved. */
function settleScrubs() {
  for (let pass = 0; pass < 2; pass++) {
    ScrollTrigger.update()
    ScrollTrigger.getAll().forEach((st) => {
      const catchUp: unknown = st.getTween() // a tween for `scrub: <seconds>`; for `scrub: true` it is just a number (nothing to settle)
      if (catchUp && typeof (catchUp as gsap.core.Tween).progress === 'function') (catchUp as gsap.core.Tween).progress(1)
    })
  }
}

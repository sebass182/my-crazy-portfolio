import { prefersReducedMotion } from './gsap'

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
  // html has `scroll-behavior: smooth`; an explicit 'instant' overrides it
  window.scrollTo({ top, behavior: far || prefersReducedMotion() ? ('instant' as ScrollBehavior) : 'smooth' })
  return true
}

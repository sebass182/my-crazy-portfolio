import { useEffect, useState } from 'react'
import { ScrollTrigger, prefersReducedMotion } from './lib/gsap'
import { projects, mockupOf } from './data/projects'
import { useLang } from './i18n/context'
import { useProjects } from './i18n/data'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Preloader from './components/Preloader'
import Hero from './components/Hero'
import Work from './components/Work'
import Others from './components/Others'
import About from './components/About'
import Contact from './components/Contact'
import ProjectView from './components/ProjectView'

// The loader is skipped for visitors who asked for reduced motion and for anyone who already saw it this session
const shouldSkipPreloader = () => {
  if (prefersReducedMotion()) return true
  try {
    return sessionStorage.getItem('seen-preloader') === '1'
  } catch {
    return false
  }
}

export default function App() {
  const [ready, setReady] = useState(shouldSkipPreloader)
  const { lang } = useLang()
  const localized = useProjects()
  const [slug, setSlug] = useState<string | null>(null) // the open case study, by slug: it follows the language
  const project = slug ? (localized.find((p) => p.slug === slug) ?? null) : null

  // Lock scrolling while loading; re-measure scroll triggers once released
  useEffect(() => {
    document.body.classList.toggle('is-loading', !ready)
    if (ready) ScrollTrigger.refresh()
  }, [ready])

  // Keep the page behind an open case study out of the tab order and away from screen readers
  useEffect(() => {
    const behind = document.querySelectorAll('main, .nav')
    behind.forEach((el) => (project ? el.setAttribute('inert', '') : el.removeAttribute('inert')))
  }, [project, lang])

  // The tree is keyed by the language: switching it rebuilds every section (the split text, the pinned scenes and the scroll
  // triggers are all built from the words, so they are simply built again).
  return (
    <div key={lang} style={{ display: 'contents' }}>
      <Cursor />
      {!ready && <Preloader images={projects.map(mockupOf)} onDone={() => setReady(true)} />}
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} />
        <Work onOpen={(p) => setSlug(p.slug)} />
        <About />
        <Others />
        <Contact ready={ready} />
      </main>
      {project && <ProjectView project={project} onClose={() => setSlug(null)} onNavigate={(p) => setSlug(p.slug)} />}
    </div>
  )
}

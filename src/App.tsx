import { useEffect, useState } from 'react'
import { ScrollTrigger, prefersReducedMotion } from './lib/gsap'
import { projects, mockupOf, type Project } from './data/projects'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Preloader from './components/Preloader'
import Hero from './components/Hero'
import Work from './components/Work'
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
  const [project, setProject] = useState<Project | null>(null)

  // Lock scrolling while loading; re-measure scroll triggers once released
  useEffect(() => {
    document.body.classList.toggle('is-loading', !ready)
    if (ready) ScrollTrigger.refresh()
  }, [ready])

  // Keep the page behind an open case study out of the tab order and away from screen readers
  useEffect(() => {
    const behind = document.querySelectorAll('main, .nav')
    behind.forEach((el) => (project ? el.setAttribute('inert', '') : el.removeAttribute('inert')))
  }, [project])

  return (
    <>
      <Cursor />
      {!ready && <Preloader images={projects.map(mockupOf)} onDone={() => setReady(true)} />}
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} />
        <Work onOpen={setProject} />
        <About />
        <Contact />
      </main>
      {project && <ProjectView project={project} onClose={() => setProject(null)} onNavigate={setProject} />}
    </>
  )
}

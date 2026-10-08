import { useEffect, useState } from 'react'
import { ScrollTrigger } from './lib/gsap'
import type { Project } from './data/projects'
import Cursor from './components/Cursor'
import Preloader from './components/Preloader'
import Hero from './components/Hero'
import Work from './components/Work'
import About from './components/About'
import Contact from './components/Contact'
import ProjectView from './components/ProjectView'

export default function App() {
  const [ready, setReady] = useState(false)
  const [project, setProject] = useState<Project | null>(null)

  // Lock scrolling while loading; re-measure pinned sections once released
  useEffect(() => {
    document.body.classList.toggle('is-loading', !ready)
    if (ready) ScrollTrigger.refresh()
  }, [ready])

  return (
    <>
      <Cursor />
      {!ready && <Preloader onDone={() => setReady(true)} />}
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

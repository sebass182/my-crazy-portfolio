import { useMemo } from 'react'
import { projects as projectsFr, type Project } from '../data/projects'
import { cases as casesFr, type CaseData } from '../data/cases'
import { projectsEn, casesEn } from './content.en'
import { useLang } from './context'
import type { Lang } from './ui'

/* The projects and case studies in the visitor's language. French is the data as written; English overlays the words only: names,
   colours, pictures, positions and layers are the same objects, so no mockup or screenshot is ever touched. */
export const localProject = (p: Project, lang: Lang): Project => {
  if (lang === 'fr') return p
  const e = projectsEn[p.slug]
  if (!e) return p
  return { ...p, tags: e.tags, summary: e.summary, details: e.details, meta: e.meta ?? p.meta, scene: p.scene ? { ...p.scene, alt: e.sceneAlt } : p.scene }
}

export const localCase = (slug: string, lang: Lang): CaseData | undefined => {
  const c = casesFr[slug]
  if (!c || lang === 'fr') return c
  const e = casesEn[slug]
  if (!e) return c
  return {
    ...c,
    meta: e.meta,
    hero: { ...c.hero, alt: e.heroAlt },
    intro: { ...c.intro, lead: e.lead, photo: { ...c.intro.photo, alt: e.photoAlt }, chips: c.intro.chips.map((ch, i) => ({ ...ch, text: e.chips[i] })) },
    slides: c.slides.map((s, i) => ({
      ...s,
      title: e.slides[i].title,
      text: e.slides[i].text,
      layers: s.layers.map((l) => (l.alt ? { ...l, alt: `${e.slides[i].title}: interface preview` } : l)),
    })),
  }
}

export function useProjects(): Project[] {
  const { lang } = useLang()
  return useMemo(() => projectsFr.map((p) => localProject(p, lang)), [lang])
}

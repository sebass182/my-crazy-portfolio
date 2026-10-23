import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ui, type Lang } from './ui'
import { LangContext } from './context'
import { track } from '../lib/track'

/* The site's language: ?lang=fr|en in the address wins (so a link can pick it), then what the visitor chose last time, then their
   browser's own language. The <html lang>, the tab title and the description follow it. */
const STORAGE = 'site-lang'

const detect = (): Lang => {
  try {
    const q = new URLSearchParams(window.location.search).get('lang')
    if (q === 'fr' || q === 'en') return q
    const saved = localStorage.getItem(STORAGE)
    if (saved === 'fr' || saved === 'en') return saved
  } catch {
    /* storage can be blocked: fall through */
  }
  return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detect)
  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    track('lang-' + l)
    try {
      localStorage.setItem(STORAGE, l)
      const url = new URL(window.location.href)
      url.searchParams.set('lang', l)
      window.history.replaceState(null, '', url)
    } catch {
      /* storage / history can be blocked */
    }
  }, [])

  useEffect(() => {
    const t = ui[lang]
    document.documentElement.lang = lang
    document.title = t.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.description)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', t.description.replace(/^Sébastien Lemyre, [^:]+: /, ''))
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', lang === 'fr' ? 'fr_CA' : 'en_CA')
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t: ui[lang] }), [lang, setLang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}


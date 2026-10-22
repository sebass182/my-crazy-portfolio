import { createContext, useContext } from 'react'
import { ui, type Lang } from './ui'

export type LangCtx = { lang: Lang; setLang: (l: Lang) => void; t: (typeof ui)['fr'] }
export const LangContext = createContext<LangCtx>({ lang: 'fr', setLang: () => {}, t: ui.fr })
export const useLang = () => useContext(LangContext)

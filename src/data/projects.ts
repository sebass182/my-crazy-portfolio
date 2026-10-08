export type Project = {
  slug: string
  n: string
  name: string
  tags: string
  summary: string
  bg: string // cover-slide background
  accent: string // headline colour — every accent is ≥4.5:1 against its bg (AA)
  cover: number // first slide of the case study in the deck
  details: [string, string, string] // titles of the three detail slides, used as image descriptions
}

// Each case study in the deck is 7 consecutive slides:
// cover (skipped on the site) · laptop mockup · context · objectives · 3 detail slides
const PAGES = 6

const pad = (n: number) => String(n).padStart(2, '0')
const base = import.meta.env.BASE_URL
const slide = (n: number) => `${base}work/t${pad(n)}.webp` // 1920px
const slideSm = (n: number) => `${base}work/t${pad(n)}-sm.webp` // 960px

export const mockupOf = (p: Project) => slideSm(p.cover + 1) // card + hero strip
export const altOf = (p: Project) => slideSm(p.cover + 4) // card hover (first detail slide, photo-rich)

export type Slide = { src: string; alt: string }
export const slidesOf = (p: Project): Slide[] => {
  const alts = ['maquette de la plateforme', 'contexte du projet', 'objectifs du projet', ...p.details]
  return Array.from({ length: PAGES }, (_, i) => ({
    src: slide(p.cover + 1 + i),
    alt: `${p.name} — ${alts[i]}`,
  }))
}

export const projects: Project[] = [
  {
    slug: 'camping-quebec',
    n: '01',
    name: 'Camping Québec',
    tags: 'Ancrage produit, UX B2C/B2B complexe',
    summary:
      'Refonte de la plateforme touristique officielle : moteur de recherche de terrains, gestion des favoris et portail B2B pour les exploitants.',
    bg: '#003b2d',
    accent: '#2fe39b',
    cover: 5,
    details: [
      'recherche géolocalisée et système de favoris',
      'espace propriétaire et gestion des adhésions',
      'contenus inspirationnels et outils pour campeurs',
    ],
  },
  {
    slug: 'air-transat-ria',
    n: '02',
    name: 'Air Transat / Ria',
    tags: 'Notoriété de marque, IA Inbound',
    summary:
      "Refonte de l'expérience de réservation & écosystème conversationnel Inbound : agent IA Ria, landings dynamiques et retargeting personnalisé.",
    bg: '#162a54',
    accent: '#1fa5ea',
    cover: 12,
    details: [
      'Inbound AI et recherche conversationnelle avec Ria',
      'landings de destinations hyper-personnalisées',
      'retargeting automatisé et infolettres personnalisées',
    ],
  },
  {
    slug: 'essll',
    n: '03',
    name: 'ESSLLL',
    tags: 'Autonomie créative, GenAI, Growth & chiffres réels',
    summary: "Direction artistique et croissance d'une marque musicale entièrement produite par IA.",
    bg: '#1f1f1f',
    accent: '#b89b6a',
    cover: 19,
    details: [
      'direction artistique et univers visuel généré par IA',
      'production multimédia et déclinaisons de contenus vidéo',
      'distribution, streaming et communauté Patreon',
    ],
  },
  {
    slug: 'holo-md',
    n: '04',
    name: 'Holo MD',
    tags: 'SaaS MedTech complexe, HIPAA, AI clinique',
    summary:
      'Plateforme HealthTech & IA en psychiatrie clinique : branding, plateforme d’investissement, application patient et dashboard de suivi RTM.',
    bg: '#000131',
    accent: '#7b6dff',
    cover: 26,
    details: [
      "branding global, brandbook et vitrine d'investissement",
      'application patient et suivi thérapeutique à distance',
      'dashboard psychiatre et aide à la décision clinique',
    ],
  },
  {
    slug: 'maia',
    n: '05',
    name: 'Maïa',
    tags: 'Branding B2B, plateforme d’acquisition',
    summary:
      'Créer de zéro la première identité de marque et plateforme web propulsant les entreprises féminines au Canada.',
    bg: '#011c1f',
    accent: '#ff6b5c',
    cover: 33,
    details: ['identité de marque et guide de normes graphiques', "parcours d'acquisition web", 'expérience mobile optimisée'],
  },
  {
    slug: 'bijouterie-lavigueur',
    n: '06',
    name: 'Bijouterie Lavigueur',
    tags: 'E-commerce luxe, DA premium',
    summary:
      "Élever l'expérience e-commerce : direction artistique et parcours d'achat d'une bijouterie sur Magento.",
    bg: '#011331',
    accent: '#5b8dff',
    cover: 40,
    details: ['direction artistique et vision luxe', "l'expérience catalogue", 'habillage du tunnel de commande standardisé'],
  },
  {
    slug: 'intelli-jeunes',
    n: '07',
    name: 'Intelli Jeunes',
    tags: 'Gamification, univers ludique, 3D/IA',
    summary:
      'Portail éducatif IA & catalogue de jeux ludo-éducatifs : conception complète de la plateforme web et univers visuel pour le primaire.',
    bg: '#600177',
    accent: '#ffa11f',
    cover: 47,
    details: [
      'mascottes 3D et prompt engineering via Midjourney',
      'modules ludiques et outils enseignants',
      "écosystème web et parcours d'accès",
    ],
  },
  {
    slug: 'staking-data',
    n: '08',
    name: 'Staking Data / View',
    tags: 'Data visualization, dashboards fintech',
    summary:
      'Simplifier le staking de crypto-actifs et unifier la gestion de portfolio à travers une expérience fluide, sécurisée et orientée data.',
    bg: '#08183a',
    accent: '#8c82ff',
    cover: 54,
    details: ['gestion de portfolio unifiée', 'calculateur de gains intelligent', 'suivi des validateurs et alertes'],
  },
  {
    slug: 'globalia-brand',
    n: '09',
    name: 'Globalia Brand Identity',
    tags: 'Cap-stone : direction artistique d’agence 360°',
    summary:
      'Direction artistique globale de marque : stratégie de contenu, présence numérique, communications RH/Ventes et swag corporatif.',
    bg: '#162a54',
    accent: '#ff6b6b',
    cover: 61,
    details: [
      'refonte du site corporatif et études de cas',
      'écosystème social media, documents RH et outils de vente',
      'microsite événementiel, site carrière et swag',
    ],
  },
]

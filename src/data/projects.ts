export type Project = {
  slug: string
  n: string
  name: string
  tags: string
  summary: string
  bg: string // cover-slide background
  accent: string // cover-slide headline colour
  cover: number // first slide of the case study (t{cover}.png)
}

// Every case study in the deck is 7 consecutive slides:
// cover · laptop mockup · context · objectives · 3 detail slides
export const SLIDES_PER_PROJECT = 7

export const slideSrc = (n: number) => `/work/t${String(n).padStart(2, '0')}.png`
export const mockupOf = (p: Project) => slideSrc(p.cover + 1)
// The cover slide (logo + title) is skipped here: the overlay header already shows the name and summary
export const slidesOf = (p: Project) =>
  Array.from({ length: SLIDES_PER_PROJECT - 1 }, (_, i) => slideSrc(p.cover + 1 + i))

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
  },
  {
    slug: 'bijouterie-lavigueur',
    n: '06',
    name: 'Bijouterie Lavigueur',
    tags: 'E-commerce luxe, DA premium',
    summary:
      "Élever l'expérience e-commerce : direction artistique et parcours d'achat d'une bijouterie sur Magento.",
    bg: '#011331',
    accent: '#2f66ff',
    cover: 40,
  },
  {
    slug: 'intelli-jeunes',
    n: '07',
    name: 'Intelli Jeunes',
    tags: 'Gamification, univers ludique, 3D/IA',
    summary:
      "Portail éducatif IA & catalogue de jeux ludo-éducatifs : conception complète de la plateforme web et univers visuel pour le primaire.",
    bg: '#600177',
    accent: '#ffa11f',
    cover: 47,
  },
  {
    slug: 'staking-data',
    n: '08',
    name: 'Staking Data / View',
    tags: 'Data visualization, dashboards fintech',
    summary:
      'Simplifier le staking de crypto-actifs et unifier la gestion de portfolio à travers une expérience fluide, sécurisée et orientée data.',
    bg: '#08183a',
    accent: '#7a6dff',
    cover: 54,
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
  },
]

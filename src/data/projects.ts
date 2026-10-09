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
  scene?: Scene // when set, the Work card shows this composed scene instead of the flat deck mockup
  meta?: Meta // role / agency / scope / tools, shown under the title
  brand?: Brand // when set, the case study opens with a brand panel (logo, palette, type, pattern)
}

// Each Work card has its own composition (see components/Scenes.tsx)
export type SceneKind = 'bleed' | 'tilt' | 'posters' | 'modules' | 'laptop' | 'diagonal' | 'stickers' | 'dash' | 'bento'
export type Scene = { kind: SceneKind; alt: string }

// Read off each deck cover slide
export type Meta = { role: string; agency: string; scope: string; tools: string }

export type Brand = {
  logo: string
  pattern: string
  palette: { name: string; hex: string; ink: string }[] // ink = readable text colour on that swatch
  fonts: { name: string; role: string; family: string; sample: string }[]
}

// Each case study in the deck is 7 consecutive slides:
// cover (skipped on the site) · laptop mockup · context · objectives · 3 detail slides
const PAGES = 6

const pad = (n: number) => String(n).padStart(2, '0')
const base = import.meta.env.BASE_URL
const slide = (n: number) => `${base}work/t${pad(n)}.webp` // 1920px
const slideSm = (n: number) => `${base}work/t${pad(n)}-sm.webp` // 960px

export const mockupOf = (p: Project) => slideSm(p.cover + 1) // card + hero strip

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
    scene: { kind: 'bleed', alt: 'Site Camping Québec : page d’accueil plein cadre et écran du moteur de recherche de terrains' },
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
    scene: { kind: 'tilt', alt: 'Site Air Transat : la page « Soyez prêt pour votre voyage familial en Jamaïque » dans une fenêtre de navigateur inclinée' },
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
    scene: { kind: 'posters', alt: 'ESSLLL : trois visuels de la marque musicale en triptyque, sur fond de chaîne YouTube' },
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
    scene: { kind: 'modules', alt: 'Holo MD : tableaux de bord cliniques, écrans de l’application patient, carte du Dr Holo et losange de marque' },
    details: [
      "branding global, brandbook et vitrine d'investissement",
      'application patient et suivi thérapeutique à distance',
      'dashboard psychiatre et aide à la décision clinique',
    ],
    meta: {
      role: 'Lead Product Designer & Brand Strategist',
      agency: 'Globalia',
      scope: 'Branding 360° · Micro-site de financement · App patient (LLM chatbot) · SaaS clinique (RTM & billing)',
      tools: 'Figma',
    },
  },
  {
    slug: 'maia',
    n: '05',
    name: 'Maïa',
    tags: 'Branding B2B, plateforme d’acquisition',
    summary:
      'Créer de zéro la première identité de marque et plateforme web propulsant les entreprises féminines au Canada.',
    // brand colours straight from the Figma variables (saumon on vert = 5.04:1)
    bg: '#032d32',
    accent: '#f36d64',
    cover: 33,
    scene: { kind: 'laptop', alt: 'Site Maïa : page d’accueil sur portable et bloc « Restez connectée » sur téléphone' },
    details: ['identité de marque et guide de normes graphiques', "parcours d'acquisition web", 'expérience mobile optimisée'],
    brand: {
      logo: `${base}maia/logo.svg`,
      pattern: `${base}maia/hex.svg`,
      palette: [
        { name: 'Vert', hex: '#032d32', ink: '#ffffff' },
        { name: 'Saumon', hex: '#f36d64', ink: '#032d32' },
        { name: 'Vert moyen', hex: '#bbd4ce', ink: '#032d32' },
        { name: 'Saumon pâle', hex: '#fff6ec', ink: '#032d32' },
        { name: 'Charcoal', hex: '#212121', ink: '#ffffff' },
        { name: 'Blanc', hex: '#ffffff', ink: '#032d32' },
      ],
      fonts: [
        { name: 'Playfair Display', role: 'Titres', family: "'Playfair Display', serif", sample: 'Entreprises féminines' },
        { name: 'Outfit', role: 'Texte et interface', family: "'Outfit', sans-serif", sample: 'Partenariats gagnants' },
      ],
    },
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
    scene: { kind: 'diagonal', alt: 'Bijouterie Lavigueur : page d’accueil de la montre Alpina découpée en diagonale et fiche produit mobile' },
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
    scene: { kind: 'stickers', alt: 'Intelli Jeunes : page d’accueil du portail éducatif avec mascotte, entourée de vignettes de jeux' },
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
    scene: { kind: 'dash', alt: 'Staking Data : tableau de bord des actifs en perspective et écran d’alertes mobile' },
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
    scene: { kind: 'bento', alt: 'Globalia : site corporatif et deux visuels de l’écosystème de marque en mosaïque' },
    details: [
      'refonte du site corporatif et études de cas',
      'écosystème social media, documents RH et outils de vente',
      'microsite événementiel, site carrière et swag',
    ],
  },
]

// Built from the Figma deck (final v4 — fr): every module's position, stacking order and the deck's own copy.
// It is plain data now — edit it by hand to nudge a layer. x / y / w are % of the slide's right-hand stage (839×1080);
// z = stacking order; d = parallax depth (back ≈ 0.15, front ≈ 2).
//   kind  bg    a full-panel ground (never moves)      mod    a rectangular screen / photo / card (rounded corners + shadow)
//         shape a see-through cut-out (phone, sticker…) cut   the edges where a module runs off the slide: t b l r (kept square)
export type CaseLayer = { f: string; iw: number; ih: number; x: number; y: number; w: number; z: number; d: number; kind: 'bg' | 'mod' | 'shape'; cut?: string; alt?: string }
export type CaseSlide = { n: string; title: string; text: string; stage: string; bleed?: boolean; layers: CaseLayer[] }
export type CaseImg = { f: string; iw: number; ih: number; alt: string }
export type CaseMeta = { role: string; agency: string; scope: string; tools: string }
// a goal chip floating over the context photo: x / y / w / h are % of the photo's width (y of its height)
export type CaseChip = { n: string; text: string; x: number; y: number; w: number; h: number }
export type CaseData = {
  base: string
  meta: CaseMeta
  // the project's screen; x / y / w place it inside the laptop (% of the laptop's box)
  hero: CaseImg & { x: number; y: number; w: number }
  intro: { lead: string; photo: CaseImg; chips: CaseChip[] }
  slides: CaseSlide[]
}

export const cases: Record<string, CaseData> = {
 "camping-quebec": {
  "base": "cases/camping/",
  "meta": {
   "role": "Senior UI/UX Web Designer",
   "agency": "Globalia",
   "scope": "Architecture B2C/B2B · Recherche géolocalisée · Portail exploitant",
   "tools": "Figma"
  },
  "hero": {
   "f": "hero.webp",
   "iw": 2382,
   "ih": 1494,
   "alt": "Page d’accueil — Camping Québec",
   "x": 9.6,
   "y": 6.2,
   "w": 80.9
  },
  "intro": {
   "lead": "Le projet visait à restructurer un écosystème à double enjeu : un portail B2C fluide orienté sur la découverte et la recherche de terrains, ainsi qu'une Zone Exploitant complète pour la gestion des adhésions et des fiches d'établissements.",
   "photo": {
    "f": "intro.webp",
    "iw": 1678,
    "ih": 2160,
    "alt": "Une tente orange éclairée sous un ciel étoilé, au milieu de la forêt"
   },
   "chips": [
    {
     "n": "01",
     "text": "Optimiser la recherche et la découverte de terrains",
     "x": -11.7,
     "y": 10.5,
     "w": 46.1,
     "h": 15
    },
    {
     "n": "02",
     "text": "Numériser la Zone Exploitant et l'adhésion B2B",
     "x": 45.2,
     "y": 30,
     "w": 46.1,
     "h": 15
    },
    {
     "n": "03",
     "text": "Enrichir le contenu décisionnel et l'expérience mobile",
     "x": -5.4,
     "y": 56.6,
     "w": 46.1,
     "h": 15
    }
   ]
  },
  "slides": [
   {
    "n": "01",
    "title": "Recherche géolocalisée & système de favoris",
    "text": "Structure d'une interface de recherche intuitive permettant d'explorer les terrains par région, promotions ou équipements. Intégration d'un espace Mes destinations favorites et de fiches d'établissements détaillées pour accélérer la prise de décision.",
    "stage": "#003c2d",
    "layers": [
     {
      "f": "g1-fiche.webp",
      "iw": 1242,
      "ih": 2050,
      "x": 13.1,
      "y": 5.1,
      "w": 74,
      "z": 1,
      "d": 0.5,
      "kind": "mod",
      "cut": "b",
      "alt": "Recherche géolocalisée & système de favoris : aperçu de l’interface"
     },
     {
      "f": "g1-charlevoix.webp",
      "iw": 1448,
      "ih": 1306,
      "x": 6.9,
      "y": 39.5,
      "w": 86.3,
      "z": 2,
      "d": 0.5,
      "kind": "mod",
      "cut": "b",
      "alt": "Recherche géolocalisée & système de favoris : aperçu de l’interface"
     }
    ]
   },
   {
    "n": "02",
    "title": "Espace propriétaire & gestion des adhésions",
    "text": "Création des gabarits complexes de la Zone Exploitant. Le portail permet aux gestionnaires de terrains de mettre à jour leurs informations, gérer leur adhésion annuelle et accéder aux données et ressources de l'industrie.",
    "stage": "#003c2d",
    "layers": [
     {
      "f": "g2-bg.webp",
      "iw": 1678,
      "ih": 2160,
      "x": 0,
      "y": 0,
      "w": 100,
      "z": 0,
      "d": 0.15,
      "kind": "bg"
     },
     {
      "f": "g2-admin.webp",
      "iw": 1220,
      "ih": 774,
      "x": 13.5,
      "y": 24.5,
      "w": 72.7,
      "z": 2,
      "d": 0.8,
      "kind": "mod",
      "alt": "Espace propriétaire & gestion des adhésions : aperçu de l’interface"
     },
     {
      "f": "g2-section.webp",
      "iw": 432,
      "ih": 81,
      "x": -7.2,
      "y": 7.4,
      "w": 51.5,
      "z": 3,
      "d": 1.9,
      "kind": "mod",
      "cut": "l"
     },
     {
      "f": "g2-f2608727.webp",
      "iw": 408,
      "ih": 204,
      "x": -6.6,
      "y": 74.2,
      "w": 48.5,
      "z": 4,
      "d": 1.7,
      "kind": "mod",
      "cut": "l",
      "alt": "Espace propriétaire & gestion des adhésions : aperçu de l’interface"
     },
     {
      "f": "g2-f1000004433.webp",
      "iw": 173,
      "ih": 212,
      "x": 70.8,
      "y": 76.6,
      "w": 20.6,
      "z": 5,
      "d": 1.9,
      "kind": "shape",
      "alt": "Espace propriétaire & gestion des adhésions : aperçu de l’interface"
     },
     {
      "f": "g2-f2608714.webp",
      "iw": 260,
      "ih": 44,
      "x": 61.9,
      "y": 12.4,
      "w": 31,
      "z": 6,
      "d": 2,
      "kind": "mod"
     }
    ]
   },
   {
    "n": "03",
    "title": "Contenus inspirationnels & outils pour campeurs",
    "text": "Déploiement des gabarits d'exploration (Explore, Promotions, Outils Camping et Blogue). La cohérence du ton vert forêt et de la typographie épurée installe un univers de marque chaleureux et professionnel.",
    "stage": "#003c2d",
    "layers": [
     {
      "f": "g3-f1000004434.webp",
      "iw": 372,
      "ih": 478,
      "x": 0,
      "y": 6.7,
      "w": 44.3,
      "z": 1,
      "d": 1.2,
      "kind": "shape",
      "alt": "Contenus inspirationnels & outils pour campeurs : aperçu de l’interface"
     },
     {
      "f": "g3-blogue.webp",
      "iw": 1100,
      "ih": 994,
      "x": 17.5,
      "y": 5.6,
      "w": 65.6,
      "z": 2,
      "d": 0.7,
      "kind": "mod",
      "alt": "Contenus inspirationnels & outils pour campeurs : aperçu de l’interface"
     },
     {
      "f": "g3-prix.webp",
      "iw": 1418,
      "ih": 1114,
      "x": 8,
      "y": 48.4,
      "w": 84.5,
      "z": 3,
      "d": 0.5,
      "kind": "mod",
      "cut": "b",
      "alt": "Contenus inspirationnels & outils pour campeurs : aperçu de l’interface"
     }
    ]
   }
  ]
 },
 "essll": {
  "base": "cases/esslll/",
  "meta": {
   "role": "Créateur & D.A.",
   "agency": "Projet personnel",
   "scope": "Production musicale IA · Identité visuelle · Vidéo · Distribution",
   "tools": "Midjourney · Ideogram · Suno · ChatGPT · Figma"
  },
  "hero": {
   "f": "hero.webp",
   "iw": 2346,
   "ih": 1532,
   "alt": "Page d’accueil — ESSLLL",
   "x": 10.3,
   "y": 5.9,
   "w": 79.7
  },
  "intro": {
   "lead": "Projet personnel né de la rencontre entre 15 ans dans un groupe de musique, une formation en photographie et un parcours de designer UI/UX. ESSLLL est un groupe de metalcore entièrement conçu à l'aide de l'intelligence artificielle : paroles, composition musicale, imagerie et identité de marque. De la direction artistique jusqu'à la distribution, chaque aspect du projet a été pensé et exécuté en solo.",
   "photo": {
    "f": "intro.webp",
    "iw": 1678,
    "ih": 2160,
    "alt": "Une silhouette en cape sur une falaise battue par la tempête"
   },
   "chips": [
    {
     "n": "01",
     "text": "Identité de marque & direction artistique",
     "x": 10.4,
     "y": 5.4,
     "w": 46.1,
     "h": 13.1
    },
    {
     "n": "02",
     "text": "Production de contenu vidéo & présence multiplateforme",
     "x": -12,
     "y": 43,
     "w": 47.7,
     "h": 15
    },
    {
     "n": "03",
     "text": "Distribution & croissance d'audience",
     "x": 42.8,
     "y": 65,
     "w": 45.8,
     "h": 13.1
    }
   ]
  },
  "slides": [
   {
    "n": "01",
    "title": "Direction artistique & univers visuel généré par IA",
    "text": "En s'appuyant sur Midjourney et Ideogram, j'ai développé une esthétique visuelle distincte pour chaque sortie tout en maintenant une signature de marque reconnaissable à travers l'ensemble du catalogue, nourrie par plus de 20 ans d'expérience en photographie et en design.",
    "stage": "#1f1f1f",
    "layers": [
     {
      "f": "g-bg.webp",
      "iw": 1678,
      "ih": 2160,
      "x": 0,
      "y": 0,
      "w": 100,
      "z": 0,
      "d": 0.15,
      "kind": "bg"
     },
     {
      "f": "g1-image9.webp",
      "iw": 1368,
      "ih": 1164,
      "x": 9.3,
      "y": 46.1,
      "w": 81.5,
      "z": 2,
      "d": 0.5,
      "kind": "mod",
      "cut": "b",
      "alt": "Direction artistique & univers visuel généré par IA : aperçu de l’interface"
     },
     {
      "f": "g1-download1.webp",
      "iw": 1196,
      "ih": 448,
      "x": 15.5,
      "y": 3.2,
      "w": 71.3,
      "z": 3,
      "d": 1.4,
      "kind": "mod",
      "alt": "Direction artistique & univers visuel généré par IA : aperçu de l’interface"
     },
     {
      "f": "g1-rect2.webp",
      "iw": 290,
      "ih": 254,
      "x": 11.3,
      "y": 29.2,
      "w": 17.3,
      "z": 4,
      "d": 2,
      "kind": "mod"
     },
     {
      "f": "g1-vintage.webp",
      "iw": 320,
      "ih": 320,
      "x": 71.8,
      "y": 26.9,
      "w": 19.1,
      "z": 5,
      "d": 2,
      "kind": "mod"
     },
     {
      "f": "g1-image10.webp",
      "iw": 454,
      "ih": 382,
      "x": 37.5,
      "y": 26.2,
      "w": 27.1,
      "z": 6,
      "d": 1.9,
      "kind": "mod",
      "alt": "Direction artistique & univers visuel généré par IA : aperçu de l’interface"
     }
    ]
   },
   {
    "n": "02",
    "title": "Production multimédia & déclinaisons de contenus vidéo",
    "text": "Chaque chanson est accompagnée d'une vidéo dédiée et de formats courts pensés pour les réseaux sociaux et diffusés sur l'ensemble des plateformes. Cette production continue a permis de bâtir une chaîne YouTube de 3 500 abonnés générant plus de 360 000 vues.",
    "stage": "#1f1f1f",
    "layers": [
     {
      "f": "g-bg.webp",
      "iw": 1678,
      "ih": 2160,
      "x": 0,
      "y": 0,
      "w": 100,
      "z": 0,
      "d": 0.15,
      "kind": "bg"
     },
     {
      "f": "g2-image13.webp",
      "iw": 1266,
      "ih": 1272,
      "x": 12.3,
      "y": 30.8,
      "w": 75.4,
      "z": 2,
      "d": 0.5,
      "kind": "mod",
      "alt": "Production multimédia & déclinaisons de contenus vidéo : aperçu de l’interface"
     },
     {
      "f": "g2-image14.webp",
      "iw": 388,
      "ih": 852,
      "x": 73.1,
      "y": 11.1,
      "w": 23.1,
      "z": 3,
      "d": 1.7,
      "kind": "mod",
      "alt": "Production multimédia & déclinaisons de contenus vidéo : aperçu de l’interface"
     },
     {
      "f": "g2-image15.webp",
      "iw": 390,
      "ih": 698,
      "x": 43.3,
      "y": 5.6,
      "w": 23.2,
      "z": 4,
      "d": 1.7,
      "kind": "mod",
      "alt": "Production multimédia & déclinaisons de contenus vidéo : aperçu de l’interface"
     },
     {
      "f": "g2-image17.webp",
      "iw": 648,
      "ih": 356,
      "x": -3,
      "y": 9.9,
      "w": 38.6,
      "z": 5,
      "d": 1.8,
      "kind": "mod",
      "cut": "l"
     },
     {
      "f": "g2-image16.webp",
      "iw": 240,
      "ih": 428,
      "x": -6.7,
      "y": 51.3,
      "w": 14.3,
      "z": 6,
      "d": 2,
      "kind": "mod",
      "cut": "l"
     },
     {
      "f": "g2-image18.webp",
      "iw": 1410,
      "ih": 136,
      "x": 8.5,
      "y": 85.7,
      "w": 84,
      "z": 7,
      "d": 1.8,
      "kind": "mod"
     }
    ]
   },
   {
    "n": "03",
    "title": "Distribution, streaming & communauté Patreon",
    "text": "Le projet est distribué sur toutes les plateformes de streaming, cumulant plus de 150 000 écoutes sur Spotify. Une communauté de soutien a aussi été bâtie via Patreon, complétant un écosystème de marque autonome, de la création à la monétisation.",
    "stage": "#1f1f1f",
    "layers": [
     {
      "f": "g-bg.webp",
      "iw": 1678,
      "ih": 2160,
      "x": 0,
      "y": 0,
      "w": 100,
      "z": 0,
      "d": 0.15,
      "kind": "bg"
     },
     {
      "f": "g3-image21.webp",
      "iw": 762,
      "ih": 1632,
      "x": 10.8,
      "y": 5.6,
      "w": 45.4,
      "z": 2,
      "d": 0.5,
      "kind": "mod",
      "alt": "Distribution, streaming & communauté Patreon : aperçu de l’interface"
     },
     {
      "f": "g3-image20a.webp",
      "iw": 1494,
      "ih": 1078,
      "x": 5.5,
      "y": 50.1,
      "w": 89,
      "z": 3,
      "d": 0.5,
      "kind": "mod",
      "cut": "b",
      "alt": "Distribution, streaming & communauté Patreon : aperçu de l’interface"
     },
     {
      "f": "g3-image20b.webp",
      "iw": 470,
      "ih": 842,
      "x": 61.9,
      "y": 39.4,
      "w": 28,
      "z": 4,
      "d": 1.6,
      "kind": "mod",
      "alt": "Distribution, streaming & communauté Patreon : aperçu de l’interface"
     },
     {
      "f": "g3-image19.webp",
      "iw": 700,
      "ih": 400,
      "x": 50.1,
      "y": 4.1,
      "w": 41.7,
      "z": 5,
      "d": 1.7,
      "kind": "mod"
     },
     {
      "f": "g3-image22.webp",
      "iw": 498,
      "ih": 228,
      "x": 65.8,
      "y": 26,
      "w": 29.7,
      "z": 6,
      "d": 1.9,
      "kind": "mod"
     }
    ]
   }
  ]
 },
 "air-transat-ria": {
  "base": "cases/air/",
  "meta": {
   "role": "Senior UI/UX Web Designer & Directeur artistique",
   "agency": "Globalia",
   "scope": "Chatbot IA (Ria) · Refonte web · Landing pages dynamiques · Courriels personnalisés",
   "tools": "Figma"
  },
  "hero": {
   "f": "hero.webp",
   "iw": 2340,
   "ih": 1492,
   "alt": "Page d’accueil — Air Transat / Ria",
   "x": 10.3,
   "y": 6.2,
   "w": 79.5
  },
  "intro": {
   "lead": "Projet de démonstration/pitch d'innovation développé pour Air Transat. L'objectif était de réinventer l'engagement des voyageurs grâce à Ria, une agente conversationnelle IA intégrée directement au site, capable de déclencher des parcours d'exploration et des campagnes marketing automatisées hyper-personnalisées.",
   "photo": {
    "f": "intro.webp",
    "iw": 1678,
    "ih": 2160,
    "alt": "Vue aérienne d’une côte tropicale"
   },
   "chips": [
    {
     "n": "01",
     "text": "Redessiner l'en-tête et l'expérience de recherche (Ria)",
     "x": 8,
     "y": 28.1,
     "w": 43.3,
     "h": 15
    },
    {
     "n": "02",
     "text": "Générer des landing pages dynamiques par destination",
     "x": 44.9,
     "y": 53.3,
     "w": 46.1,
     "h": 15
    },
    {
     "n": "03",
     "text": "Boucler la boucle Inbound via des infolettres personnalisées",
     "x": -7.5,
     "y": 76.7,
     "w": 50.4,
     "h": 15
    }
   ]
  },
  "slides": [
   {
    "n": "01",
    "title": "IA inbound & recherche conversationnelle (Ria)",
    "text": "Intégration de l'agente Ria dans l'en-tête principal et création d'une interface de dialogue plein écran immersive. Le chatbot analyse les préférences, suggère des destinations (Colombie, Cuba, Italie) et propose des guides culinaires ou culturels.",
    "stage": "#172b54",
    "bleed": true,
    "layers": [
     {
      "f": "g1-booking.webp",
      "iw": 753,
      "ih": 376,
      "x": 5.2,
      "y": 57.8,
      "w": 89.7,
      "z": 1,
      "d": 0.6,
      "kind": "mod",
      "alt": "IA inbound & recherche conversationnelle (Ria) : aperçu de l’interface"
     },
     {
      "f": "g1-home.webp",
      "iw": 753,
      "ih": 376,
      "x": 5.2,
      "y": 9.5,
      "w": 89.7,
      "z": 2,
      "d": 0.6,
      "kind": "mod",
      "alt": "IA inbound & recherche conversationnelle (Ria) : aperçu de l’interface"
     },
     {
      "f": "g1-hotel.webp",
      "iw": 225,
      "ih": 80,
      "x": 72.1,
      "y": 16,
      "w": 26.8,
      "z": 3,
      "d": 2,
      "kind": "mod"
     },
     {
      "f": "g1-menu.webp",
      "iw": 147,
      "ih": 296,
      "x": -7.2,
      "y": 27.1,
      "w": 17.5,
      "z": 4,
      "d": 1.9,
      "kind": "mod",
      "cut": "l"
     },
     {
      "f": "g1-frame69.webp",
      "iw": 181,
      "ih": 217,
      "x": 49,
      "y": 47.6,
      "w": 21.6,
      "z": 5,
      "d": 1.9,
      "kind": "mod"
     },
     {
      "f": "clouds.webp",
      "iw": 1600,
      "ih": 553,
      "x": -30.5,
      "y": -6,
      "w": 58,
      "z": 6,
      "d": 1.7,
      "kind": "shape",
      "alt": "IA inbound & recherche conversationnelle (Ria) : aperçu de l’interface"
     }
    ]
   },
   {
    "n": "02",
    "title": "Landing pages par destination hyper-personnalisées",
    "text": "Conception de gabarits de pages d'atterrissage riches (ex. : Jamaïque) générées en fonction des intérêts décelés par l'IA. Structuration des blocs : forfaits, activités, avantages membres et articles de blogue d'expérience.",
    "stage": "#172b54",
    "layers": [
     {
      "f": "clouds.webp",
      "iw": 1600,
      "ih": 553,
      "x": -3.2,
      "y": 23.1,
      "w": 128.6,
      "z": 1,
      "d": 0.5,
      "kind": "shape",
      "alt": "Landing pages par destination hyper-personnalisées : aperçu de l’interface"
     },
     {
      "f": "g2-landing-air.webp",
      "iw": 1276,
      "ih": 2034,
      "x": 12,
      "y": 5.8,
      "w": 76,
      "z": 2,
      "d": 0.5,
      "kind": "mod",
      "cut": "b",
      "alt": "Landing pages par destination hyper-personnalisées : aperçu de l’interface"
     },
     {
      "f": "g2-chat-a.webp",
      "iw": 418,
      "ih": 194,
      "x": 72.7,
      "y": 66.3,
      "w": 24.9,
      "z": 3,
      "d": 2,
      "kind": "mod",
      "alt": "Landing pages par destination hyper-personnalisées : aperçu de l’interface"
     },
     {
      "f": "g2-chat-b.webp",
      "iw": 518,
      "ih": 122,
      "x": -4.6,
      "y": 36.7,
      "w": 30.9,
      "z": 4,
      "d": 2,
      "kind": "mod",
      "cut": "l"
     }
    ]
   },
   {
    "n": "03",
    "title": "Retargeting automatisé & infolettres personnalisées",
    "text": "Déploiement des gabarits de courriels transactionnels/Inbound déclenchés après la consultation d'une destination. L'infolettre inclut des offres exclusives ciblées, des rabais en points fidélité et les forfaits réservables en un clic.",
    "stage": "#172b54",
    "layers": [
     {
      "f": "clouds.webp",
      "iw": 1600,
      "ih": 553,
      "x": 1.8,
      "y": 38.6,
      "w": 128.6,
      "z": 1,
      "d": 0.5,
      "kind": "shape",
      "alt": "Retargeting automatisé & infolettres personnalisées : aperçu de l’interface"
     },
     {
      "f": "g3-image45.webp",
      "iw": 904,
      "ih": 1746,
      "x": 23.1,
      "y": 9.5,
      "w": 53.9,
      "z": 2,
      "d": 0.5,
      "kind": "mod",
      "alt": "Retargeting automatisé & infolettres personnalisées : aperçu de l’interface"
     },
     {
      "f": "g3-frame84.webp",
      "iw": 328,
      "ih": 107,
      "x": -3.7,
      "y": 30.7,
      "w": 39.1,
      "z": 3,
      "d": 1.9,
      "kind": "shape",
      "alt": "Retargeting automatisé & infolettres personnalisées : aperçu de l’interface"
     },
     {
      "f": "g3-frame85.webp",
      "iw": 328,
      "ih": 107,
      "x": 58.4,
      "y": 4.5,
      "w": 39.1,
      "z": 4,
      "d": 1.9,
      "kind": "shape"
     },
     {
      "f": "g3-frame86.webp",
      "iw": 328,
      "ih": 107,
      "x": 9.4,
      "y": 84.5,
      "w": 39.1,
      "z": 5,
      "d": 1.9,
      "kind": "shape"
     }
    ]
   }
  ]
 },
 "bijouterie-lavigueur": {
  "base": "cases/lav/",
  "meta": {
   "role": "Senior UI/UX Web Designer",
   "agency": "Globalia",
   "scope": "Direction artistique · Design UI · E‑commerce Magento",
   "tools": "Figma"
  },
  "hero": {
   "f": "hero.webp",
   "iw": 2360,
   "ih": 1526,
   "alt": "Page d’accueil — Bijouterie Lavigueur",
   "x": 9.7,
   "y": 4.5,
   "w": 80.2
  },
  "intro": {
   "lead": "Collaboration étroite avec l'équipe e-commerce pour moderniser la plateforme Magento de la Bijouterie Lavigueur. L'objectif était d'aligner l'expérience numérique avec le prestige de leurs collections de haute joaillerie.",
   "photo": {
    "f": "intro.webp",
    "iw": 1678,
    "ih": 2160,
    "alt": "Une bague en diamants posée sur une roche noire"
   },
   "chips": [
    {
     "n": "01",
     "text": "Rehausser l'image de marque",
     "x": 40.5,
     "y": 10.4,
     "w": 42.7,
     "h": 13.1
    },
    {
     "n": "02",
     "text": "Refondre l'expérience catalogue",
     "x": 7,
     "y": 58.5,
     "w": 47.9,
     "h": 13.1
    },
    {
     "n": "03",
     "text": "Unifier le tunnel d'achat",
     "x": 36.4,
     "y": 80.9,
     "w": 50.9,
     "h": 13.1
    }
   ]
  },
  "slides": [
   {
    "n": "01",
    "title": "Direction artistique & vision luxe",
    "text": "Élaboration d'un moodboard stratégique pour convaincre l'équipe de faire évoluer la marque. Adoption d'une palette aux tons bleu nuit et de jeux de contrastes forts pour faire ressortir l'éclat des diamants, soutenue par une typographie éditoriale élégante.",
    "stage": "#ffffff",
    "layers": [
     {
      "f": "g1-panel.webp",
      "iw": 1678,
      "ih": 2160,
      "x": 0,
      "y": 0,
      "w": 100,
      "z": 0,
      "d": 0.15,
      "kind": "bg"
     }
    ]
   },
   {
    "n": "02",
    "title": "L'expérience catalogue",
    "text": "Modernisation complète de l’interface de la boutique. Le design des grilles de produits et des fiches détaillées a été épuré pour laisser toute la place au visuel, créant une expérience de lèche-vitrine numérique immersive.",
    "stage": "#011432",
    "layers": [
     {
      "f": "g2-product.webp",
      "iw": 522,
      "ih": 1004,
      "x": 18.7,
      "y": 7,
      "w": 62.2,
      "z": 1,
      "d": 0.5,
      "kind": "mod",
      "cut": "b",
      "alt": "L'expérience catalogue : aperçu de l’interface"
     },
     {
      "f": "g2-phone.webp",
      "iw": 1224,
      "ih": 2104,
      "x": 13.3,
      "y": 2.6,
      "w": 72.9,
      "z": 2,
      "d": 0.5,
      "kind": "shape",
      "alt": "L'expérience catalogue : aperçu de l’interface"
     }
    ]
   },
   {
    "n": "03",
    "title": "Habillage du tunnel standardisé",
    "text": "Déclinaison minutieuse de la nouvelle identité visuelle sur le parcours transactionnel standard de l'équipe de développement. Le défi : conserver l'ergonomie technique éprouvée du socle Magento tout en y appliquant les codes visuels du luxe.",
    "stage": "#011432",
    "layers": [
     {
      "f": "g3-summary.webp",
      "iw": 652,
      "ih": 991,
      "x": 13,
      "y": 8.2,
      "w": 77.7,
      "z": 1,
      "d": 0.5,
      "kind": "mod",
      "cut": "b",
      "alt": "Habillage du tunnel standardisé : aperçu de l’interface"
     }
    ]
   }
  ]
 },
 "staking-data": {
  "base": "cases/staking/",
  "meta": {
   "role": "Senior UI/UX Web Designer",
   "agency": "Globalia",
   "scope": "Stratégie UX · Architecture de l'information · Design UI responsive",
   "tools": "Figma"
  },
  "hero": {
   "f": "hero.webp",
   "iw": 2400,
   "ih": 1470,
   "alt": "Page d’accueil — Staking Data / View",
   "x": 8.2,
   "y": 5.2,
   "w": 83.6
  },
  "intro": {
   "lead": "Staking Data est un concept issu du processus d'incubation R&D interne de Globalia, visant à concevoir une plateforme SaaS unifiée de staking de crypto-actifs. Le mandat visait à structurer la gestion de portefeuilles multiples, la visualisation de données financières complexes et la simulation de rendements.",
   "photo": {
    "f": "intro.webp",
    "iw": 1678,
    "ih": 2160,
    "alt": "Abstraction fluide rose et violette"
   },
   "chips": [
    {
     "n": "01",
     "text": "Centraliser la gestion multi-portefeuilles",
     "x": -13.2,
     "y": 6.8,
     "w": 42.7,
     "h": 15
    },
    {
     "n": "02",
     "text": "Intégrer un calculateur de gains prévisionnels",
     "x": 45.6,
     "y": 48.7,
     "w": 48.4,
     "h": 13.1
    },
    {
     "n": "03",
     "text": "Simplifier le suivi des validateurs & alertes",
     "x": 15.9,
     "y": 85.7,
     "w": 48,
     "h": 13.1
    }
   ]
  },
  "slides": [
   {
    "n": "01",
    "title": "Gestion de portefeuilles unifiée",
    "text": "Un tableau de bord centralisé pour suivre en temps réel les soldes, l’évolution des rendements et basculer instantanément entre plusieurs portefeuilles.",
    "stage": "#08193a",
    "layers": [
     {
      "f": "g1-f4347.webp",
      "iw": 244,
      "ih": 86,
      "x": 6,
      "y": 7.1,
      "w": 29.1,
      "z": 1,
      "d": 2,
      "kind": "shape",
      "alt": "Gestion de portefeuilles unifiée : aperçu de l’interface"
     },
     {
      "f": "g1-f4414.webp",
      "iw": 793,
      "ih": 741,
      "x": 5.5,
      "y": 20.7,
      "w": 94.5,
      "z": 2,
      "d": 0.5,
      "kind": "shape",
      "alt": "Gestion de portefeuilles unifiée : aperçu de l’interface"
     },
     {
      "f": "g1-f4383.webp",
      "iw": 227,
      "ih": 45,
      "x": 68.9,
      "y": 9.9,
      "w": 26.9,
      "z": 3,
      "d": 2,
      "kind": "shape"
     },
     {
      "f": "g1-popup.webp",
      "iw": 436,
      "ih": 461,
      "x": 28.1,
      "y": 29.7,
      "w": 52,
      "z": 4,
      "d": 1,
      "kind": "mod",
      "alt": "Gestion de portefeuilles unifiée : aperçu de l’interface"
     }
    ]
   },
   {
    "n": "02",
    "title": "Calculateur de gains intelligent",
    "text": "Un outil interactif permettant de simuler précisément les retours sur investissement selon l'actif choisi et la durée de staking.",
    "stage": "#08193a",
    "layers": [
     {
      "f": "g2-f4439.webp",
      "iw": 839,
      "ih": 1080,
      "x": 0,
      "y": 0,
      "w": 100,
      "z": 0,
      "d": 0.15,
      "kind": "bg"
     },
     {
      "f": "g2-calculator.webp",
      "iw": 1274,
      "ih": 824,
      "x": 12.8,
      "y": 30.5,
      "w": 75.9,
      "z": 2,
      "d": 0.7,
      "kind": "mod",
      "alt": "Calculateur de gains intelligent : aperçu de l’interface"
     },
     {
      "f": "g2-macbook.webp",
      "iw": 1536,
      "ih": 960,
      "x": 4.9,
      "y": 27.8,
      "w": 91.5,
      "z": 3,
      "d": 0.5,
      "kind": "shape",
      "alt": "Calculateur de gains intelligent : aperçu de l’interface"
     }
    ]
   },
   {
    "n": "03",
    "title": "Suivi des validateurs et alertes",
    "text": "Une vue détaillée pour comparer les validateurs selon leur rendement (APY) et leur commission, et configurer des alertes personnalisées en un clin d’œil.",
    "stage": "#08193a",
    "layers": [
     {
      "f": "g3-alertes.webp",
      "iw": 487,
      "ih": 994,
      "x": 20.5,
      "y": 8,
      "w": 58,
      "z": 1,
      "d": 0.5,
      "kind": "mod",
      "cut": "b",
      "alt": "Suivi des validateurs et alertes : aperçu de l’interface"
     },
     {
      "f": "g3-phone.webp",
      "iw": 1224,
      "ih": 2104,
      "x": 13.3,
      "y": 2.6,
      "w": 72.9,
      "z": 2,
      "d": 0.5,
      "kind": "shape",
      "alt": "Suivi des validateurs et alertes : aperçu de l’interface"
     }
    ]
   }
  ]
 },
 "globalia-brand": {
  "base": "cases/globalia/",
  "meta": {
   "role": "Directeur artistique & Senior UI/UX Web Designer",
   "agency": "Globalia",
   "scope": "Image de marque · Site corporatif · Communications internes · Événements",
   "tools": "Figma"
  },
  "hero": {
   "f": "hero.webp",
   "iw": 2333,
   "ih": 1502,
   "alt": "Page d’accueil — Globalia Brand Identity",
   "x": 10.6,
   "y": 6.3,
   "w": 79.2
  },
  "intro": {
   "lead": "Mandat continu de direction artistique interne chez Globalia. Le projet visait à harmoniser l'écosystème de marque à tous les points de contact : site web, présentations de vente, gabarits LinkedIn, documents RH et événements d'équipe (microsite du lac à l'épaule, marchandise).",
   "photo": {
    "f": "intro.webp",
    "iw": 1678,
    "ih": 2160,
    "alt": "Deux collègues autour d’un ordinateur portable, souriantes"
   },
   "chips": [
    {
     "n": "01",
     "text": "Refondre le site web corporatif & les études de cas",
     "x": -11.6,
     "y": 11.9,
     "w": 44.1,
     "h": 15
    },
    {
     "n": "02",
     "text": "Déployer un écosystème de communication cohérent",
     "x": 37.1,
     "y": 54.6,
     "w": 53,
     "h": 13.1
    },
    {
     "n": "03",
     "text": "Concevoir des expériences de marque et culturelles",
     "x": 18.5,
     "y": 83.8,
     "w": 52.8,
     "h": 13.1
    }
   ]
  },
  "slides": [
   {
    "n": "01",
    "title": "Refonte intégrale du site corporatif & études de cas",
    "text": "Conception et déploiement de la refonte complète du site web de Globalia (UX/UI et direction artistique) pour aligner la plateforme sur le positionnement de l'agence. Création de gabarits immersifs dédiés aux études de cas majeures.",
    "stage": "radial-gradient(90% 60% at 80% 0%, rgba(0, 255, 255, 0.28) 0%, rgba(11, 40, 72, 0) 75%), #0b2848",
    "layers": [
     {
      "f": "g1-starfrit.webp",
      "iw": 246,
      "ih": 1742,
      "x": 75.8,
      "y": 10.4,
      "w": 14.7,
      "z": 1,
      "d": 1.5,
      "kind": "mod",
      "alt": "Refonte intégrale du site corporatif & études de cas : aperçu de l’interface"
     },
     {
      "f": "g1-group2608687.webp",
      "iw": 105,
      "ih": 144,
      "x": 36.4,
      "y": 8.2,
      "w": 12.5,
      "z": 2,
      "d": 2,
      "kind": "mod"
     },
     {
      "f": "g1-campingqc.webp",
      "iw": 246,
      "ih": 1822,
      "x": 13.2,
      "y": 3.7,
      "w": 14.7,
      "z": 3,
      "d": 1.5,
      "kind": "mod",
      "alt": "Refonte intégrale du site corporatif & études de cas : aperçu de l’interface"
     },
     {
      "f": "g1-desktop.webp",
      "iw": 583,
      "ih": 923,
      "x": 17.6,
      "y": 14.5,
      "w": 69.4,
      "z": 4,
      "d": 0.5,
      "kind": "shape",
      "alt": "Refonte intégrale du site corporatif & études de cas : aperçu de l’interface"
     },
     {
      "f": "g1-frame222.webp",
      "iw": 90,
      "ih": 105,
      "x": 3.8,
      "y": 27.6,
      "w": 10.7,
      "z": 5,
      "d": 2.1,
      "kind": "mod"
     },
     {
      "f": "g1-component295.webp",
      "iw": 93,
      "ih": 128,
      "x": 5.5,
      "y": 83.5,
      "w": 11.1,
      "z": 6,
      "d": 2,
      "kind": "mod"
     },
     {
      "f": "g1-group2609935.webp",
      "iw": 173,
      "ih": 74,
      "x": 57.8,
      "y": 6.3,
      "w": 20.5,
      "z": 7,
      "d": 2,
      "kind": "mod"
     },
     {
      "f": "g1-sorting.webp",
      "iw": 291,
      "ih": 13,
      "x": 36.4,
      "y": 2.9,
      "w": 34.7,
      "z": 8,
      "d": 2.1,
      "kind": "shape"
     }
    ]
   },
   {
    "n": "02",
    "title": "Écosystème réseaux sociaux, documents RH & outils de vente",
    "text": "Déploiement d'une charte graphique omnicanale : habillage des réseaux sociaux d'agence, design des publications et infolettres Inbound. Conception de la documentation interne et commerciale, incluant le manuel de l'employé, les présentations de vente (Google Slides) et les supports corporatifs.",
    "stage": "radial-gradient(90% 60% at 80% 0%, rgba(0, 255, 255, 0.28) 0%, rgba(11, 40, 72, 0) 75%), #0b2848",
    "layers": [
     {
      "f": "g2-infolettre.webp",
      "iw": 279,
      "ih": 605,
      "x": 4.3,
      "y": 27.2,
      "w": 33.3,
      "z": 1,
      "d": 1.2,
      "kind": "mod",
      "alt": "Écosystème réseaux sociaux, documents RH & outils de vente : aperçu de l’interface"
     },
     {
      "f": "g2-c2.webp",
      "iw": 210,
      "ih": 219,
      "x": 75,
      "y": 3.4,
      "w": 25,
      "z": 2,
      "d": 1.9,
      "kind": "mod",
      "cut": "r"
     },
     {
      "f": "g2-c8.webp",
      "iw": 238,
      "ih": 238,
      "x": 63.3,
      "y": 35.1,
      "w": 28.4,
      "z": 3,
      "d": 1.8,
      "kind": "mod"
     },
     {
      "f": "g2-c28.webp",
      "iw": 211,
      "ih": 211,
      "x": 30.4,
      "y": 41.7,
      "w": 25.1,
      "z": 4,
      "d": 1.9,
      "kind": "shape"
     },
     {
      "f": "g2-c1.webp",
      "iw": 126,
      "ih": 126,
      "x": -3,
      "y": 5.9,
      "w": 15,
      "z": 5,
      "d": 2,
      "kind": "mod",
      "cut": "l"
     },
     {
      "f": "g2-c2b.webp",
      "iw": 143,
      "ih": 143,
      "x": 5.5,
      "y": 6.1,
      "w": 17,
      "z": 6,
      "d": 2,
      "kind": "shape"
     },
     {
      "f": "g2-c3.webp",
      "iw": 143,
      "ih": 143,
      "x": 15.9,
      "y": 7,
      "w": 17,
      "z": 7,
      "d": 2,
      "kind": "shape"
     },
     {
      "f": "g2-k12.webp",
      "iw": 393,
      "ih": 408,
      "x": 48.7,
      "y": 62.3,
      "w": 46.7,
      "z": 8,
      "d": 1.3,
      "kind": "shape",
      "alt": "Écosystème réseaux sociaux, documents RH & outils de vente : aperçu de l’interface"
     },
     {
      "f": "g2-cover.webp",
      "iw": 249,
      "ih": 322,
      "x": 40.9,
      "y": 6.7,
      "w": 29.7,
      "z": 9,
      "d": 1.7,
      "kind": "mod",
      "alt": "Écosystème réseaux sociaux, documents RH & outils de vente : aperçu de l’interface"
     },
     {
      "f": "g2-group2609942.webp",
      "iw": 392,
      "ih": 136,
      "x": -4.6,
      "y": 85.5,
      "w": 46.6,
      "z": 10,
      "d": 1.8,
      "kind": "shape"
     }
    ]
   },
   {
    "n": "03",
    "title": "Microsite événementiel, site carrière & swag",
    "text": "Design d'expériences de marque immersives pour la culture d'entreprise : conception du microsite annuel du lac à l'épaule, gabarits du site carrière et développement d'une ligne de vêtements et d'accessoires corporatifs modernes.",
    "stage": "radial-gradient(90% 60% at 80% 0%, rgba(0, 255, 255, 0.28) 0%, rgba(11, 40, 72, 0) 75%), #0b2848",
    "layers": [
     {
      "f": "g3-accueil.webp",
      "iw": 568,
      "ih": 672,
      "x": 8.7,
      "y": 31.8,
      "w": 67.7,
      "z": 1,
      "d": 0.5,
      "kind": "shape",
      "alt": "Microsite événementiel, site carrière & swag : aperçu de l’interface"
     },
     {
      "f": "g3-2025.webp",
      "iw": 346,
      "ih": 1960,
      "x": 75.2,
      "y": 6.2,
      "w": 20.6,
      "z": 2,
      "d": 1.2,
      "kind": "mod",
      "alt": "Microsite événementiel, site carrière & swag : aperçu de l’interface"
     },
     {
      "f": "g3-image83.webp",
      "iw": 264,
      "ih": 334,
      "x": 53,
      "y": 9.1,
      "w": 15.7,
      "z": 3,
      "d": 2,
      "kind": "mod"
     },
     {
      "f": "g3-f2609936.webp",
      "iw": 365,
      "ih": 226,
      "x": -6.2,
      "y": 79.5,
      "w": 21.7,
      "z": 4,
      "d": 2,
      "kind": "mod",
      "cut": "l"
     },
     {
      "f": "g3-group2609936.webp",
      "iw": 241,
      "ih": 32,
      "x": 18.2,
      "y": 26.5,
      "w": 28.7,
      "z": 5,
      "d": 2.1,
      "kind": "shape"
     },
     {
      "f": "g3-f2608682.webp",
      "iw": 208,
      "ih": 62,
      "x": -3.9,
      "y": 56.6,
      "w": 24.8,
      "z": 6,
      "d": 2,
      "kind": "shape"
     },
     {
      "f": "g3-group2608634.webp",
      "iw": 156,
      "ih": 205,
      "x": -4.5,
      "y": 7.2,
      "w": 18.6,
      "z": 7,
      "d": 1.9,
      "kind": "mod",
      "cut": "l"
     },
     {
      "f": "g3-untitled1.webp",
      "iw": 228,
      "ih": 328,
      "x": 43.6,
      "y": 1.3,
      "w": 13.6,
      "z": 8,
      "d": 2,
      "kind": "mod"
     },
     {
      "f": "g3-group2608654.webp",
      "iw": 173,
      "ih": 248,
      "x": 18.7,
      "y": 0,
      "w": 20.5,
      "z": 9,
      "d": 1.9,
      "kind": "mod",
      "cut": "t",
      "alt": "Microsite événementiel, site carrière & swag : aperçu de l’interface"
     }
    ]
   }
  ]
 },
 "intelli-jeunes": {
  "base": "cases/intelli/",
  "meta": {
   "role": "Senior UI/UX Web Designer & Directeur artistique IA",
   "agency": "Globalia",
   "scope": "Direction artistique · Mascottes IA · Design UI/UX responsive",
   "tools": "Figma · Midjourney"
  },
  "hero": {
   "f": "hero.webp",
   "iw": 2362,
   "ih": 1482,
   "alt": "Page d’accueil — Intelli Jeunes",
   "x": 10.1,
   "y": 6.2,
   "w": 80.2
  },
  "intro": {
   "lead": "Développé chez Globalia en collaboration avec le directeur IA, Intelli Jeunes est un concept de plateforme ludo-éducative propulsée par l'intelligence artificielle. Le mandat visait à créer la direction artistique de zéro, générer l'univers visuel par IA et concevoir l'ensemble de la plateforme web éducative.",
   "photo": {
    "f": "intro.webp",
    "iw": 1678,
    "ih": 2160,
    "alt": "Une mascotte monstre 3D violette et bleue, aux grandes cornes"
   },
   "chips": [
    {
     "n": "01",
     "text": "Incarner la marque via Midjourney",
     "x": -11.3,
     "y": 7.2,
     "w": 42.7,
     "h": 13.1
    },
    {
     "n": "02",
     "text": "Articuler les modules ludo-éducatifs",
     "x": 31.3,
     "y": 63.1,
     "w": 48.4,
     "h": 13.1
    },
    {
     "n": "03",
     "text": "Décliner l'écosystème web complet",
     "x": -5,
     "y": 85,
     "w": 48,
     "h": 13.1
    }
   ]
  },
  "slides": [
   {
    "n": "01",
    "title": "Mascottes 3D & prompt engineering via Midjourney",
    "text": "Création et génération complète d'une banque de mascottes monstres 3D grâce à un travail rigoureux de prompt engineering sur Midjourney. Ce workflow d'IA générative donne une identité forte au projet tout en accélérant la production graphique.",
    "stage": "#600278",
    "layers": [
     {
      "f": "g1-stage.webp",
      "iw": 1678,
      "ih": 2160,
      "x": 0,
      "y": 0,
      "w": 100,
      "z": 0,
      "d": 0.15,
      "kind": "bg"
     }
    ]
   },
   {
    "n": "02",
    "title": "Modules ludiques & outils enseignants",
    "text": "Structuration des sections de présentation des fonctionnalités clés (gestion de classe, suivi des progrès, personnalisation). La mise en page combine un storytelling dynamique et des visuels attrayants pour engager le milieu scolaire.",
    "stage": "#600278",
    "layers": [
     {
      "f": "g2-group237688.webp",
      "iw": 533,
      "ih": 430,
      "x": 18.5,
      "y": 2,
      "w": 63.4,
      "z": 1,
      "d": 0.9,
      "kind": "shape",
      "alt": "Modules ludiques & outils enseignants : aperçu de l’interface"
     },
     {
      "f": "g2-group237687.webp",
      "iw": 622,
      "ih": 278,
      "x": 13.6,
      "y": 73.4,
      "w": 74,
      "z": 2,
      "d": 1.2,
      "kind": "shape",
      "alt": "Modules ludiques & outils enseignants : aperçu de l’interface"
     },
     {
      "f": "g2-group237686.webp",
      "iw": 661,
      "ih": 243,
      "x": 12.5,
      "y": 43.5,
      "w": 78.8,
      "z": 3,
      "d": 1.2,
      "kind": "shape",
      "alt": "Modules ludiques & outils enseignants : aperçu de l’interface"
     }
    ]
   },
   {
    "n": "03",
    "title": "Écosystème web & parcours d’accès",
    "text": "Déclinaison complète du système de pages (Accueil, À propos, Contact, Connexion). La cohérence des couleurs vives, des typographies et des composants UI garantit une expérience utilisateur harmonieuse du premier point de contact jusqu'à la connexion.",
    "stage": "#600278",
    "layers": [
     {
      "f": "g3-listing.webp",
      "iw": 610,
      "ih": 430,
      "x": 13.7,
      "y": 10.3,
      "w": 72.7,
      "z": 1,
      "d": 0.7,
      "kind": "mod",
      "alt": "Écosystème web & parcours d’accès : aperçu de l’interface"
     },
     {
      "f": "g3-home.webp",
      "iw": 753,
      "ih": 539,
      "x": 4.9,
      "y": 50.1,
      "w": 89.7,
      "z": 2,
      "d": 0.5,
      "kind": "mod",
      "cut": "b",
      "alt": "Écosystème web & parcours d’accès : aperçu de l’interface"
     }
    ]
   }
  ]
 },
 "maia": {
  "base": "cases/maia/",
  "meta": {
   "role": "Senior UI/UX Web Designer",
   "agency": "Globalia",
   "scope": "Identité visuelle · Architecture de l'information · Design web",
   "tools": "Figma"
  },
  "hero": {
   "f": "hero.webp",
   "iw": 2384,
   "ih": 1534,
   "alt": "Page d’accueil — Maïa",
   "x": 9.7,
   "y": 4.5,
   "w": 81
  },
  "intro": {
   "lead": "Soutenu par des fonds gouvernementaux, Maïa est un projet ambitieux visant à démocratiser l'accès aux opportunités d'affaires pour les femmes entrepreneures. Le projet a été divisé en deux phases stratégiques : une V1 axée sur l'acquisition (HubSpot) et une V2 future intégrant le système d'appels d'offres B2B.",
   "photo": {
    "f": "intro.webp",
    "iw": 1678,
    "ih": 2160,
    "alt": "Une femme aux cheveux courts qui travaille sur son ordinateur portable"
   },
   "chips": [
    {
     "n": "01",
     "text": "Incarner l'écosystème féminin B2B",
     "x": 5,
     "y": 16.1,
     "w": 46.1,
     "h": 13.1
    },
    {
     "n": "02",
     "text": "Structurer le double parcours d'acquisition",
     "x": -10.4,
     "y": 44.8,
     "w": 50.5,
     "h": 13.1
    },
    {
     "n": "03",
     "text": "Garantir une expérience mobile fluide",
     "x": 25.3,
     "y": 65.2,
     "w": 50.9,
     "h": 13.1
    }
   ]
  },
  "slides": [
   {
    "n": "01",
    "title": "Concevoir une identité forte",
    "text": "Livraison d'un guide de normes graphiques exhaustif. Création d'une identité visuelle complète (logo, typographie, palette de couleurs) pour asseoir immédiatement la crédibilité institutionnelle de Maïa sur le marché.",
    "stage": "#011d20",
    "layers": [
     {
      "f": "g1-stage.webp",
      "iw": 1678,
      "ih": 2160,
      "x": 0,
      "y": 0,
      "w": 100,
      "z": 0,
      "d": 0.15,
      "kind": "bg"
     },
     {
      "f": "g1-group181.webp",
      "iw": 613,
      "ih": 202,
      "x": 12.9,
      "y": 37.8,
      "w": 72.9,
      "z": 2,
      "d": 1.4,
      "kind": "shape",
      "alt": "Concevoir une identité forte : aperçu de l’interface"
     },
     {
      "f": "g1-typo.webp",
      "iw": 316,
      "ih": 280,
      "x": 10.3,
      "y": 4.3,
      "w": 37.5,
      "z": 3,
      "d": 1.6,
      "kind": "shape",
      "alt": "Concevoir une identité forte : aperçu de l’interface"
     },
     {
      "f": "g1-f4437.webp",
      "iw": 215,
      "ih": 232,
      "x": 11.9,
      "y": 71.2,
      "w": 25.6,
      "z": 4,
      "d": 1.8,
      "kind": "shape",
      "alt": "Concevoir une identité forte : aperçu de l’interface"
     }
    ]
   },
   {
    "n": "02",
    "title": "Parcours d'acquisition",
    "text": "Conception d'une architecture web optimisée pour générer des leads, structurée autour de deux parcours utilisateurs distincts : l'acquisition de grandes corporations (Acheteurs) et l'intégration d'entreprises féminines (Fournisseurs).",
    "stage": "#011d20",
    "layers": [
     {
      "f": "g2-group2608727.webp",
      "iw": 512,
      "ih": 485,
      "x": 32.8,
      "y": 34.4,
      "w": 61,
      "z": 1,
      "d": 0.8,
      "kind": "shape",
      "alt": "Parcours d'acquisition : aperçu de l’interface"
     },
     {
      "f": "g2-f4434.webp",
      "iw": 636,
      "ih": 406,
      "x": 12.6,
      "y": 29.6,
      "w": 75.7,
      "z": 2,
      "d": 0.7,
      "kind": "shape",
      "alt": "Parcours d'acquisition : aperçu de l’interface"
     },
     {
      "f": "g2-macbook.webp",
      "iw": 1536,
      "ih": 960,
      "x": 4.9,
      "y": 27.8,
      "w": 91.5,
      "z": 3,
      "d": 0.5,
      "kind": "shape",
      "alt": "Parcours d'acquisition : aperçu de l’interface"
     },
     {
      "f": "g2-union.webp",
      "iw": 79,
      "ih": 91,
      "x": 9.9,
      "y": 10.1,
      "w": 9.4,
      "z": 4,
      "d": 2.1,
      "kind": "shape"
     }
    ]
   },
   {
    "n": "03",
    "title": "Expérience mobile optimisée",
    "text": "Déclinaison rigoureuse des interfaces en version mobile (responsive design), garantissant une expérience utilisateur fluide et accessible sur tous les appareils pour maximiser l’acquisition.",
    "stage": "#011d20",
    "layers": [
     {
      "f": "g3-group2608729.webp",
      "iw": 839,
      "ih": 1080,
      "x": 0,
      "y": 0,
      "w": 100,
      "z": 0,
      "d": 0.15,
      "kind": "bg"
     },
     {
      "f": "g3-f4431.webp",
      "iw": 494,
      "ih": 937,
      "x": 22.8,
      "y": 13.2,
      "w": 58.9,
      "z": 2,
      "d": 0.5,
      "kind": "mod",
      "cut": "b",
      "alt": "Expérience mobile optimisée : aperçu de l’interface"
     }
    ]
   }
  ]
 }
}

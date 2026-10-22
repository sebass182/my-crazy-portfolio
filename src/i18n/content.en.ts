// The English version of every piece of copy that lives in the data files (projects, case studies, Holo MD, About).
// The pictures, mockups and screenshots are never touched: only the words around them change language.
// Camping Québec's texts are the ones from the English deck; the others are written to match their tone.

export type ProjectEn = { tags: string; summary: string; details: [string, string, string]; sceneAlt: string; meta?: { role: string; agency: string; scope: string; tools: string } }

export const projectsEn: Record<string, ProjectEn> = {
  'camping-quebec': {
    tags: 'Product anchoring, complex B2C/B2B UX',
    summary: 'Overhaul of the official tourism platform: a campsite search engine, favorites and a B2B portal for operators.',
    details: ['geolocated search and favorites system', 'owner area and membership management', 'inspirational content and camper tools'],
    sceneAlt: 'Camping Québec site: the full-frame home page and the campsite search screen',
  },
  'air-transat-ria': {
    tags: 'Brand awareness, Inbound AI',
    summary: 'Redesign of the booking experience and a conversational Inbound ecosystem: the Ria AI agent, dynamic landing pages and personalized retargeting.',
    details: ['Inbound AI and conversational search with Ria', 'hyper-personalized destination landing pages', 'automated retargeting and personalized newsletters'],
    sceneAlt: 'Air Transat site: the page “Be ready for your family trip to Jamaica” next to its mobile version',
  },
  essll: {
    tags: 'Creative autonomy, GenAI, growth & real numbers',
    summary: 'Art direction and growth of a music brand produced entirely with AI.',
    details: ['art direction and an AI-generated visual universe', 'multimedia production and video content', 'distribution, streaming and the Patreon community'],
    sceneAlt: 'ESSLLL: three visuals of the music brand lined up as a triptych',
  },
  'holo-md': {
    tags: 'Complex MedTech SaaS, HIPAA, clinical AI',
    summary: 'A HealthTech & AI platform for clinical psychiatry: branding, an investor showcase, a patient app and an RTM monitoring dashboard.',
    details: ['global branding, brandbook and investor showcase', 'patient app and remote therapeutic monitoring', 'psychiatrist dashboard and clinical decision support'],
    sceneAlt: 'Holo MD: the platform sign-in screen and the patient app’s “Welcome” screen',
    meta: {
      role: 'Lead Product Designer & Brand Strategist',
      agency: 'Globalia',
      scope: '360° branding · Funding micro-site · Patient app (LLM chatbot) · Clinical SaaS (RTM & billing)',
      tools: 'Figma',
    },
  },
  maia: {
    tags: 'B2B branding, acquisition platform',
    summary: 'Building from scratch the first brand identity and web platform to power women-led businesses in Canada.',
    details: ['brand identity and graphic standards guide', 'web acquisition journeys', 'optimized mobile experience'],
    sceneAlt: 'Maïa site: the home page on a laptop and the “Stay connected” block on a phone',
  },
  'bijouterie-lavigueur': {
    tags: 'Luxury e-commerce, premium art direction',
    summary: 'Elevating the e-commerce experience: art direction and shopping journey for a jeweller on Magento.',
    details: ['art direction and luxury vision', 'the catalogue experience', 'a standardized checkout, restyled'],
    sceneAlt: 'Bijouterie Lavigueur: the Alpina watch home page and the mobile product sheet',
  },
  'intelli-jeunes': {
    tags: 'Gamification, playful universe, 3D/AI',
    summary: 'An AI education portal and a catalogue of educational games: the complete web platform and a visual universe for elementary school.',
    details: ['3D mascots and prompt engineering with Midjourney', 'playful modules and teacher tools', 'web ecosystem and access journeys'],
    sceneAlt: 'Intelli Jeunes: the education portal home page with its mascot, next to the grid of mascots',
  },
  'staking-data': {
    tags: 'Data visualization, fintech dashboards',
    summary: 'Simplifying crypto staking and unifying portfolio management through a smooth, secure, data-driven experience.',
    details: ['unified portfolio management', 'smart earnings calculator', 'validator tracking and alerts'],
    sceneAlt: 'Staking Data: the assets dashboard and the mobile alerts screen',
  },
  'globalia-brand': {
    tags: 'Cap-stone: 360° agency art direction',
    summary: 'Global brand art direction: content strategy, digital presence, HR/Sales communications and corporate swag.',
    details: ['corporate site and case-study redesign', 'social media ecosystem, HR documents and sales tools', 'event microsite, careers site and swag'],
    sceneAlt: 'Globalia: the corporate site and two brand visuals of the ecosystem in a mosaic',
  },
}

export type CaseEn = {
  meta: { role: string; agency: string; scope: string; tools: string }
  heroAlt: string
  photoAlt: string
  lead: string
  chips: [string, string, string]
  slides: [{ title: string; text: string }, { title: string; text: string }, { title: string; text: string }]
}

export const casesEn: Record<string, CaseEn> = {
  'camping-quebec': {
    meta: { role: 'Senior UI/UX Web Designer', agency: 'Globalia', scope: 'B2C/B2B architecture · Geolocated search · Operator portal', tools: 'Figma' },
    heroAlt: 'Home page: Camping Québec',
    photoAlt: 'A lit orange tent under a starry sky, in the middle of the forest',
    lead: 'The goal was to restructure a two-sided ecosystem: a smooth B2C portal focused on discovering and searching for campsites, and a complete Operator Zone for managing memberships and campground listings.',
    chips: ['Optimize campsite search and discovery', 'Digitize the Operator Zone and B2B membership', 'Enrich decision-making content and the mobile experience'],
    slides: [
      { title: 'Geolocated search & favorites system', text: 'Designed an intuitive search interface to explore campsites by region, promotions or amenities. Added a My Favorite Destinations space and detailed campground listings to speed up decision-making.' },
      { title: 'Owner area & membership management', text: 'Designed the complex templates of the Operator Zone. The portal lets campground managers update their information, manage their annual membership and access industry data and resources.' },
      { title: 'Inspirational content & camper tools', text: 'Rolled out the exploration templates (Explore, Promotions, Camping Tools and Blog). The consistent forest-green palette and clean typography create a warm, professional brand universe.' },
    ],
  },
  essll: {
    meta: { role: 'Creator & Art Director', agency: 'Personal project', scope: 'AI music production · Visual identity · Video · Distribution', tools: 'Midjourney · Ideogram · Suno · ChatGPT · Claude Code · Figma' },
    heroAlt: 'Home page: ESSLLL',
    photoAlt: 'A cloaked figure on a cliff beaten by a storm',
    lead: 'A personal project born from the meeting of 15 years in a band, a background in photography and a career as a UI/UX designer. ESSLLL is a metalcore band conceived entirely with artificial intelligence: lyrics, music composition, imagery and brand identity. From art direction to distribution, every aspect of the project was thought out and executed solo.',
    chips: ['Brand identity & art direction', 'Video content production & multi-platform presence', 'Distribution & audience growth'],
    slides: [
      { title: 'Art direction & an AI-generated visual universe', text: 'Using Midjourney and Ideogram, I developed a distinct visual aesthetic for each release while keeping a recognizable brand signature across the whole catalogue, fed by more than 15 years of experience in photography and design.' },
      { title: 'Multimedia production & video content', text: 'Every song comes with a dedicated video and short formats made for social media and shared on every platform. This continuous production built a YouTube channel of 3,500 subscribers generating more than 360,000 views.' },
      { title: 'Distribution, streaming & the Patreon community', text: 'The project is distributed on all the streaming platforms, with more than 150,000 plays on Spotify. A community of supporters was also built through Patreon, completing a self-sufficient brand ecosystem, from creation to monetization.' },
    ],
  },
  'air-transat-ria': {
    meta: { role: 'Senior UI/UX Web Designer & Art Director', agency: 'Globalia', scope: 'AI chatbot (Ria) · Web redesign · Dynamic landing pages · Personalized emails', tools: 'Figma' },
    heroAlt: 'Home page: Air Transat / Ria',
    photoAlt: 'Aerial view of a tropical coast',
    lead: 'A demo / innovation pitch project developed for Air Transat. The goal was to reinvent traveller engagement through Ria, an AI conversational agent built right into the site, able to trigger exploration journeys and hyper-personalized automated marketing campaigns.',
    chips: ['Redesign the header and the search experience (Ria)', 'Generate dynamic landing pages for each destination', 'Close the Inbound loop with personalized newsletters'],
    slides: [
      { title: 'Inbound AI & conversational search (Ria)', text: 'Integration of the Ria agent into the main header and creation of an immersive full-screen dialogue interface. The chatbot analyses preferences, suggests destinations (Colombia, Cuba, Italy) and offers culinary or cultural guides.' },
      { title: 'Hyper-personalized destination landing pages', text: 'Design of rich landing page templates (e.g. Jamaica) generated from the interests the AI picks up. Structuring of the blocks: packages, activities, member benefits and experience blog posts.' },
      { title: 'Automated retargeting & personalized newsletters', text: 'Rollout of transactional / Inbound email templates triggered after a destination has been viewed. The newsletter includes targeted exclusive offers, loyalty-point discounts and packages bookable in one click.' },
    ],
  },
  'bijouterie-lavigueur': {
    meta: { role: 'Senior UI/UX Web Designer', agency: 'Globalia', scope: 'Art direction · UI design · Magento e‑commerce', tools: 'Figma' },
    heroAlt: 'Home page: Bijouterie Lavigueur',
    photoAlt: 'A diamond ring resting on a black rock',
    lead: 'Close collaboration with the e-commerce team to modernize the Magento platform of Bijouterie Lavigueur. The goal was to align the digital experience with the prestige of their high-jewellery collections.',
    chips: ['Elevate the brand image', 'Rework the catalogue experience', 'Unify the checkout'],
    slides: [
      { title: 'Art direction & luxury vision', text: 'A strategic moodboard to convince the team to let the brand evolve. A palette of midnight blues and strong contrasts brings out the sparkle of the diamonds, supported by elegant editorial typography.' },
      { title: 'The catalogue experience', text: 'A complete modernization of the shop interface. The product grids and detail pages were pared back to leave all the room to the visuals, creating an immersive digital window-shopping experience.' },
      { title: 'A standardized checkout, restyled', text: 'A careful rollout of the new visual identity across the development team’s standard transactional flow. The challenge: keep the proven technical ergonomics of the Magento base while applying the visual codes of luxury.' },
    ],
  },
  'staking-data': {
    meta: { role: 'Senior UI/UX Web Designer', agency: 'Globalia', scope: 'UX strategy · Information architecture · Responsive UI design', tools: 'Figma' },
    heroAlt: 'Home page: Staking Data / View',
    photoAlt: 'A fluid pink and purple abstraction',
    lead: 'Staking Data is a concept from Globalia’s internal R&D incubation process, aiming to design a unified SaaS platform for crypto-asset staking. The brief was to structure multi-portfolio management, the visualization of complex financial data and returns simulation.',
    chips: ['Centralize multi-portfolio management', 'Add a projected earnings calculator', 'Simplify validator tracking & alerts'],
    slides: [
      { title: 'Unified portfolio management', text: 'A centralized dashboard to follow balances and the evolution of returns in real time, and to switch instantly between several portfolios.' },
      { title: 'Smart earnings calculator', text: 'An interactive tool to simulate returns on investment precisely, according to the chosen asset and the length of the stake.' },
      { title: 'Validator tracking & alerts', text: 'A detailed view to compare validators by yield (APY) and commission, and to set up personalized alerts in a blink.' },
    ],
  },
  'globalia-brand': {
    meta: { role: 'Art Director & Senior UI/UX Web Designer', agency: 'Globalia', scope: 'Brand image · Corporate site · Internal communications · Events', tools: 'Figma' },
    heroAlt: 'Home page: Globalia Brand Identity',
    photoAlt: 'Two smiling colleagues around a laptop',
    lead: 'An ongoing internal art direction mandate at Globalia. The project aimed to harmonize the brand ecosystem across every touchpoint: website, sales presentations, LinkedIn templates, HR documents and team events (the annual retreat microsite, merchandise).',
    chips: ['Redesign the corporate website & case studies', 'Deploy a consistent communication ecosystem', 'Design brand and cultural experiences'],
    slides: [
      { title: 'Complete redesign of the corporate site & case studies', text: 'Design and rollout of the complete redesign of the Globalia website (UX/UI and art direction) to align the platform with the agency’s positioning. Creation of immersive templates dedicated to the major case studies.' },
      { title: 'Social networks, HR documents & sales tools', text: 'Rollout of an omnichannel graphic charter: styling of the agency’s social networks, design of posts and Inbound newsletters. Design of the internal and sales documentation, including the employee handbook, the sales presentations (Google Slides) and corporate materials.' },
      { title: 'Event microsite, careers site & swag', text: 'Design of immersive brand experiences for company culture: the annual retreat microsite, the careers site templates and a line of modern corporate clothing and accessories.' },
    ],
  },
  'intelli-jeunes': {
    meta: { role: 'Senior UI/UX Web Designer & AI Art Director', agency: 'Globalia', scope: 'Art direction · AI mascots · Responsive UI/UX design', tools: 'Figma · Midjourney' },
    heroAlt: 'Home page: Intelli Jeunes',
    photoAlt: 'A purple and blue 3D monster mascot with big horns',
    lead: 'Developed at Globalia together with the AI director, Intelli Jeunes is a concept for an educational game platform powered by artificial intelligence. The brief was to create the art direction from scratch, generate the visual universe with AI and design the whole educational web platform.',
    chips: ['Embody the brand through Midjourney', 'Structure the educational game modules', 'Roll out the complete web ecosystem'],
    slides: [
      { title: '3D mascots & prompt engineering with Midjourney', text: 'Creation and full generation of a bank of 3D monster mascots through rigorous prompt engineering in Midjourney. This generative AI workflow gives the project a strong identity while speeding up graphic production.' },
      { title: 'Playful modules & teacher tools', text: 'Structuring of the sections presenting the key features (class management, progress tracking, personalization). The layout combines dynamic storytelling and attractive visuals to engage the school community.' },
      { title: 'Web ecosystem & access journeys', text: 'A complete rollout of the page system (Home, About, Contact, Login). The consistency of the bright colours, typefaces and UI components guarantees a harmonious user experience from the first point of contact to the login.' },
    ],
  },
  maia: {
    meta: { role: 'Senior UI/UX Web Designer', agency: 'Globalia', scope: 'Visual identity · Information architecture · Web design', tools: 'Figma' },
    heroAlt: 'Home page: Maïa',
    photoAlt: 'A short-haired woman working on her laptop',
    lead: 'Backed by government funding, Maïa is an ambitious project to democratize access to business opportunities for women entrepreneurs. The project was split into two strategic phases: a V1 focused on acquisition (HubSpot) and a future V2 including the B2B tendering system.',
    chips: ['Embody the women-led B2B ecosystem', 'Structure the dual acquisition journey', 'Guarantee a smooth mobile experience'],
    slides: [
      { title: 'Designing a strong identity', text: 'Delivery of an exhaustive graphic standards guide. Creation of a complete visual identity (logo, typography, colour palette) to immediately establish Maïa’s institutional credibility on the market.' },
      { title: 'Acquisition journeys', text: 'Design of a web architecture optimized to generate leads, built around two distinct user journeys: acquiring large corporations (Buyers) and onboarding women-led businesses (Suppliers).' },
      { title: 'Optimized mobile experience', text: 'A rigorous rollout of the interfaces in a mobile version (responsive design), guaranteeing a smooth, accessible user experience on every device to maximize acquisition.' },
    ],
  },
}

// Holo MD has a hand-built page
export const holoEn = {
  heroLabel: 'Holo MD platform sign-in screen',
  heroAlt: 'Holo MD sign-in screen: “Imagine a New Era of AI-Powered Psychiatric Care”',
  lead: 'An innovation project for leaders in psychiatry. HoloMD combines a conversational AI assistant (Dr. Holo™) for remote therapeutic monitoring (RTM) with an analytics dashboard that lets psychiatrists adjust treatments and automate medical billing.',
  photoAlt: 'A woman sitting in an armchair, her phone in hand',
  slides: [
    {
      title: 'Global branding, brandbook & investor showcase',
      text: 'Creation of the HoloMD visual identity. Rollout on the institutional brandbook and design of the responsive micro-site built to present the technology to investors and clinical partners.',
    },
    {
      title: 'Patient app & remote therapeutic monitoring (RTM)',
      text: 'UX/UI design of the mobile app with the Dr. Holo™ AI assistant. The interface provides a secure (HIPAA) onboarding, consent management and empathetic daily exchanges to assess how symptoms evolve.',
    },
    {
      title: 'Psychiatrist dashboard & clinical decision support',
      text: 'Design of the web platform for physicians: real-time patient data visualization, clinical alerts to adjust treatments, and automated billing through RTM reimbursement codes (Medicare / insurers).',
    },
  ],
  alts: {
    site: 'Holo MD micro-site: “Rehumanizing Psychiatry in a New Era of AI-Powered Care”',
    drcard: 'Card: “Dr. Holo is designed to be an empathetic, caring, trustworthy…”',
    bruce: 'Card of Bruce A. Kehr, founder and chief executive',
    chat: 'Holo MD app: conversation with the Dr. Holo assistant',
    history: 'Holo MD app: history of the exchanges by period',
    welcome: 'Holo MD app: “Welcome” screen, entering the code provided by the clinician',
    dash: 'Dashboard: overview of the patients, monthly statistics and list',
    patient: 'Patient file: information, notes and mood history',
    doctor: 'Dr. Bruce’s profile and the list of patients with their mood',
  } as Record<string, string>,
}

export const aboutEn = {
  bio: 'With over 15 years of experience in digital design, UI/UX and art direction, I help companies, agencies and large accounts create high-performing digital products, complex information architectures and memorable visual identities.',
  columns: [
    { title: 'Tools', items: ['Figma', 'Adobe CC · WordPress', 'AI: Midjourney, Ideogram, Claude Code, Suno, Veo, Gemini, NotebookLM'] },
    { title: 'Skills', items: ['Figma component libraries', 'High-fidelity prototyping', 'Creative direction & branding', 'Information architecture', 'Generative AI'] },
    { title: 'Interests', items: ['Photography & drone', 'Music production & generative audio', 'Type curation & visual culture', 'Fat-biking & outdoor exploration'] },
  ],
  experience: [
    { years: '2023—2026', company: 'SmartBug Media', role: 'Senior UI/UX Web Designer' },
    { years: '2022—2023', company: 'Globalia', role: 'Senior UI/UX Web Designer & Art Director' },
    { years: '2020—2022', company: 'Freelance', role: 'Graphic & Web Designer' },
    { years: '2017—2020', company: 'Inovision Web', role: 'UI/UX Web Designer' },
    { years: '2012—2016', company: 'Empire Sport', role: 'Lead Designer' },
    { years: '1999—2011', company: 'Earlier', role: 'Graphic & Web Designer' },
  ],
  photoAlts: {
    selfie: 'Sébastien taking a selfie, cap on backwards, at the top of a mountain',
    bass: 'On stage playing bass, in trails of red light',
    bike: 'A fat bike on a metal bridge at sunset',
    camera: 'A reflection behind a window, a camera in front of the face',
    skate: 'A skateboard jump in front of a fence, an archive photo',
  } as Record<string, string>,
}

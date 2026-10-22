// "Une sélection d'autres projets web réalisés en agence": the pictures the scroll-zoom flies through.
// x / y = centre of the picture in % of the stage, w = its width in % of the stage's width (portrait 3:4 frames,
// the page is cropped from its top). They are listed back to front: the later, the nearer to the camera.
// TODO: the files below are stand-ins (this portfolio's own sites). Swap `f` for the real agency screenshots
// (put them in public/others/ and write 'others/name.webp'); nothing else needs to change.
export type OtherShot = { f: string; x: number; y: number; w: number }

export const others: OtherShot[] = [
  { f: 'cards/air-transat-ria/screen.webp', x: 12, y: 18, w: 14 },
  { f: 'cards/bijouterie-lavigueur/screen.webp', x: 33, y: 12, w: 11 },
  { f: 'cards/maia/screen.webp', x: 69, y: 14, w: 13 },
  { f: 'cards/staking-data/screen.webp', x: 88, y: 24, w: 15 },
  { f: 'cards/intelli-jeunes/screen.webp', x: 8, y: 54, w: 11 },
  { f: 'cards/globalia-brand/screen.webp', x: 92, y: 58, w: 12 },
  { f: 'cards/essll/screen.webp', x: 17, y: 84, w: 15 },
  { f: 'cards/holo-md/screen.webp', x: 37, y: 88, w: 11 },
  { f: 'cards/air-transat-ria/screen.webp', x: 65, y: 86, w: 14 },
  { f: 'cards/maia/screen.webp', x: 85, y: 84, w: 12 },
]

// the picture that ends up filling the screen
export const othersHero = { f: 'cards/camping-quebec/screen.webp', w: 24 }

export const othersTitle = 'Une sélection d’autres projets web réalisés en agence.'

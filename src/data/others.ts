// "Une sélection d'autres projets web réalisés en agence": the screenshots the scroll-zoom flies through (public/others/).
// Each one keeps its own proportions (w × h = the file's pixels; nothing is cropped or stretched). x / y = centre of the
// picture in % of the stage, h = its height in % of the screen's height. Listed back to front: the later, the nearer.
export type OtherShot = { f: string; name: string; w: number; h: number; x: number; y: number; sh: number }

export const others: OtherShot[] = [
  { f: 'affq.png', name: 'AFFQ', w: 385, h: 733, x: 10, y: 25, sh: 36 },
  { f: 'forum.png', name: 'Forum', w: 448, h: 518, x: 31, y: 15, sh: 24 },
  { f: 'Services & Tech.png', name: 'Altanora', w: 551, h: 333, x: 51, y: 8, sh: 12 },
  { f: 'Accueilfvfsg.png', name: 'Hedhofis', w: 573, h: 754, x: 71, y: 13, sh: 26 },
  { f: 'Industries.png', name: 'Mitsubishi HC Capital America', w: 453, h: 856, x: 90, y: 30, sh: 40 },
  { f: 'cqcd mobile.png', name: 'CQCD (mobile)', w: 253, h: 1033, x: 15, y: 57, sh: 26 },
  { f: 'accs.png', name: 'ACCS', w: 413, h: 1032, x: 5, y: 72, sh: 38 },
  { f: 'fromagex.jpg', name: 'Promagex', w: 334, h: 928, x: 23, y: 84, sh: 30 },
  { f: 'xma big.png', name: 'XMA', w: 490, h: 638, x: 40, y: 88, sh: 24 },
  { f: 'promotions.png', name: 'Camping Québec', w: 367, h: 443, x: 59, y: 89, sh: 22 },
  { f: 'cqcd.png', name: 'CQCD', w: 491, h: 668, x: 76, y: 85, sh: 26 },
  { f: 'buropro.png', name: 'Buropro Citation', w: 400, h: 774, x: 94, y: 74, sh: 34 },
  { f: 'giftjoy.png', name: 'Giftjoy', w: 493, h: 306, x: 87, y: 52, sh: 13 },
]

export const othersTitle = 'Une sélection d’autres projets web réalisés en agence.'

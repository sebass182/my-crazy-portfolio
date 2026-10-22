// "Une sélection d'autres projets web réalisés en agence": the screenshots the scroll-zoom flies through (public/others/).
// Each one keeps its own proportions (w × h = the file's pixels; nothing is cropped or stretched). x / y = centre of the
// picture in % of the stage; sh = its height in % of the screen's height as first seen; d = depth, 0 (right behind the screen:
// big and sharp) to 1 (far back: small and blurred). Listed back to front.
export type OtherShot = { f: string; name: string; w: number; h: number; x: number; y: number; sh: number; d: number }

export const others: OtherShot[] = [
  { f: 'xma.png', name: 'XMA', w: 490, h: 638, x: 42, y: 90, sh: 18, d: 0.95 },
  { f: 'altanora.png', name: 'Altanora', w: 551, h: 333, x: 52, y: 8, sh: 9, d: 0.9 },
  { f: 'cqcd-mobile.png', name: 'CQCD (mobile)', w: 253, h: 1033, x: 17, y: 58, sh: 24, d: 0.85 },
  { f: 'giftjoy.png', name: 'Giftjoy', w: 493, h: 306, x: 80, y: 52, sh: 11, d: 0.75 },
  { f: 'cqcd.png', name: 'CQCD', w: 491, h: 668, x: 77, y: 81, sh: 26, d: 0.7 },
  { f: 'forum.png', name: 'Forum', w: 448, h: 518, x: 30, y: 12, sh: 22, d: 0.55 },
  { f: 'hedhofis.png', name: 'Hedhofis', w: 573, h: 754, x: 72, y: 14, sh: 25, d: 0.4 },
  { f: 'promotions.png', name: 'Camping Québec', w: 367, h: 443, x: 60, y: 88, sh: 24, d: 0.3 },
  { f: 'buropro.png', name: 'Buropro Citation', w: 400, h: 774, x: 94, y: 76, sh: 34, d: 0.2 },
  { f: 'affq.png', name: 'AFFQ', w: 385, h: 733, x: 8, y: 22, sh: 38, d: 0.15 },
  { f: 'mitsubishi.png', name: 'Mitsubishi HC Capital America', w: 453, h: 856, x: 91, y: 34, sh: 42, d: 0.1 },
  { f: 'accs.png', name: 'ACCS', w: 413, h: 1032, x: 5, y: 74, sh: 40, d: 0 },
]

export const othersTitle = 'Une sélection d’autres projets web réalisés en agence.'

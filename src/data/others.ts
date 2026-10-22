// "Une sélection d'autres projets web réalisés en agence": the screenshots the scroll-zoom flies through (public/others/).
// Each one keeps its own proportions (w × h = the file's pixels; nothing is cropped or stretched). x / y = centre of the
// picture in % of the stage; sh = its height in % of the screen's height as first seen; d = depth, 0 (right behind the screen:
// big and sharp) to 1 (far back: small and blurred). Listed back to front.
// delay (0..1 of the zoom, how long it holds still), len (how long its journey takes: the shorter, the faster) and reach (how close to the
// camera it gets, as a share of the way: the closer, the bigger it ends up) are each picture's own.
export type OtherShot = { f: string; name: string; w: number; h: number; x: number; y: number; sh: number; d: number; delay: number; len: number; reach: number }

export const others: OtherShot[] = [
  { f: 'xma.png', name: 'XMA', w: 490, h: 638, x: 42, y: 90, sh: 18, d: 0.95, delay: 0.12, len: 0.85, reach: 0.95 },
  { f: 'altanora.png', name: 'Altanora', w: 551, h: 333, x: 52, y: 8, sh: 9, d: 0.9, delay: 0, len: 0.75, reach: 0.9 },
  { f: 'cqcd-mobile.png', name: 'CQCD (mobile)', w: 253, h: 1033, x: 17, y: 58, sh: 24, d: 0.85, delay: 0.28, len: 0.72, reach: 0.97 },
  { f: 'giftjoy.png', name: 'Giftjoy', w: 493, h: 306, x: 80, y: 52, sh: 11, d: 0.75, delay: 0.05, len: 0.7, reach: 0.85 },
  { f: 'cqcd.png', name: 'CQCD', w: 491, h: 668, x: 77, y: 81, sh: 26, d: 0.7, delay: 0.2, len: 0.8, reach: 0.92 },
  { f: 'forum.png', name: 'Forum', w: 448, h: 518, x: 30, y: 12, sh: 22, d: 0.55, delay: 0.1, len: 0.6, reach: 0.8 },
  { f: 'hedhofis.png', name: 'Hedhofis', w: 573, h: 754, x: 72, y: 14, sh: 25, d: 0.4, delay: 0.32, len: 0.65, reach: 0.97 },
  { f: 'promotions.png', name: 'Camping Québec', w: 367, h: 443, x: 60, y: 88, sh: 24, d: 0.3, delay: 0, len: 0.55, reach: 0.75 },
  { f: 'buropro.png', name: 'Buropro Citation', w: 400, h: 774, x: 94, y: 76, sh: 34, d: 0.2, delay: 0.15, len: 0.85, reach: 0.9 },
  { f: 'affq.png', name: 'AFFQ', w: 385, h: 733, x: 8, y: 22, sh: 38, d: 0.15, delay: 0.25, len: 0.7, reach: 0.8 },
  { f: 'mitsubishi.png', name: 'Mitsubishi HC Capital America', w: 453, h: 856, x: 91, y: 34, sh: 42, d: 0.1, delay: 0.02, len: 0.8, reach: 0.97 },
  { f: 'accs.png', name: 'ACCS', w: 413, h: 1032, x: 5, y: 74, sh: 40, d: 0, delay: 0.3, len: 0.6, reach: 0.88 },
]

export const othersTitle = 'Une sélection d’autres projets web réalisés en agence.'

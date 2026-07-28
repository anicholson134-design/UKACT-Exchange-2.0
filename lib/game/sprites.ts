import { PALETTE } from './palette'

/**
 * Tiny hand-authored pixel-art sprites.
 * Each sprite is a grid of characters; every character maps to a colour in
 * the sprite's own `palette`, and `.` is always transparent. Sprites are
 * deliberately small (8-16px) so they read as chunky pixel-art once scaled
 * up by the renderer's `pixelSize`.
 */
export interface Sprite {
  w: number
  h: number
  rows: string[]
  palette: Record<string, string>
}

function sprite(rows: string[], palette: Record<string, string>): Sprite {
  return { w: rows[0].length, h: rows.length, rows, palette }
}

/** Draws a sprite at (x, y) — top-left corner — in game-canvas pixels. */
export function drawSprite(
  ctx: CanvasRenderingContext2D,
  spr: Sprite,
  x: number,
  y: number,
  pixelSize: number,
) {
  for (let row = 0; row < spr.h; row++) {
    const line = spr.rows[row]
    for (let col = 0; col < spr.w; col++) {
      const ch = line[col]
      if (ch === '.' || ch === undefined) continue
      const color = spr.palette[ch]
      if (!color) continue
      ctx.fillStyle = color
      ctx.fillRect(
        Math.round(x + col * pixelSize),
        Math.round(y + row * pixelSize),
        pixelSize,
        pixelSize,
      )
    }
  }
}

/** Bounding size in game-canvas pixels for a given pixelSize. */
export function spriteSize(spr: Sprite, pixelSize: number) {
  return { w: spr.w * pixelSize, h: spr.h * pixelSize }
}

// ─── Item sprites ─────────────────────────────────────────────────────────

export const SPR_BUCKET = sprite(
  [
    '..H....H..',
    '.H.......H',
    '.MMMMMMMM.',
    '.MDDDDDDM.',
    '.MMMMMMMM.',
    '.MDDDDDDM.',
    '.MMMMMMMM.',
    '..MDDDDM..',
    '..MMMMMM..',
    '...MMMM...',
  ],
  { H: PALETTE.black, M: PALETTE.metal, D: PALETTE.metalDark },
)

export const SPR_WATER_BUCKET = sprite(
  [
    '..H....H..',
    '.H.......H',
    '.MMMMMMMM.',
    '.MWWWWWWM.',
    '.MWWWWWWM.',
    '.MWWWWWWM.',
    '.MWWWWWWM.',
    '..MWWWWM..',
    '..MMMMMM..',
    '...MMMM...',
  ],
  { H: PALETTE.black, M: PALETTE.metal, W: PALETTE.water },
)

export const SPR_FEED_BAG = sprite(
  [
    '....RRRR....',
    '...RssssR...',
    '..SsssssssS.',
    '.SsssssssssS',
    'SssssssssssS',
    'SssssssssssS',
    'SssssssssssS',
    '.SsssssssssS',
    '.SsssssssssS',
    '..SsssssssS.',
    '...SSSSSS...',
  ],
  { R: PALETTE.woodDark, s: PALETTE.sand, S: PALETTE.stone },
)

export const SPR_FRUIT_CRATE = sprite(
  [
    '..OOO.OOO.OO..',
    '.OGOOGOOGOOGO.',
    'WWWWWWWWWWWWWW',
    'WDDDDDDDDDDDDW',
    'WWWWWWWWWWWWWW',
    'WDDDDDDDDDDDDW',
    'WWWWWWWWWWWWWW',
    'WDDDDDDDDDDDDW',
    'WWWWWWWWWWWWWW',
  ],
  { O: PALETTE.rust, G: PALETTE.leafLight, W: PALETTE.woodLight, D: PALETTE.woodDark },
)

export const SPR_HAY_BALE = sprite(
  [
    'GGGGGGGGGGGGGG',
    'GggggggggggggG',
    'GgBBggggBBggBG',
    'GggggggggggggG',
    'GggggggggggggG',
    'GgBBggggBBggBG',
    'GggggggggggggG',
    'GggggggggggggG',
    'GGGGGGGGGGGGGG',
  ],
  { G: PALETTE.goldLight, g: PALETTE.gold, B: PALETTE.woodDark },
)

export const SPR_ENRICHMENT_TOY = sprite(
  [
    '..RRRRRR..',
    '.RRRRRRRR.',
    'RRYYRRYYRR',
    'RRYYRRYYRR',
    'RRRRRRRRRR',
    'RRYYRRYYRR',
    'RRYYRRYYRR',
    '.RRRRRRRR.',
    '..RRRRRR..',
  ],
  { R: PALETTE.red, Y: PALETTE.sunYellow },
)

export const SPR_TRANSPORT_BOX = sprite(
  [
    'WWWWWWWWWWWWWW',
    'WDD..DD..DD.DW',
    'WWWWWWWWWWWWWW',
    'WD..DD..DD..DW',
    'WWWWWWWWWWWWWW',
    'WDD..DD..DD.DW',
    'WWWWWWWWWWWWWW',
    'WD..DD..DD..DW',
    'WWWWWWWWWWWWWW',
  ],
  { W: PALETTE.woodLight, D: PALETTE.metalDark },
)

export const SPR_SHOVEL = sprite(
  [
    '...WW...',
    '...WW...',
    '...WW...',
    '...WW...',
    '...WW...',
    '...WW...',
    '...WW...',
    '...WW...',
    '...WW...',
    '..MMMM..',
    '.MMMMMM.',
    '.MDDDDM.',
    '.MDDDDM.',
    '..MMMM..',
  ],
  { W: PALETTE.woodDark, M: PALETTE.metal, D: PALETTE.metalDark },
)

export const SPR_KEEP_CRATE = sprite(
  [
    'WWWWWWWWWWWWWW',
    'WDDDDDDDDDDDDW',
    'WD..........DW',
    'WD..........DW',
    'WD..........DW',
    'WD..........DW',
    'WD..........DW',
    'WDDDDDDDDDDDDW',
    'WWWWWWWWWWWWWW',
  ],
  { W: PALETTE.woodLight, D: PALETTE.woodDark },
)

export const SPR_MED_KIT = sprite(
  [
    'WWWWWWWWWWWW',
    'WwwwwwwwwwwW',
    'Ww..RRRR..wW',
    'Ww..RRRR..wW',
    'WwRRRRRRRRwW',
    'WwRRRRRRRRwW',
    'Ww..RRRR..wW',
    'Ww..RRRR..wW',
    'WwwwwwwwwwwW',
    'WWWWWWWWWWWW',
  ],
  { W: PALETTE.stone, w: PALETTE.white2, R: PALETTE.red },
)

export const SPR_ROPE = sprite(
  [
    '..RRRRRR..',
    '.RRRRRRRR.',
    'RR..RR..RR',
    'R.RRRRRR.R',
    'R.R....R.R',
    'R.R....R.R',
    'R.RRRRRR.R',
    'RR..RR..RR',
    '.RRRRRRRR.',
    '..RRRRRR..',
  ],
  { R: PALETTE.rust },
)

export const SPR_BIRD_SEED = sprite(
  [
    '...RRRR...',
    '..SssssS..',
    '.SsssssS..',
    'SssssssssS',
    'SssssssssS',
    'SssssssssS',
    '.SsssssS..',
    '..SSSSS...',
    '....o.o...',
    '..o.o.o...',
  ],
  { R: PALETTE.woodDark, S: PALETTE.stone, s: PALETTE.goldLight, o: PALETTE.gold },
)

export const SPR_FISH_BOX = sprite(
  [
    'WWWWWWWWWWWWWW',
    'WDDDDDDDDDDDDW',
    'WD..........DW',
    'WD..FF......DW',
    'WD.FFFF.....DW',
    'WD..FF......DW',
    'WDDDDDDDDDDDDW',
    'WWWWWWWWWWWWWW',
  ],
  { W: PALETTE.metal, D: PALETTE.metalDark, F: PALETTE.waterLight },
)

// ─── Rare / easter-egg sprites ─────────────────────────────────────────────

export const SPR_RED_PANDA = sprite(
  [
    '..OOOOOO....',
    '.OOOOOOOO...',
    'OOOoooOOOO..',
    'OwwOOOwwO...',
    'OwOOOOOwO...',
    'OOOOOOOOOO..',
    'OOOOOOOOOO..',
    '.OOOOOOOO...',
    '..O.OO.O....',
  ],
  { O: PALETTE.rust, o: PALETTE.cream, w: PALETTE.black },
)

export const SPR_GOLDEN_BANANA = sprite(
  [
    '........GG..',
    '.......G..G.',
    '......G...G.',
    '.....G....G.',
    '....G....G..',
    '...G....G...',
    '..G....G....',
    '.GG..GG.....',
  ],
  { G: PALETTE.sunYellow },
)

export const SPR_ZOO_MAP = sprite(
  [
    'WWWWWWWWWWWW',
    'WccccccccccW',
    'Wc.x..x...cW',
    'Wc..x.x...cW',
    'Wc.x..x...cW',
    'Wcx....x..cW',
    'Wc..X.....cW',
    'Wc........cW',
    'Wc..x.x...cW',
    'WccccccccccW',
  ],
  { W: PALETTE.woodDark, c: PALETTE.cream2, x: PALETTE.moss, X: PALETTE.red },
)

export const SPR_RUBBER_DUCK = sprite(
  [
    '....OOOO....',
    '...OOOOOO...',
    '..OOOOOOOb..',
    '.OOOOOOOOOb.',
    'OOOOOOOOOOb.',
    'OOOOOOOOOO..',
    '.OOOOOOOO...',
    '..w....w....',
  ],
  { O: PALETTE.sunYellow, b: PALETTE.rust, w: PALETTE.woodDark },
)

export const SPR_KEEP_TROPHY = sprite(
  [
    '.GGGGGGGG.',
    'GGgggggGG.',
    'GGgggggGG.',
    '.GGggggGG.',
    '..GGGGG...',
    '...GGG....',
    '...GGG....',
    '...GGG....',
    '..GGGGG...',
    '.GGGGGGG..',
  ],
  { G: PALETTE.gold, g: PALETTE.goldLight },
)

// ─── Background sprites ─────────────────────────────────────────────────────

export const SPR_TREE = sprite(
  [
    '......LL......',
    '....LLLLLL....',
    '...LLLLLLLL...',
    '..LLllLLllLL..',
    '.LLLLLLLLLLLL.',
    '.LlLLLLLLLLlL.',
    '..LLLLLLLLLL..',
    '...LLLLLLLL...',
    '......TT......',
    '......TT......',
    '......TT......',
  ],
  { L: PALETTE.leafDark, l: PALETTE.leafLight, T: PALETTE.woodDark },
)

export const SPR_BUSH = sprite(
  ['.LLLL.LLLL.', 'LLllLLLLllL', 'LLLLLLLLLLL', '.LLLLLLLLL.'],
  { L: PALETTE.leafDark, l: PALETTE.leafLight },
)

export const SPR_CLOUD = sprite(
  ['..WWWW..........', '.WWWWWWWW.......', 'WWWWWWWWWWWW....', '.WWWWWWWWWWWWWW.', '..WWWWWWWWWWWW..'],
  { W: PALETTE.white2 },
)

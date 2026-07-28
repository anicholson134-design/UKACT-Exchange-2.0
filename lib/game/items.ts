import {
  Sprite,
  SPR_BUCKET,
  SPR_WATER_BUCKET,
  SPR_FEED_BAG,
  SPR_FRUIT_CRATE,
  SPR_HAY_BALE,
  SPR_ENRICHMENT_TOY,
  SPR_TRANSPORT_BOX,
  SPR_SHOVEL,
  SPR_KEEP_CRATE,
  SPR_MED_KIT,
  SPR_ROPE,
  SPR_BIRD_SEED,
  SPR_FISH_BOX,
  SPR_RED_PANDA,
  SPR_GOLDEN_BANANA,
  SPR_ZOO_MAP,
  SPR_RUBBER_DUCK,
  SPR_KEEP_TROPHY,
} from './sprites'

export interface ItemDef {
  id: string
  name: string
  sprite: Sprite
  /** World pixels per sprite cell — controls the item's on-screen/footprint size. */
  scale: number
  /** Relative mass; heavier items shift the centre of mass more. */
  weight: number
  /** -1..1 fraction of half-width — true centre of gravity offset from the visual centre. */
  cgBias: number
  /** 0..1 how much the item jitters/rocks right after landing. */
  wobble: number
  /** True for the rare easter-egg pool. */
  rare?: boolean
  /** Bonus points on top of the standard +1 when this item is stacked. */
  bonus?: number
  /** Stamp the KEEP wordmark onto the crate. */
  logo?: boolean
}

export const COMMON_ITEMS: ItemDef[] = [
  { id: 'bucket', name: 'Bucket', sprite: SPR_BUCKET, scale: 3, weight: 1, cgBias: 0, wobble: 0.15 },
  { id: 'water-bucket', name: 'Water Bucket', sprite: SPR_WATER_BUCKET, scale: 3, weight: 1.3, cgBias: 0, wobble: 0.35 },
  { id: 'feed-bag', name: 'Feed Bag', sprite: SPR_FEED_BAG, scale: 3, weight: 1.6, cgBias: 0.05, wobble: 0.2 },
  { id: 'fruit-crate', name: 'Fruit Crate', sprite: SPR_FRUIT_CRATE, scale: 2.6, weight: 1.4, cgBias: 0.15, wobble: 0.1 },
  { id: 'hay-bale', name: 'Hay Bale', sprite: SPR_HAY_BALE, scale: 3.2, weight: 2.2, cgBias: 0, wobble: 0.05 },
  { id: 'enrichment-toy', name: 'Enrichment Toy', sprite: SPR_ENRICHMENT_TOY, scale: 2.4, weight: 0.6, cgBias: 0, wobble: 0.55 },
  { id: 'transport-box', name: 'Transport Box', sprite: SPR_TRANSPORT_BOX, scale: 2.8, weight: 2.6, cgBias: 0.1, wobble: 0.08 },
  { id: 'shovel', name: 'Shovel', sprite: SPR_SHOVEL, scale: 2.4, weight: 0.9, cgBias: 0.35, wobble: 0.3 },
  { id: 'keep-crate', name: 'KEEP Crate', sprite: SPR_KEEP_CRATE, scale: 2.8, weight: 1.7, cgBias: 0, wobble: 0.08, logo: true },
  { id: 'med-kit', name: 'Medical Kit', sprite: SPR_MED_KIT, scale: 2.6, weight: 1.1, cgBias: 0, wobble: 0.1 },
  { id: 'rope', name: 'Rope Coil', sprite: SPR_ROPE, scale: 2.6, weight: 0.7, cgBias: 0.2, wobble: 0.4 },
  { id: 'bird-seed', name: 'Bird Seed Sack', sprite: SPR_BIRD_SEED, scale: 2.6, weight: 0.8, cgBias: -0.15, wobble: 0.25 },
  { id: 'fish-box', name: 'Fish Box', sprite: SPR_FISH_BOX, scale: 2.8, weight: 1.9, cgBias: -0.25, wobble: 0.12 },
]

export const RARE_ITEMS: ItemDef[] = [
  { id: 'red-panda', name: 'Red Panda Plush', sprite: SPR_RED_PANDA, scale: 2.6, weight: 0.5, cgBias: 0, wobble: 0.3, rare: true, bonus: 10 },
  { id: 'golden-banana', name: 'Golden Banana', sprite: SPR_GOLDEN_BANANA, scale: 2.4, weight: 0.3, cgBias: 0.4, wobble: 0.5, rare: true, bonus: 10 },
  { id: 'zoo-map', name: 'Tiny Zoo Map', sprite: SPR_ZOO_MAP, scale: 2.4, weight: 0.3, cgBias: 0, wobble: 0.15, rare: true, bonus: 10 },
  { id: 'rubber-duck', name: 'Rubber Duck', sprite: SPR_RUBBER_DUCK, scale: 2.6, weight: 0.4, cgBias: 0.1, wobble: 0.45, rare: true, bonus: 10 },
  { id: 'keep-trophy', name: 'KEEP Trophy', sprite: SPR_KEEP_TROPHY, scale: 2.8, weight: 0.8, cgBias: 0, wobble: 0.1, rare: true, bonus: 25 },
]

export const ALL_ITEMS = [...COMMON_ITEMS, ...RARE_ITEMS]

const RARE_CHANCE = 0.07

/** Picks the next item, occasionally surfacing a rare easter-egg item. */
export function rollNextItem(rand: () => number = Math.random): ItemDef {
  if (rand() < RARE_CHANCE) {
    return RARE_ITEMS[Math.floor(rand() * RARE_ITEMS.length)]
  }
  return COMMON_ITEMS[Math.floor(rand() * COMMON_ITEMS.length)]
}

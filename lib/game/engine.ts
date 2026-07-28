import { ItemDef, rollNextItem } from './items'

// ─── World constants (all in internal game-canvas pixels) ─────────────────

export const GAME_W = 220
export const GAME_H = 380
export const GROUND_Y = 316
export const BED_TOP_Y = 250
export const BARROW_CENTER_X = GAME_W / 2
export const BED_WIDTH = 116
export const BED_LEFT = BARROW_CENTER_X - BED_WIDTH / 2
export const BED_RIGHT = BARROW_CENTER_X + BED_WIDTH / 2
export const SPAWN_Y = 26
export const COLS = 24
const COL_WIDTH = BED_WIDTH / COLS

const BASE_GRAVITY = 260 // world px / s^2
const GRAVITY_STEP = 22
const MAX_GRAVITY = 520

const BASE_MAX_OFFSET = 46 // world px of COM drift tolerated before critical
const OFFSET_SHRINK = 2.4
const MIN_MAX_OFFSET = 20

const WARN_RATIO = 0.62

const BASE_GRACE_MS = 1300
const GRACE_SHRINK = 45
const MIN_GRACE_MS = 550

const MAX_TILT_ANGLE = 0.34 // radians, ~19.5deg, angle at ratio == 1
const TIP_FAIL_ANGLE = 0.95 // radians, angle reached at full tip-over

const SPRING_K = 90
const SPRING_DAMPING = 9

const AIM_HALF_OVERHANG = 26 // how far the aim cursor may travel past the bed edge

export type GameStatus = 'aiming' | 'falling' | 'settling' | 'tipping' | 'tipped'

export interface PlacedItem {
  id: number
  item: ItemDef
  x: number // centre x, world
  topY: number // settled top-of-item y, world
  w: number
  h: number
  wobbleOffset: number // small cosmetic rock applied at render time
  wobbleVel: number
  rare: boolean
}

export type GameEventType =
  | 'land'
  | 'miss'
  | 'milestone'
  | 'newBest'
  | 'recovered'
  | 'warning'
  | 'tipping'
  | 'gameover'
  | 'rare'

export interface GameEvent {
  type: GameEventType
  x?: number
  y?: number
  points?: number
  itemName?: string
}

let nextId = 1

export class WheelbarrowEngine {
  status: GameStatus = 'aiming'
  score = 0
  itemsStacked = 0
  best = 0
  level = 0

  placed: PlacedItem[] = []
  heightmap: number[] = new Array(COLS).fill(BED_TOP_Y)

  current: ItemDef = rollNextItem()
  aimX = BARROW_CENTER_X
  fallY = SPAWN_Y
  fallVy = 0

  tiltAngle = 0
  tiltVel = 0
  comOffset = 0
  comRatio = 0

  graceTimer = 0
  shake = 0
  cameraY = 0

  private beatBestAwarded = false
  private rand: () => number
  events: GameEvent[] = []

  constructor(best = 0, rand: () => number = Math.random) {
    this.best = best
    this.rand = rand
  }

  reset(best: number) {
    this.status = 'aiming'
    this.score = 0
    this.itemsStacked = 0
    this.level = 0
    this.placed = []
    this.heightmap = new Array(COLS).fill(BED_TOP_Y)
    this.current = rollNextItem(this.rand)
    this.aimX = BARROW_CENTER_X
    this.fallY = SPAWN_Y
    this.fallVy = 0
    this.tiltAngle = 0
    this.tiltVel = 0
    this.comOffset = 0
    this.comRatio = 0
    this.graceTimer = 0
    this.shake = 0
    this.cameraY = 0
    this.beatBestAwarded = false
    this.best = best
    this.events = []
  }

  private maxOffset() {
    return Math.max(MIN_MAX_OFFSET, BASE_MAX_OFFSET - this.level * OFFSET_SHRINK)
  }

  private gravity() {
    return Math.min(MAX_GRAVITY, BASE_GRAVITY + this.level * GRAVITY_STEP)
  }

  private graceMs() {
    return Math.max(MIN_GRACE_MS, BASE_GRACE_MS - this.level * GRACE_SHRINK)
  }

  private currentFootprint() {
    const w = this.current.sprite.w * this.current.scale
    const h = this.current.sprite.h * this.current.scale
    return { w, h }
  }

  /** Called continuously by input handlers while aiming. */
  setAimX(worldX: number) {
    const min = BED_LEFT - AIM_HALF_OVERHANG
    const max = BED_RIGHT + AIM_HALF_OVERHANG
    this.aimX = Math.max(min, Math.min(max, worldX))
  }

  nudgeAim(dir: -1 | 1, dtMs: number) {
    const speed = 0.16 // world px per ms
    this.setAimX(this.aimX + dir * speed * dtMs)
  }

  drop() {
    if (this.status !== 'aiming') return
    this.status = 'falling'
    this.fallVy = 20
  }

  private computeBalance() {
    if (this.placed.length === 0) {
      this.comOffset = 0
      this.comRatio = 0
      return
    }
    let totalWeight = 0
    let weightedX = 0
    for (const p of this.placed) {
      const cg = p.x + p.item.cgBias * (p.w / 2)
      weightedX += cg * p.item.weight
      totalWeight += p.item.weight
    }
    const comX = weightedX / totalWeight
    this.comOffset = comX - BARROW_CENTER_X
    this.comRatio = this.comOffset / this.maxOffset()
  }

  private updateTilt(dt: number) {
    const targetRatio = Math.max(-1.6, Math.min(1.6, this.comRatio))
    const target = targetRatio * MAX_TILT_ANGLE
    const accel = (target - this.tiltAngle) * SPRING_K - this.tiltVel * SPRING_DAMPING
    this.tiltVel += accel * dt
    this.tiltAngle += this.tiltVel * dt
  }

  private updateCamera() {
    const topSurfaceY = this.placed.length ? Math.min(...this.heightmap) : BED_TOP_Y
    const anchor = 130
    const target = Math.min(0, topSurfaceY - anchor)
    this.cameraY += (target - this.cameraY) * 0.08
  }

  private columnsFor(x: number, w: number) {
    const left = x - w / 2
    const right = x + w / 2
    let c0 = Math.floor((left - BED_LEFT) / COL_WIDTH)
    let c1 = Math.ceil((right - BED_LEFT) / COL_WIDTH) - 1
    c0 = Math.max(0, c0)
    c1 = Math.min(COLS - 1, c1)
    return { c0, c1, left, right }
  }

  private overlapFraction(x: number, w: number) {
    const left = Math.max(x - w / 2, BED_LEFT)
    const right = Math.min(x + w / 2, BED_RIGHT)
    return Math.max(0, right - left) / w
  }

  private settleFall(dt: number) {
    this.fallVy += this.gravity() * dt
    this.fallY += this.fallVy * dt

    const { w, h } = this.currentFootprint()
    const overlap = this.overlapFraction(this.aimX, w)

    if (overlap < 0.22) {
      // Missed the barrow entirely — falls to the ground beside it.
      if (this.fallY + h >= GROUND_Y) {
        this.events.push({ type: 'miss', x: this.aimX, y: GROUND_Y })
        this.triggerGameOver()
      }
      return
    }

    const { c0, c1 } = this.columnsFor(this.aimX, w)
    let surfaceY = BED_TOP_Y
    for (let c = c0; c <= c1; c++) surfaceY = Math.min(surfaceY, this.heightmap[c])

    if (this.fallY + h >= surfaceY) {
      this.landItem(surfaceY - h, c0, c1, w, h)
    }
  }

  private landItem(topY: number, c0: number, c1: number, w: number, h: number) {
    const id = nextId++
    const placed: PlacedItem = {
      id,
      item: this.current,
      x: this.aimX,
      topY,
      w,
      h,
      wobbleOffset: 0,
      wobbleVel: (this.rand() - 0.5) * this.current.wobble * 4,
      rare: !!this.current.rare,
    }
    this.placed.push(placed)
    for (let c = c0; c <= c1; c++) this.heightmap[c] = topY

    this.itemsStacked += 1
    let gained = 1 + (this.current.bonus ?? 0)
    this.score += gained
    this.events.push({ type: 'land', x: placed.x, y: topY, points: gained, itemName: this.current.name })
    if (this.current.rare) this.events.push({ type: 'rare', x: placed.x, y: topY, itemName: this.current.name })

    if (this.itemsStacked % 10 === 0) {
      this.score += 5
      this.events.push({ type: 'milestone', points: 5, x: placed.x, y: topY })
      this.level = Math.floor(this.itemsStacked / 10)
    }

    if (!this.beatBestAwarded && this.best > 0 && this.score > this.best) {
      this.score += 25
      this.beatBestAwarded = true
      this.events.push({ type: 'newBest', points: 25, x: placed.x, y: topY })
    }

    // Impact impulse: heavier / off-centre items rock the barrow more.
    const impact = (this.current.weight * (0.6 + this.current.wobble)) * (this.rand() < 0.5 ? -1 : 1) * 0.6
    this.tiltVel += impact

    this.computeBalance()
    this.current = rollNextItem(this.rand)
    this.aimX = BARROW_CENTER_X
    this.fallY = SPAWN_Y
    this.fallVy = 0
    this.status = 'aiming'
  }

  private triggerGameOver() {
    this.status = 'tipped'
    this.events.push({ type: 'gameover' })
  }

  private updateTipping(dtMs: number) {
    this.computeBalance()
    const ratio = Math.abs(this.comRatio)
    if (this.status !== 'tipping' && ratio > 1) {
      this.status = 'tipping'
      this.graceTimer = this.graceMs()
      this.events.push({ type: 'tipping' })
    } else if (this.status === 'tipping') {
      if (ratio <= 1) {
        this.status = 'aiming'
        this.events.push({ type: 'recovered' })
      } else {
        this.graceTimer -= dtMs
        if (ratio > 1.7 || this.graceTimer <= 0) {
          this.triggerGameOver()
        }
      }
    }
  }

  update(dtMs: number, input: { dropRequested?: boolean } = {}) {
    if (this.status === 'tipped') {
      // Animate the final tip-over for visual flourish; angle keeps easing toward failure.
      const dir = this.comOffset >= 0 ? 1 : -1
      const accel = (dir * TIP_FAIL_ANGLE - this.tiltAngle) * 14
      this.tiltVel += accel * (dtMs / 1000)
      this.tiltAngle += this.tiltVel * (dtMs / 1000)
      return
    }

    const dt = dtMs / 1000

    if (input.dropRequested) this.drop()

    if (this.status === 'falling') {
      this.settleFall(dt)
    }

    this.computeBalance()
    this.updateTilt(dt)
    this.updateCamera()

    if (this.status !== 'falling') {
      this.updateTipping(dtMs)
    }

    const ratio = Math.abs(this.comRatio)
    this.shake = ratio > WARN_RATIO ? Math.min(1, (ratio - WARN_RATIO) / (1 - WARN_RATIO)) : 0
    if (ratio > WARN_RATIO && ratio <= 1 && this.rand() < 0.02) {
      this.events.push({ type: 'warning' })
    }
  }

  /** Drains and returns queued events (call once per frame from the renderer/UI). */
  drainEvents(): GameEvent[] {
    const evts = this.events
    this.events = []
    return evts
  }
}

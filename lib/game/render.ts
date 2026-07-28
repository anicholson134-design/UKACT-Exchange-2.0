import { PALETTE } from './palette'
import { drawSprite, SPR_TREE, SPR_BUSH, SPR_CLOUD } from './sprites'
import { GAME_W, GAME_H, GROUND_Y, BARROW_CENTER_X } from './engine'

/** Static-ish background scene: sky, hills, fence, trees, hidden KEEP sign, ground. */
export function drawBackground(ctx: CanvasRenderingContext2D, cameraY: number, timeMs: number) {
  // Sky
  const grad = ctx.createLinearGradient(0, 0, 0, GROUND_Y)
  grad.addColorStop(0, PALETTE.skyTop)
  grad.addColorStop(1, PALETTE.skyBottom)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, GAME_W, GAME_H)

  // Sun
  ctx.fillStyle = PALETTE.sunYellow
  ctx.beginPath()
  ctx.arc(GAME_W - 34, 40 - cameraY * 0.15, 16, 0, Math.PI * 2)
  ctx.fill()

  // Clouds (slow idle drift + gentle parallax with camera)
  const drift = (timeMs / 4000) % (GAME_W + 40)
  drawSprite(ctx, SPR_CLOUD, GAME_W - drift, 24 - cameraY * 0.2, 1.4)
  drawSprite(ctx, SPR_CLOUD, GAME_W - drift + GAME_W + 60, 60 - cameraY * 0.2, 1.1)

  // Distant hills
  const hillY = GROUND_Y - cameraY * 0.35
  ctx.fillStyle = PALETTE.sage
  ctx.beginPath()
  ctx.ellipse(50, hillY, 90, 40, 0, Math.PI, 0)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(GAME_W - 40, hillY + 6, 100, 46, 0, Math.PI, 0)
  ctx.fill()

  // Distant wildlife silhouette (a little giraffe, tucked between the hills)
  const wildY = GROUND_Y - cameraY * 0.35
  ctx.fillStyle = PALETTE.canopy
  ctx.fillRect(GAME_W - 70, wildY - 46, 5, 46)
  ctx.fillRect(GAME_W - 70, wildY - 50, 14, 8)
  ctx.fillRect(GAME_W - 60, wildY - 20, 16, 12)
  ctx.fillRect(GAME_W - 60, wildY - 8, 4, 10)
  ctx.fillRect(GAME_W - 48, wildY - 8, 4, 10)

  // Trees + bushes, parallax'd with the camera
  const treeY = GROUND_Y - cameraY
  drawSprite(ctx, SPR_TREE, 8, treeY - 46, 2)
  drawSprite(ctx, SPR_TREE, GAME_W - 46, treeY - 50, 2.1)
  drawSprite(ctx, SPR_BUSH, 60, treeY - 12, 1.6)
  drawSprite(ctx, SPR_BUSH, GAME_W - 100, treeY - 10, 1.4)

  // Fence line
  ctx.strokeStyle = PALETTE.woodDark
  ctx.lineWidth = 2
  const fenceY = GROUND_Y - cameraY - 10
  ctx.beginPath()
  ctx.moveTo(0, fenceY)
  ctx.lineTo(GAME_W, fenceY)
  ctx.moveTo(0, fenceY - 6)
  ctx.lineTo(GAME_W, fenceY - 6)
  ctx.stroke()
  for (let x = 4; x < GAME_W; x += 22) {
    ctx.fillStyle = PALETTE.woodDark
    ctx.fillRect(x, fenceY - 14, 4, 20)
  }

  // Hidden KEEP reference: a little enclosure sign with a paw-print mark
  const signX = 16
  const signY = fenceY - 30
  ctx.fillStyle = PALETTE.woodDark
  ctx.fillRect(signX, signY, 2, 16)
  ctx.fillStyle = PALETTE.sand
  ctx.fillRect(signX - 10, signY - 10, 24, 12)
  ctx.strokeStyle = PALETTE.woodDark
  ctx.lineWidth = 1
  ctx.strokeRect(signX - 10, signY - 10, 24, 12)
  drawPawPrint(ctx, signX + 2, signY - 4, PALETTE.forest)

  // Ground
  ctx.fillStyle = PALETTE.moss
  ctx.fillRect(0, GROUND_Y, GAME_W, GAME_H - GROUND_Y)
  ctx.fillStyle = PALETTE.canopy
  for (let x = 0; x < GAME_W; x += 8) {
    if ((Math.floor(x / 8) + Math.floor(timeMs / 100000)) % 3 === 0) {
      ctx.fillRect(x, GROUND_Y, 4, 4)
    }
  }
}

/**
 * Opens a canvas transform rotated about the wheelbarrow's wheel/ground pivot.
 * Everything drawn until `endBarrowTransform` (the barrow shape and the
 * stacked items) shares this transform, so the whole load tips together.
 * Pair with `endBarrowTransform`.
 */
export function beginBarrowTransform(ctx: CanvasRenderingContext2D, pivotX: number, pivotY: number, angle: number) {
  ctx.save()
  ctx.translate(pivotX, pivotY)
  ctx.rotate(angle)
}

export function endBarrowTransform(ctx: CanvasRenderingContext2D) {
  ctx.restore()
}

/** Draws the wheelbarrow shape relative to the origin set up by `beginBarrowTransform`. */
export function drawWheelbarrowShape(ctx: CanvasRenderingContext2D) {
  // Handles
  ctx.strokeStyle = PALETTE.woodDark
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.moveTo(44, -52)
  ctx.lineTo(80, -74)
  ctx.moveTo(34, -50)
  ctx.lineTo(70, -74)
  ctx.stroke()
  ctx.fillStyle = PALETTE.woodDark
  ctx.beginPath()
  ctx.arc(80, -74, 4, 0, Math.PI * 2)
  ctx.arc(70, -74, 4, 0, Math.PI * 2)
  ctx.fill()

  // Legs
  ctx.fillStyle = PALETTE.metalDark
  ctx.fillRect(-30, -6, 6, 10)
  ctx.fillRect(24, -6, 6, 10)

  // Wheel
  ctx.fillStyle = PALETTE.metalDark
  ctx.beginPath()
  ctx.arc(0, 0, 16, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = PALETTE.stone
  ctx.beginPath()
  ctx.arc(0, 0, 10, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = PALETTE.metalDark
  ctx.beginPath()
  ctx.arc(0, 0, 3, 0, Math.PI * 2)
  ctx.fill()

  // Tray (trapezoid, wider at the top)
  ctx.beginPath()
  ctx.moveTo(-58, -66)
  ctx.lineTo(58, -66)
  ctx.lineTo(38, -30)
  ctx.lineTo(-38, -30)
  ctx.closePath()
  ctx.fillStyle = PALETTE.gold
  ctx.fill()
  ctx.strokeStyle = PALETTE.goldLight
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(-58, -66)
  ctx.lineTo(58, -66)
  ctx.stroke()
  ctx.strokeStyle = PALETTE.woodDark
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(-38, -30)
  ctx.lineTo(38, -30)
  ctx.stroke()

  // Little KEEP leaf-crest stamped on the tray front
  drawLeafCrest(ctx, 0, -44, PALETTE.forest)
}

/** A minimal 5-dot paw print — a small hidden nod to KEEP's animal-welfare mission. */
function drawPawPrint(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.ellipse(x, y, 3, 2.2, 0, 0, Math.PI * 2)
  ctx.fill()
  const toes: [number, number][] = [
    [-3, -3.5],
    [0, -4.5],
    [3, -3.5],
  ]
  for (const [dx, dy] of toes) {
    ctx.beginPath()
    ctx.ellipse(x + dx, y + dy, 1.1, 1.4, 0, 0, Math.PI * 2)
    ctx.fill()
  }
}

/** Simple circular leaf-crest badge echoing KEEP's canopy branding. */
function drawLeafCrest(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = PALETTE.goldLight
  ctx.beginPath()
  ctx.ellipse(x - 2, y, 3, 1.6, Math.PI / 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(x + 2, y, 3, 1.6, -Math.PI / 4, 0, Math.PI * 2)
  ctx.fill()
}

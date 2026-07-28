import { PALETTE } from './palette'
import { beginBarrowTransform, drawWheelbarrowShape, endBarrowTransform } from './render'

const CARD_W = 1200
const CARD_H = 630

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

/** Renders a shareable social-card PNG for the given run. Returns a data URL. */
export async function generateShareCard(score: number, itemsStacked: number): Promise<string> {
  const canvas = document.createElement('canvas')
  canvas.width = CARD_W
  canvas.height = CARD_H
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = false

  const grad = ctx.createLinearGradient(0, 0, 0, CARD_H)
  grad.addColorStop(0, PALETTE.skyTop)
  grad.addColorStop(0.55, PALETTE.skyBottom)
  grad.addColorStop(0.55, PALETTE.moss)
  grad.addColorStop(1, PALETTE.canopy)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, CARD_W, CARD_H)

  ctx.save()
  ctx.translate(CARD_W - 260, 0)
  ctx.scale(2.4, 2.4)
  beginBarrowTransform(ctx, 110, 316, -0.12)
  drawWheelbarrowShape(ctx)
  endBarrowTransform(ctx)
  ctx.restore()

  const logo = await loadImage('/keep-logo.webp')
  if (logo) ctx.drawImage(logo, 64, 56, 84, 84)

  ctx.fillStyle = PALETTE.forest
  ctx.font = 'bold 40px "Courier New", monospace'
  ctx.textAlign = 'left'
  ctx.fillText('KEEP the Wheelbarrow', 64, 190)

  ctx.font = 'bold 120px "Courier New", monospace'
  ctx.fillStyle = PALETTE.gold
  ctx.fillText(String(score), 64, 340)
  ctx.font = 'bold 28px "Courier New", monospace'
  ctx.fillStyle = PALETTE.cream
  ctx.fillText('POINTS', 64, 372)

  ctx.font = 'bold 34px "Courier New", monospace'
  ctx.fillStyle = PALETTE.cream
  wrapText(
    ctx,
    `I stacked ${itemsStacked} item${itemsStacked === 1 ? '' : 's'} before the wheelbarrow tipped!`,
    64,
    460,
    620,
    42,
  )

  ctx.font = '24px "Courier New", monospace'
  ctx.fillStyle = PALETTE.sand
  ctx.fillText('Can you beat it? Play KEEP the Wheelbarrow', 64, 590)

  return canvas.toDataURL('image/png')
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ')
  let line = ''
  let cy = y
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cy)
      line = word
      cy += lineHeight
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, cy)
}

export function shareText(score: number, itemsStacked: number) {
  return `I stacked ${itemsStacked} items (${score} points) before the wheelbarrow tipped in KEEP the Wheelbarrow! 🦁🛒`
}

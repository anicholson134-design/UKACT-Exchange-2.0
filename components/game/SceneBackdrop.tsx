'use client'

import { useEffect, useRef } from 'react'
import { GAME_W, GAME_H, GROUND_Y, BARROW_CENTER_X } from '@/lib/game/engine'
import { drawBackground, beginBarrowTransform, drawWheelbarrowShape, endBarrowTransform } from '@/lib/game/render'

/** Static zoo-scene + wheelbarrow backdrop used behind the menu screens. */
export function SceneBackdrop({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.imageSmoothingEnabled = false

    let raf = 0
    let start = performance.now()
    function frame(now: number) {
      const t = reducedMotion ? 0 : now - start
      ctx!.clearRect(0, 0, GAME_W, GAME_H)
      drawBackground(ctx!, 0, t)
      const angle = reducedMotion ? 0 : Math.sin(t / 1400) * 0.03
      beginBarrowTransform(ctx!, BARROW_CENTER_X, GROUND_Y, angle)
      drawWheelbarrowShape(ctx!)
      endBarrowTransform(ctx!)
      if (!reducedMotion) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [reducedMotion])

  return (
    <canvas
      ref={canvasRef}
      width={GAME_W}
      height={GAME_H}
      className="absolute inset-0 w-full h-full pixelated"
      aria-hidden="true"
    />
  )
}

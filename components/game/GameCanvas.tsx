'use client'

import { useEffect, useRef } from 'react'
import {
  WheelbarrowEngine,
  GAME_W,
  GAME_H,
  GROUND_Y,
  BARROW_CENTER_X,
  SPAWN_Y,
  type GameEvent,
} from '@/lib/game/engine'
import { drawBackground, beginBarrowTransform, drawWheelbarrowShape, endBarrowTransform } from '@/lib/game/render'
import { drawSprite } from '@/lib/game/sprites'
import { PALETTE } from '@/lib/game/palette'
import { RetroAudio } from '@/lib/game/audio'
import type { GameSettings } from '@/lib/game/storage'

interface Particle {
  kind: 'dust' | 'popup' | 'confetti'
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  text?: string
  color?: string
}

export interface GameOverResult {
  score: number
  itemsStacked: number
  best: number
}

interface GameCanvasProps {
  best: number
  settings: GameSettings
  audio: RetroAudio
  onGameOver: (result: GameOverResult) => void
  onStatsChange?: (stats: { score: number; itemsStacked: number; level: number }) => void
}

export function GameCanvas({ best, settings, audio, onGameOver, onStatsChange }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<WheelbarrowEngine | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const keysRef = useRef<Set<string>>(new Set())
  const dropRequestedRef = useRef(false)
  const draggingRef = useRef(false)
  const gameOverFiredRef = useRef(false)
  const tippedElapsedRef = useRef(0)

  const scoreRef = useRef<HTMLSpanElement>(null)
  const bestRef = useRef<HTMLSpanElement>(null)
  const levelRef = useRef<HTMLSpanElement>(null)
  const settingsRef = useRef(settings)
  settingsRef.current = settings

  useEffect(() => {
    if (!engineRef.current) engineRef.current = new WheelbarrowEngine(best)
    const engine = engineRef.current
    engine.reset(best)
    gameOverFiredRef.current = false
    tippedElapsedRef.current = 0
    particlesRef.current = []

    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    function worldXFromClient(clientX: number) {
      const rect = canvas.getBoundingClientRect()
      const ratio = (clientX - rect.left) / rect.width
      return ratio * GAME_W
    }

    function onPointerMove(e: PointerEvent) {
      if (e.pointerType !== 'mouse' && !draggingRef.current) return
      engine.setAimX(worldXFromClient(e.clientX))
    }
    function onPointerDown(e: PointerEvent) {
      audio.ensureContext()
      if (e.pointerType === 'mouse') {
        engine.setAimX(worldXFromClient(e.clientX))
        dropRequestedRef.current = true
      } else {
        draggingRef.current = true
        engine.setAimX(worldXFromClient(e.clientX))
      }
    }
    function onPointerUp(e: PointerEvent) {
      if (e.pointerType !== 'mouse' && draggingRef.current) {
        draggingRef.current = false
        dropRequestedRef.current = true
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') keysRef.current.add(e.key)
      if (e.key === ' ' || e.code === 'Space') {
        audio.ensureContext()
        if (!e.repeat) dropRequestedRef.current = true
        e.preventDefault()
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      keysRef.current.delete(e.key)
    }

    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    let raf = 0
    let lastTime = performance.now()

    function spawnDust(x: number, y: number, count: number) {
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          kind: 'dust',
          x: x + (Math.random() - 0.5) * 16,
          y,
          vx: (Math.random() - 0.5) * 30,
          vy: -Math.random() * 20,
          life: 0,
          maxLife: 350 + Math.random() * 150,
          color: PALETTE.sand,
        })
      }
    }

    function spawnPopup(x: number, y: number, text: string, color: string) {
      particlesRef.current.push({
        kind: 'popup',
        x,
        y,
        vx: 0,
        vy: -22,
        life: 0,
        maxLife: 900,
        text,
        color,
      })
    }

    function spawnConfetti(x: number, y: number) {
      const colors = [PALETTE.gold, PALETTE.sage, PALETTE.red, PALETTE.water, PALETTE.goldLight]
      const count = settingsRef.current.reducedMotion ? 6 : 18
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          kind: 'confetti',
          x,
          y,
          vx: (Math.random() - 0.5) * 90,
          vy: -60 - Math.random() * 60,
          life: 0,
          maxLife: 900 + Math.random() * 400,
          color: colors[i % colors.length],
        })
      }
    }

    function handleEvents(events: GameEvent[]) {
      for (const ev of events) {
        switch (ev.type) {
          case 'land':
            audio.drop()
            if (ev.x !== undefined && ev.y !== undefined) {
              spawnDust(ev.x, ev.y - engine.cameraY, 6)
              spawnPopup(ev.x, ev.y - engine.cameraY, `+${ev.points}`, PALETTE.forest)
            }
            break
          case 'rare':
            audio.rare()
            if (ev.x !== undefined && ev.y !== undefined) spawnConfetti(ev.x, ev.y - engine.cameraY)
            break
          case 'milestone':
            audio.milestone()
            if (ev.x !== undefined && ev.y !== undefined) {
              spawnPopup(ev.x, (ev.y ?? 0) - engine.cameraY - 14, `+${ev.points} BONUS`, PALETTE.gold)
              spawnConfetti(ev.x, ev.y - engine.cameraY)
            }
            break
          case 'newBest':
            audio.rare()
            if (ev.x !== undefined && ev.y !== undefined) {
              spawnPopup(ev.x, (ev.y ?? 0) - engine.cameraY - 26, `+${ev.points} NEW BEST!`, PALETTE.red)
            }
            break
          case 'warning':
            audio.wobble()
            break
          case 'tipping':
            audio.creak()
            break
          case 'recovered':
            audio.point()
            break
          case 'miss':
            audio.bounce()
            break
          case 'gameover':
            audio.gameOver()
            break
        }
      }
    }

    function updateParticles(dtMs: number) {
      const dt = dtMs / 1000
      for (const p of particlesRef.current) {
        p.life += dtMs
        p.x += p.vx * dt
        p.y += p.vy * dt
        if (p.kind === 'confetti') p.vy += 160 * dt
        if (p.kind === 'dust') p.vy += 60 * dt
      }
      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife)
    }

    function drawParticles() {
      for (const p of particlesRef.current) {
        const t = p.life / p.maxLife
        const alpha = 1 - t
        ctx.globalAlpha = Math.max(0, alpha)
        if (p.kind === 'dust') {
          ctx.fillStyle = p.color!
          ctx.fillRect(Math.round(p.x), Math.round(p.y), 3, 3)
        } else if (p.kind === 'confetti') {
          ctx.fillStyle = p.color!
          ctx.fillRect(Math.round(p.x), Math.round(p.y), 4, 4)
        } else if (p.kind === 'popup') {
          ctx.font = 'bold 9px monospace'
          ctx.textAlign = 'center'
          ctx.lineWidth = 2
          ctx.strokeStyle = PALETTE.cream
          ctx.strokeText(p.text!, p.x, p.y)
          ctx.fillStyle = p.color!
          ctx.fillText(p.text!, p.x, p.y)
        }
      }
      ctx.globalAlpha = 1
    }

    function draw() {
      ctx.clearRect(0, 0, GAME_W, GAME_H)
      ctx.imageSmoothingEnabled = false

      ctx.save()
      if (!settingsRef.current.reducedMotion && engine.shake > 0) {
        const s = engine.shake * 3
        ctx.translate((Math.random() - 0.5) * s, (Math.random() - 0.5) * s)
      }

      drawBackground(ctx, engine.cameraY, performance.now())

      const pivotX = BARROW_CENTER_X
      const pivotY = GROUND_Y - engine.cameraY
      beginBarrowTransform(ctx, pivotX, pivotY, engine.tiltAngle)
      drawWheelbarrowShape(ctx)
      for (const p of engine.placed) {
        drawSprite(ctx, p.item.sprite, p.x - pivotX - p.w / 2, p.topY - GROUND_Y, p.item.scale)
      }
      endBarrowTransform(ctx)

      // Falling / aiming item — not affected by barrow tilt, still mid-air.
      if (engine.status === 'aiming' || engine.status === 'falling') {
        const item = engine.current
        const w = item.sprite.w * item.scale
        const h = item.sprite.h * item.scale
        const topY = (engine.status === 'aiming' ? SPAWN_Y : engine.fallY) - engine.cameraY
        drawSprite(ctx, item.sprite, engine.aimX - w / 2, topY, item.scale)
        if (item.rare) {
          ctx.strokeStyle = PALETTE.gold
          ctx.lineWidth = 1
          ctx.strokeRect(engine.aimX - w / 2 - 2, topY - 2, w + 4, h + 4)
        }
        // Aim guide line down to the barrow.
        ctx.strokeStyle = 'rgba(28,43,30,0.25)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(engine.aimX, topY + h)
        ctx.lineTo(engine.aimX, GROUND_Y - engine.cameraY)
        ctx.stroke()
      }

      drawParticles()

      if (engine.shake > 0.3) {
        ctx.fillStyle = `rgba(122, 44, 29, ${(engine.shake - 0.3) * 0.25})`
        ctx.fillRect(0, 0, GAME_W, GAME_H)
      }

      ctx.restore()
    }

    function frame(now: number) {
      const dtMs = Math.min(50, now - lastTime)
      lastTime = now

      if (engine.status !== 'tipped') {
        if (engine.status === 'aiming') {
          if (keysRef.current.has('ArrowLeft')) engine.nudgeAim(-1, dtMs)
          if (keysRef.current.has('ArrowRight')) engine.nudgeAim(1, dtMs)
        }
        const dropRequested = dropRequestedRef.current
        dropRequestedRef.current = false
        engine.update(dtMs, { dropRequested })
        handleEvents(engine.drainEvents())
      } else {
        engine.update(dtMs, {})
        handleEvents(engine.drainEvents())
        tippedElapsedRef.current += dtMs
      }

      updateParticles(dtMs)
      draw()

      if (scoreRef.current) scoreRef.current.textContent = String(engine.score)
      if (bestRef.current) bestRef.current.textContent = String(Math.max(best, engine.score))
      if (levelRef.current) levelRef.current.textContent = String(engine.level + 1)
      onStatsChange?.({ score: engine.score, itemsStacked: engine.itemsStacked, level: engine.level })

      if (engine.status === 'tipped' && tippedElapsedRef.current > 900 && !gameOverFiredRef.current) {
        gameOverFiredRef.current = true
        onGameOver({ score: engine.score, itemsStacked: engine.itemsStacked, best: Math.max(best, engine.score) })
        return
      }

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-full select-none">
      <canvas
        ref={canvasRef}
        width={GAME_W}
        height={GAME_H}
        className="w-full h-full touch-none"
        style={{ imageRendering: 'pixelated' }}
        role="img"
        aria-label="UKACT the Wheelbarrow gameplay area"
      />
      <div className="pointer-events-none absolute inset-0 flex items-start justify-between p-2 sm:p-3 font-pixel text-[8px] sm:text-[10px]">
        <div className="glass rounded px-2 py-1 text-cream">
          <div className="opacity-70">SCORE</div>
          <span ref={scoreRef}>0</span>
        </div>
        <div className="glass rounded px-2 py-1 text-cream text-right">
          <div className="opacity-70">BEST</div>
          <span ref={bestRef}>{best}</span>
        </div>
      </div>
      <div className="pointer-events-none absolute top-1 left-1/2 -translate-x-1/2 font-pixel text-[7px] sm:text-[8px] text-cream/80">
        LV <span ref={levelRef}>1</span>
      </div>
    </div>
  )
}

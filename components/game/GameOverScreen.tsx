'use client'

import { useState } from 'react'
import { PixelButton } from './PixelButton'
import { SceneBackdrop } from './SceneBackdrop'
import { generateShareCard, shareText } from '@/lib/game/shareCard'

interface GameOverScreenProps {
  score: number
  itemsStacked: number
  best: number
  isNewBest: boolean
  reducedMotion: boolean
  onPlayAgain: () => void
  onTitle: () => void
}

export function GameOverScreen({ score, itemsStacked, best, isNewBest, reducedMotion, onPlayAgain, onTitle }: GameOverScreenProps) {
  const [shareOpen, setShareOpen] = useState(false)
  const [shareImg, setShareImg] = useState<string | null>(null)
  const [copyLabel, setCopyLabel] = useState('COPY SCORE TEXT')
  const [generating, setGenerating] = useState(false)

  async function openShare() {
    setShareOpen(true)
    setGenerating(true)
    try {
      const dataUrl = await generateShareCard(score, itemsStacked)
      setShareImg(dataUrl)
    } finally {
      setGenerating(false)
    }
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(shareText(score, itemsStacked))
      setCopyLabel('COPIED!')
      setTimeout(() => setCopyLabel('COPY SCORE TEXT'), 1800)
    } catch {
      setCopyLabel('COPY FAILED')
      setTimeout(() => setCopyLabel('COPY SCORE TEXT'), 1800)
    }
  }

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-forest">
      <SceneBackdrop reducedMotion={reducedMotion} />
      <div className="absolute inset-0 bg-forest/80" />

      <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center max-w-xs">
        <h1 className="font-pixel text-red text-lg drop-shadow-[3px_3px_0_rgba(0,0,0,0.6)]">GAME OVER</h1>
        <p className="font-pixel text-[9px] text-cream/90">Your shift has ended!</p>

        {isNewBest && (
          <p className="font-pixel text-[10px] text-gold-light animate-pulse">★ NEW BEST SCORE! ★</p>
        )}

        <div className="border-4 border-cream bg-canopy px-5 py-4 w-full space-y-2">
          <Row label="ITEMS STACKED" value={itemsStacked} />
          <Row label="FINAL SCORE" value={score} />
          <Row label="BEST SCORE" value={best} />
        </div>

        <div className="flex flex-col gap-3 w-56 mt-2">
          <PixelButton tone="gold" onClick={onPlayAgain} autoFocus>
            ↻ PLAY AGAIN
          </PixelButton>
          <PixelButton tone="sage" onClick={openShare}>
            SHARE SCORE
          </PixelButton>
          <PixelButton tone="stone" onClick={onTitle}>
            TITLE SCREEN
          </PixelButton>
        </div>
      </div>

      {shareOpen && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-forest/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-title"
        >
          <div className="max-w-sm w-full border-4 border-cream bg-canopy p-4 shadow-[6px_6px_0_0_rgba(15,15,14,0.8)]">
            <h2 id="share-title" className="font-pixel text-cream text-xs mb-3 text-center">
              SHARE YOUR SCORE
            </h2>
            <div className="bg-black/30 aspect-[1200/630] w-full mb-4 flex items-center justify-center overflow-hidden border border-cream/30">
              {generating || !shareImg ? (
                <span className="font-pixel text-[8px] text-cream/70">Generating card&hellip;</span>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={shareImg} alt="Shareable score card" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <PixelButton tone="gold" onClick={copyText}>
                {copyLabel}
              </PixelButton>
              {shareImg && (
                <a href={shareImg} download="keep-wheelbarrow-score.png">
                  <PixelButton tone="sage" className="w-full">
                    DOWNLOAD IMAGE
                  </PixelButton>
                </a>
              )}
              <PixelButton tone="stone" onClick={() => setShareOpen(false)}>
                CLOSE
              </PixelButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between font-pixel text-[9px] text-cream">
      <span className="text-cream/70">{label}</span>
      <span className="text-gold-light">{value}</span>
    </div>
  )
}

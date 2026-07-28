'use client'

import Image from 'next/image'
import { PixelButton } from './PixelButton'
import { SceneBackdrop } from './SceneBackdrop'

interface TitleScreenProps {
  onPlay: () => void
  onHowToPlay: () => void
  onLeaderboard: () => void
  onToggleMute: () => void
  muted: boolean
  reducedMotion: boolean
  best: number
}

export function TitleScreen({ onPlay, onHowToPlay, onLeaderboard, onToggleMute, muted, reducedMotion, best }: TitleScreenProps) {
  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-forest">
      <SceneBackdrop reducedMotion={reducedMotion} />
      <div className="absolute inset-0 bg-gradient-to-b from-forest/70 via-forest/30 to-forest/80" />

      <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center">
        <Image src="/keep-logo.webp" alt="KEEP" width={72} height={72} className="drop-shadow-lg" />

        <h1 className="font-pixel text-cream text-lg sm:text-2xl leading-relaxed drop-shadow-[3px_3px_0_rgba(0,0,0,0.6)]">
          KEEP
          <br />
          the Wheelbarrow
        </h1>

        {best > 0 && (
          <p className="font-pixel text-[9px] sm:text-xs text-gold-light">BEST: {best}</p>
        )}

        <div className="flex flex-col gap-3 w-56 mt-2">
          <PixelButton tone="gold" onClick={onPlay} autoFocus>
            ▶ PLAY
          </PixelButton>
          <PixelButton tone="sage" onClick={onHowToPlay}>
            HOW TO PLAY
          </PixelButton>
          <PixelButton tone="stone" onClick={onLeaderboard}>
            LEADERBOARD
          </PixelButton>
          <PixelButton tone="stone" onClick={onToggleMute} aria-pressed={muted}>
            {muted ? '🔇 MUTED' : '🔊 SOUND ON'}
          </PixelButton>
        </div>

        <p className="font-pixel text-[7px] sm:text-[8px] text-cream/70 mt-2 max-w-xs">
          A KEEP zookeeper marketing mini-game
        </p>
      </div>
    </div>
  )
}

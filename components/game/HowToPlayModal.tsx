'use client'

import { PixelButton } from './PixelButton'
import type { GameSettings } from '@/lib/game/storage'

interface HowToPlayModalProps {
  onClose: () => void
  settings: GameSettings
  onSettingsChange: (settings: GameSettings) => void
}

export function HowToPlayModal({ onClose, settings, onSettingsChange }: HowToPlayModalProps) {
  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center bg-forest/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="howtoplay-title"
    >
      <div className="max-w-sm w-full border-4 border-cream bg-canopy p-5 shadow-[6px_6px_0_0_rgba(15,15,14,0.8)]">
        <h2 id="howtoplay-title" className="font-pixel text-cream text-sm mb-4 text-center">
          HOW TO PLAY
        </h2>
        <p className="font-pixel text-[9px] leading-6 text-cream/90 mb-4">
          You are a zoo keeper preparing supplies.
          <br />
          <br />
          Stack as many items as possible onto the wheelbarrow.
          <br />
          <br />
          Be careful&hellip;
          <br />
          <br />
          If the wheelbarrow tips over, your shift is over!
        </p>
        <div className="font-pixel text-[8px] text-gold-light leading-6 mb-5 space-y-1">
          <p>DESKTOP: mouse to aim, click to drop</p>
          <p>MOBILE: drag to aim, release to drop</p>
          <p>KEYBOARD: ← → to aim, SPACE to drop</p>
        </div>
        <div className="font-pixel text-[8px] text-cream/90 space-y-2 mb-5 border-t-2 border-cream/20 pt-4">
          <p className="text-gold-light">ACCESSIBILITY</p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => onSettingsChange({ ...settings, reducedMotion: e.target.checked })}
              className="w-4 h-4"
            />
            Reduce motion (shake &amp; confetti)
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.scanlines}
              onChange={(e) => onSettingsChange({ ...settings, scanlines: e.target.checked })}
              className="w-4 h-4"
            />
            CRT scanline effect
          </label>
        </div>

        <PixelButton tone="gold" className="w-full" onClick={onClose} autoFocus>
          GOT IT
        </PixelButton>
      </div>
    </div>
  )
}

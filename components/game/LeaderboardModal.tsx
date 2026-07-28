'use client'

import { PixelButton } from './PixelButton'
import type { LeaderboardEntry } from '@/lib/game/storage'

export function LeaderboardModal({ entries, onClose }: { entries: LeaderboardEntry[]; onClose: () => void }) {
  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center bg-forest/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leaderboard-title"
    >
      <div className="max-w-sm w-full border-4 border-cream bg-canopy p-5 shadow-[6px_6px_0_0_rgba(15,15,14,0.8)]">
        <h2 id="leaderboard-title" className="font-pixel text-cream text-sm mb-4 text-center">
          LOCAL LEADERBOARD
        </h2>

        {entries.length === 0 ? (
          <p className="font-pixel text-[9px] text-cream/80 text-center mb-5">
            No runs yet — play a shift to set your first score!
          </p>
        ) : (
          <ol className="font-pixel text-[9px] text-cream/90 space-y-2 mb-5">
            {entries.map((e, i) => (
              <li key={i} className="flex justify-between border-b border-cream/20 pb-2">
                <span className="text-gold-light">#{i + 1}</span>
                <span>{e.score} pts</span>
                <span className="text-cream/60">{e.itemsStacked} items</span>
              </li>
            ))}
          </ol>
        )}

        <PixelButton tone="gold" className="w-full" onClick={onClose} autoFocus>
          CLOSE
        </PixelButton>
      </div>
    </div>
  )
}

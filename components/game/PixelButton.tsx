'use client'

import { ButtonHTMLAttributes } from 'react'

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: 'gold' | 'sage' | 'stone'
}

const TONES: Record<string, string> = {
  gold: 'bg-gold text-forest border-forest hover:bg-gold-light',
  sage: 'bg-sage text-forest border-forest hover:brightness-105',
  stone: 'bg-stone text-forest border-forest hover:brightness-105',
}

/** A chunky, pixel-bordered retro arcade button — used across the game's menus. */
export function PixelButton({ tone = 'gold', className = '', children, ...props }: PixelButtonProps) {
  return (
    <button
      className={`font-pixel text-[10px] sm:text-xs px-4 py-3 border-4 ${TONES[tone]} shadow-[4px_4px_0_0_rgba(26,26,24,0.9)] active:shadow-[1px_1px_0_0_rgba(26,26,24,0.9)] active:translate-x-[3px] active:translate-y-[3px] transition-none disabled:opacity-50 disabled:pointer-events-none ${className}`}
      style={{ imageRendering: 'pixelated' }}
      {...props}
    >
      {children}
    </button>
  )
}

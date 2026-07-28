import type { Metadata } from 'next'
import { Press_Start_2P } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import { WheelbarrowGame } from '@/components/game/WheelbarrowGame'

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'UKACT the Wheelbarrow — a retro animal care mini-game',
  description:
    "Stack buckets, hay bales and UKACT crates onto the wheelbarrow without tipping it over. A free retro arcade mini-game from UKACT, UK Animal Care Technicians.",
  robots: { index: true, follow: true },
}

export default function GamePage() {
  return (
    <div className={`${pixelFont.variable} min-h-screen bg-ink flex flex-col items-center justify-center gap-3 py-4 px-2`}>
      <Link
        href="/"
        className="font-pixel text-[8px] sm:text-[9px] text-cream/70 hover:text-gold-light flex items-center gap-2"
      >
        <Image src="/UKACT-1536x730.jpg" alt="" width={20} height={20} aria-hidden="true" />
        BACK TO UKACT
      </Link>

      <div className="w-full max-w-[440px] aspect-[220/380] max-h-[85vh] border-4 border-cream/80 shadow-[0_0_0_4px_rgba(15,15,14,0.9),8px_8px_0_0_rgba(0,0,0,0.5)] overflow-hidden">
        <WheelbarrowGame />
      </div>

      <p className="font-pixel text-[7px] text-cream/40 text-center max-w-xs">
        Local high scores only — no data leaves your browser.
      </p>
    </div>
  )
}

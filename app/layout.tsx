import type { Metadata } from 'next'
import { Inter, Playfair_Display, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ukact.keeperexchange.org'),
  title: { default: 'UKACT Exchange – UK Animal Care Technicians', template: '%s | UKACT Exchange' },
  description: 'The national network for UK Animal Care Technicians. Connecting staff across animal management colleges and farm schools to share best practice and raise welfare standards.',
  robots: { index: false, follow: false },
  icons: {
    icon: '/UKACT-1536x730.jpg',
    apple: '/UKACT-1536x730.jpg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-cream text-ink antialiased">
        {children}
        <Toaster richColors position="top-right" />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-DN7KWZSHP4" strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DN7KWZSHP4');
          `}
        </Script>
      </body>
    </html>
  )
}

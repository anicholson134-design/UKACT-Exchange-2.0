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
  title: { default: 'KEEP – Zookeeper Exchange Programme', template: '%s | KEEP' },
  description: "The UK's first official Zookeeper Exchange Programme. Connecting keepers with collections worldwide to develop skills and advance conservation.",
  robots: { index: false, follow: false },
  icons: {
    icon: '/keep-logo.webp',
    apple: '/keep-logo.webp',
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

import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LPK Kairouan — Vie scolaire, séries et photos de classes',
  description: 'Portail officiel du Lycée Pilote de Kairouan : annonces de la direction, séries, devoirs, emplois du temps et photos de classes.',
  keywords: ['Lycée Pilote Kairouan', 'séries devoirs Kairouan', 'emploi du temps', 'photos de classe', 'vie scolaire Tunisie'],
  openGraph: {
    title: 'LPK Kairouan — Vie scolaire et ressources pédagogiques',
    description: 'Retrouvez les annonces, ressources, emplois du temps et photos de la communauté scolaire.',
    type: 'website',
    locale: 'fr_TN',
  },
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

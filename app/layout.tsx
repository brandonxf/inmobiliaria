import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'InmoGestión - Sistema Inmobiliario',
  description: 'Plataforma integral de gestión inmobiliaria para la venta y administración de lotes residenciales.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icono.png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icono.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#8B5E3C',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        {children}
        <Toaster richColors position="top-right" />
        <Analytics />
      </body>
    </html>
  )
}

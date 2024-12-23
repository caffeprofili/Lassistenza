import type { Metadata } from 'next'
import { Raleway as FontSans } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Toaster } from 'sonner'
import { Navigation } from '@/components/extensive/navigation'
import { Reliability } from '@/components/extensive/reliability'
import { Footer } from '@/components/extensive/footer'
import { LatestProductsSection } from '@/components/modules/products/latest-products'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})
export const metadata: Metadata = {
  title: "L'Assistenza",
  description: "L'Assistenza - Vendita attrezzature usate, sicure e garantite",
}

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it">
      <body
        suppressHydrationWarning={true}
        className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}
      >
        <Navigation />
        <NuqsAdapter>{children}</NuqsAdapter>
        <LatestProductsSection />
        <Reliability />
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}

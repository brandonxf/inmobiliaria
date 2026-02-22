import { Navbar } from '@/components/landing/navbar'
import { HeroSection } from '@/components/landing/hero-section'
import { StagesSection } from '@/components/landing/stages-section'
import { LotsSection } from '@/components/landing/lots-section'
import { Footer } from '@/components/landing/footer'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StagesSection />
        <LotsSection />
      </main>
      <Footer />
    </div>
  )
}

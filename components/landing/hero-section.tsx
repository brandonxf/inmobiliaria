import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, MapPin, Shield, TrendingUp } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/hero-bg.jpg"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/70" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 md:py-36">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground/90 backdrop-blur-sm">
            <MapPin className="h-3.5 w-3.5" />
            Proyecto residencial exclusivo
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-primary-foreground md:text-5xl lg:text-6xl text-balance">
            Tu lote ideal para construir el hogar de tus suenos
          </h1>

          <p className="mb-8 max-w-lg text-lg leading-relaxed text-primary-foreground/80">
            Lotes residenciales desde 100m2 en un proyecto urbanistico planificado con
            zonas verdes, vias pavimentadas y todos los servicios.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/registro">
              <Button size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                Comenzar ahora
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#lotes">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Ver lotes disponibles
              </Button>
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { icon: MapPin, label: 'Lotes disponibles', value: '10+' },
            { icon: Shield, label: 'Escrituras al dia', value: '100%' },
            { icon: TrendingUp, label: 'Valorizacion anual', value: '12%' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-5 backdrop-blur-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/80">
                <stat.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-sm text-primary-foreground/70">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

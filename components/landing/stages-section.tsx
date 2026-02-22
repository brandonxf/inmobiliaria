import { getDb } from '@/lib/db'
import { CheckCircle2, Circle, Clock } from 'lucide-react'

export async function StagesSection() {
  const sql = getDb()
  const etapas = await sql`SELECT * FROM etapas ORDER BY orden ASC`

  return (
    <section id="etapas" className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-foreground text-balance">
            Etapas del Proyecto
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground leading-relaxed">
            Nuestro proyecto avanza de forma planificada, garantizando calidad en cada fase del desarrollo urbanistico.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 hidden h-full w-0.5 bg-border md:left-1/2 md:block" />

          <div className="flex flex-col gap-8">
            {etapas.map((etapa, index) => {
              const isActive = etapa.activa
              const isPast = index < etapas.findIndex((e: { activa: boolean }) => e.activa)

              return (
                <div
                  key={etapa.id}
                  className={`relative flex flex-col gap-4 md:flex-row ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } md:items-center`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div
                      className={`rounded-xl border p-6 transition-all ${
                        isActive
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border bg-card'
                      }`}
                    >
                      <div className={`mb-1 text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                        Etapa {etapa.orden}
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-card-foreground">{etapa.nombre}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{etapa.descripcion}</p>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-6 top-6 hidden h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-background md:left-1/2 md:flex">
                    {isPast ? (
                      <CheckCircle2 className="h-6 w-6 text-accent" />
                    ) : isActive ? (
                      <Clock className="h-6 w-6 text-primary" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground/40" />
                    )}
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="hidden flex-1 md:block" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

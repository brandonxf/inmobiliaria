import { getDb } from '@/lib/db'
import { formatCurrency } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Maximize2 } from 'lucide-react'
import Link from 'next/link'

export async function LotsSection() {
  const sql = getDb()
  const lotes = await sql`
    SELECT l.*, e.nombre as etapa_nombre 
    FROM lotes l 
    LEFT JOIN etapas e ON l.etapa_id = e.id 
    WHERE l.estado = 'disponible' 
    ORDER BY l.codigo ASC 
    LIMIT 6
  `

  return (
    <section id="lotes" className="bg-secondary/30 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-foreground text-balance">
            Lotes Disponibles
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground leading-relaxed">
            Encuentra el lote perfecto para tu proyecto. Todos los lotes cuentan con servicios publicos y vias de acceso.
          </p>
        </div>

        {lotes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay lotes disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lotes.map((lote) => (
              <Card key={lote.id} className="group overflow-hidden transition-shadow hover:shadow-md">
                <div className="relative h-48 bg-muted">
                  {lote.imagen_url ? (
                    <img src={lote.imagen_url} alt={`Lote ${lote.codigo}`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <MapPin className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                  <Badge className="absolute right-3 top-3 bg-accent text-accent-foreground">
                    Disponible
                  </Badge>
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-card-foreground">Lote {lote.codigo}</h3>
                    {lote.etapa_nombre && (
                      <span className="text-xs text-muted-foreground">{lote.etapa_nombre}</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pb-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Maximize2 className="h-4 w-4" />
                      {Number(lote.area_m2)} m2
                    </div>
                    {lote.ubicacion && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {lote.ubicacion}
                      </div>
                    )}
                    <p className="mt-1 text-2xl font-bold text-primary">
                      {formatCurrency(Number(lote.valor))}
                    </p>
                  </div>
                </CardContent>

                <CardFooter>
                  <Link href="/registro" className="w-full">
                    <Button className="w-full" variant="outline">
                      Me interesa
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

import { getDb } from '@/lib/db'
import { formatCurrency } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MapPin, Maximize2, Sofa, Waves } from 'lucide-react'
import { getEstadoLabel, getEstadoColor } from '@/lib/format'
import { VerLoteDialog } from '@/components/dashboard/ver-lote-dialog'

export default async function LotesPage() {
  const sql = getDb()
  const lotes = await sql`
    SELECT l.*, e.nombre as etapa_nombre 
    FROM lotes l 
    LEFT JOIN etapas e ON l.etapa_id = e.id 
    ORDER BY l.codigo ASC
  `

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Lotes</h1>
        <p className="text-muted-foreground">Explora los lotes disponibles en el proyecto.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lotes.map((lote) => (
          <Card key={lote.id} className="overflow-hidden flex flex-col">
            {/* Imagen */}
            <div className="relative h-40 bg-muted">
              {lote.foto_url ? (
                <img src={lote.foto_url} alt={`Lote ${lote.codigo}`} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <MapPin className="h-10 w-10 text-muted-foreground/30" />
                </div>
              )}
              <Badge className={`absolute right-3 top-3 ${getEstadoColor(lote.estado)}`}>
                {getEstadoLabel(lote.estado)}
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

            <CardContent className="flex-1 flex flex-col gap-3">
              {/* Características principales */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Maximize2 className="h-4 w-4 text-muted-foreground" />
                  <span>{Number(lote.area_m2)} m²</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sofa className="h-4 w-4 text-muted-foreground" />
                  <span>{lote.cuartos} cuartos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Waves className="h-4 w-4 text-muted-foreground" />
                  <span>{lote.baños} baños</span>
                </div>
              </div>

              {lote.ubicacion && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {lote.ubicacion}
                </div>
              )}

              {/* Precio */}
              <p className="text-xl font-bold text-primary mt-2">
                {formatCurrency(Number(lote.valor))}
              </p>

              {lote.descripcion && (
                <p className="text-sm text-muted-foreground line-clamp-2">{lote.descripcion}</p>
              )}

              {/* Botón Ver Información */}
              <div className="mt-auto pt-2">
                <VerLoteDialog lote={lote} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

import { getDb } from '@/lib/db'
import { formatCurrency } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MapPin, Maximize2 } from 'lucide-react'
import { getEstadoLabel, getEstadoColor } from '@/lib/format'

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
          <Card key={lote.id} className="overflow-hidden">
            <div className="relative h-40 bg-muted">
              {lote.imagen_url ? (
                <img src={lote.imagen_url} alt={`Lote ${lote.codigo}`} className="h-full w-full object-cover" />
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
            <CardContent>
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
                <p className="mt-1 text-xl font-bold text-primary">
                  {formatCurrency(Number(lote.valor))}
                </p>
                {lote.descripcion && (
                  <p className="text-sm text-muted-foreground">{lote.descripcion}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

import { getDb } from '@/lib/db'
import { formatDate, getEstadoLabel, getEstadoColor, getPqrsTypeLabel } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponderPqrsForm } from '@/components/admin/responder-pqrs-form'

export default async function AdminPqrsPage() {
  const sql = getDb()
  const pqrs = await sql`
    SELECT pq.*, u.nombre, u.apellido, u.email
    FROM pqrs pq
    JOIN usuarios u ON pq.cliente_id = u.id
    ORDER BY 
      CASE WHEN pq.estado = 'pendiente' THEN 0 WHEN pq.estado = 'en_proceso' THEN 1 ELSE 2 END,
      pq.created_at DESC
  `

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">PQRS</h1>
        <p className="text-muted-foreground">Gestiona las peticiones, quejas, reclamos y sugerencias.</p>
      </div>

      {pqrs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No hay PQRS registradas.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {pqrs.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{getPqrsTypeLabel(item.tipo)}</Badge>
                    <CardTitle className="text-base">{item.asunto}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getEstadoColor(item.estado)}>{getEstadoLabel(item.estado)}</Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.nombre} {item.apellido} ({item.email}) - {formatDate(item.created_at)}
                </p>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{item.descripcion}</p>

                {item.respuesta && (
                  <div className="mb-4 rounded-lg border border-border bg-muted/50 p-4">
                    <p className="mb-1 text-xs font-medium text-foreground">Respuesta actual:</p>
                    <p className="text-sm text-muted-foreground">{item.respuesta}</p>
                  </div>
                )}

                {item.estado !== 'cerrado' && (
                  <ResponderPqrsForm pqrsId={item.id} currentRespuesta={item.respuesta || ''} />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

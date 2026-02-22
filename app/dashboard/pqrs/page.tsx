import { getSession } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { redirect } from 'next/navigation'
import { formatDate, getEstadoLabel, getEstadoColor, getPqrsTypeLabel } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PqrsForm } from '@/components/dashboard/pqrs-form'

export default async function PqrsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const sql = getDb()
  const pqrs = await sql`
    SELECT * FROM pqrs WHERE cliente_id = ${session.userId} ORDER BY created_at DESC
  `

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">PQRS</h1>
        <p className="text-muted-foreground">Peticiones, Quejas, Reclamos y Sugerencias.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <PqrsForm />
        </div>

        <div className="lg:col-span-2">
          <div className="flex flex-col gap-4">
            {pqrs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No has creado PQRS aun.</p>
                </CardContent>
              </Card>
            ) : (
              pqrs.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{getPqrsTypeLabel(item.tipo)}</Badge>
                        <CardTitle className="text-base">{item.asunto}</CardTitle>
                      </div>
                      <Badge className={getEstadoColor(item.estado)}>
                        {getEstadoLabel(item.estado)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{formatDate(item.created_at)}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.descripcion}</p>
                    {item.respuesta && (
                      <div className="mt-4 rounded-lg border border-border bg-muted/50 p-4">
                        <p className="mb-1 text-xs font-medium text-foreground">Respuesta:</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.respuesta}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

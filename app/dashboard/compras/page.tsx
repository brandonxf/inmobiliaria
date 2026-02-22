import { getSession } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { redirect } from 'next/navigation'
import { formatCurrency, formatDate, getEstadoLabel, getEstadoColor } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export default async function ComprasPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const sql = getDb()
  const compras = await sql`
    SELECT c.*, l.codigo as lote_codigo, l.ubicacion as lote_ubicacion,
      (SELECT COALESCE(SUM(monto), 0) FROM pagos WHERE compra_id = c.id AND estado = 'aprobado') as total_pagado
    FROM compras c
    JOIN lotes l ON c.lote_id = l.id
    WHERE c.cliente_id = ${session.userId}
    ORDER BY c.fecha_compra DESC
  `

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Mis Compras</h1>
        <p className="text-muted-foreground">Seguimiento de tus compras de lotes y estado de pagos.</p>
      </div>

      {compras.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No tienes compras registradas aun.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {compras.map((compra) => {
            const totalPagado = Number(compra.total_pagado)
            const valorTotal = Number(compra.valor_total)
            const porcentaje = valorTotal > 0 ? Math.round((totalPagado / valorTotal) * 100) : 0

            return (
              <Card key={compra.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Lote {compra.lote_codigo}
                    </CardTitle>
                    <Badge className={getEstadoColor(compra.estado)}>
                      {getEstadoLabel(compra.estado)}
                    </Badge>
                  </div>
                  {compra.lote_ubicacion && (
                    <p className="text-sm text-muted-foreground">{compra.lote_ubicacion}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Valor Total</p>
                      <p className="font-semibold text-foreground">{formatCurrency(valorTotal)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Cuota Inicial</p>
                      <p className="font-semibold text-foreground">{formatCurrency(Number(compra.cuota_inicial))}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Cuotas</p>
                      <p className="font-semibold text-foreground">{compra.num_cuotas} x {formatCurrency(Number(compra.valor_cuota))}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Fecha de Compra</p>
                      <p className="font-semibold text-foreground">{formatDate(compra.fecha_compra)}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progreso de pago</span>
                      <span className="font-medium text-foreground">{porcentaje}%</span>
                    </div>
                    <Progress value={porcentaje} className="h-2" />
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Pagado: {formatCurrency(totalPagado)}</span>
                      <span>Pendiente: {formatCurrency(Number(compra.saldo_pendiente))}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

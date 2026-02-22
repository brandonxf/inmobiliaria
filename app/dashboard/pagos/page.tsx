import { getSession } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { redirect } from 'next/navigation'
import { formatCurrency, formatDate, getEstadoLabel, getEstadoColor } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PagoForm } from '@/components/dashboard/pago-form'

export default async function PagosPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const sql = getDb()

  const [pagos, compras] = await Promise.all([
    sql`
      SELECT p.*, c.id as compra_num, l.codigo as lote_codigo
      FROM pagos p
      JOIN compras c ON p.compra_id = c.id
      JOIN lotes l ON c.lote_id = l.id
      WHERE c.cliente_id = ${session.userId}
      ORDER BY p.created_at DESC
    `,
    sql`
      SELECT c.id, l.codigo as lote_codigo, c.saldo_pendiente
      FROM compras c
      JOIN lotes l ON c.lote_id = l.id
      WHERE c.cliente_id = ${session.userId} AND c.estado = 'activa'
      ORDER BY c.fecha_compra DESC
    `,
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Mis Pagos</h1>
        <p className="text-muted-foreground">Registra y consulta tus pagos.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Register Payment */}
        <div className="lg:col-span-1">
          <PagoForm compras={compras} />
        </div>

        {/* Payment History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Pagos</CardTitle>
            </CardHeader>
            <CardContent>
              {pagos.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No hay pagos registrados.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lote</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Metodo</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagos.map((pago) => (
                      <TableRow key={pago.id}>
                        <TableCell className="font-medium">{pago.lote_codigo}</TableCell>
                        <TableCell>{formatCurrency(Number(pago.monto))}</TableCell>
                        <TableCell>{formatDate(pago.fecha_pago)}</TableCell>
                        <TableCell className="capitalize">{pago.metodo_pago}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getEstadoColor(pago.estado)}>
                            {getEstadoLabel(pago.estado)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

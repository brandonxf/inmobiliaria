import { getDb } from '@/lib/db'
import { formatCurrency, formatDate, getEstadoLabel, getEstadoColor } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PagoActions } from '@/components/admin/pago-actions'

export default async function AdminPagosPage() {
  const sql = getDb()
  const pagos = await sql`
    SELECT p.*, u.nombre, u.apellido, l.codigo as lote_codigo
    FROM pagos p
    JOIN compras c ON p.compra_id = c.id
    JOIN usuarios u ON c.cliente_id = u.id
    JOIN lotes l ON c.lote_id = l.id
    ORDER BY p.created_at DESC
  `

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Pagos</h1>
        <p className="text-muted-foreground">Revisa y aprueba los pagos de los clientes.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Metodo</TableHead>
                <TableHead>Referencia</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagos.map((pago) => (
                <TableRow key={pago.id}>
                  <TableCell className="font-medium">{pago.nombre} {pago.apellido}</TableCell>
                  <TableCell>{pago.lote_codigo}</TableCell>
                  <TableCell>{formatCurrency(Number(pago.monto))}</TableCell>
                  <TableCell>{formatDate(pago.fecha_pago)}</TableCell>
                  <TableCell className="capitalize">{pago.metodo_pago}</TableCell>
                  <TableCell>{pago.referencia || '-'}</TableCell>
                  <TableCell>
                    <Badge className={getEstadoColor(pago.estado)}>{getEstadoLabel(pago.estado)}</Badge>
                  </TableCell>
                  <TableCell>
                    {pago.estado === 'pendiente' && <PagoActions pagoId={pago.id} />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

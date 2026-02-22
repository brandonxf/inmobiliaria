import { getDb } from '@/lib/db'
import { formatCurrency, formatDate, getEstadoLabel, getEstadoColor } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CrearCompraDialog } from '@/components/admin/crear-compra-dialog'

export default async function AdminComprasPage() {
  const sql = getDb()
  const [compras, clientes, lotes] = await Promise.all([
    sql`
      SELECT c.*, u.nombre, u.apellido, l.codigo as lote_codigo
      FROM compras c
      JOIN usuarios u ON c.cliente_id = u.id
      JOIN lotes l ON c.lote_id = l.id
      ORDER BY c.created_at DESC
    `,
    sql`SELECT id, nombre, apellido, email FROM usuarios WHERE rol = 'cliente' ORDER BY nombre ASC`,
    sql`SELECT id, codigo, valor FROM lotes WHERE estado = 'disponible' ORDER BY codigo ASC`,
  ])

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compras</h1>
          <p className="text-muted-foreground">Gestiona las compras de lotes.</p>
        </div>
        <CrearCompraDialog clientes={clientes} lotes={lotes} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Cuota Inicial</TableHead>
                <TableHead>Cuotas</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {compras.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.nombre} {c.apellido}</TableCell>
                  <TableCell>{c.lote_codigo}</TableCell>
                  <TableCell>{formatCurrency(Number(c.valor_total))}</TableCell>
                  <TableCell>{formatCurrency(Number(c.cuota_inicial))}</TableCell>
                  <TableCell>{c.num_cuotas} x {formatCurrency(Number(c.valor_cuota))}</TableCell>
                  <TableCell>{formatCurrency(Number(c.saldo_pendiente))}</TableCell>
                  <TableCell>
                    <Badge className={getEstadoColor(c.estado)}>{getEstadoLabel(c.estado)}</Badge>
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

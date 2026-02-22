import { getDb } from '@/lib/db'
import { formatCurrency, getEstadoLabel, getEstadoColor } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CrearLoteDialog } from '@/components/admin/crear-lote-dialog'
import { EditarLoteDialog } from '@/components/admin/editar-lote-dialog'
import { LoteEstadoSelect } from '@/components/admin/lote-estado-select'

export default async function AdminLotesPage() {
  const sql = getDb()
  const [lotes, etapas] = await Promise.all([
    sql`SELECT l.*, e.nombre as etapa_nombre FROM lotes l LEFT JOIN etapas e ON l.etapa_id = e.id ORDER BY l.codigo ASC`,
    sql`SELECT id, nombre FROM etapas ORDER BY orden ASC`,
  ])

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lotes</h1>
          <p className="text-muted-foreground">Gestiona los lotes del proyecto.</p>
        </div>
        <CrearLoteDialog etapas={etapas} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Codigo</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Cuartos</TableHead>
                <TableHead>Baños</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Etapa</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lotes.map((lote) => (
                <TableRow key={lote.id}>
                  <TableCell className="font-medium">{lote.codigo}</TableCell>
                  <TableCell>{Number(lote.area_m2)} m2</TableCell>
                  <TableCell>{lote.cuartos || '-'}</TableCell>
                  <TableCell>{lote.baños || '-'}</TableCell>
                  <TableCell>{formatCurrency(Number(lote.valor))}</TableCell>
                  <TableCell>{lote.etapa_nombre || '-'}</TableCell>
                  <TableCell>
                    <LoteEstadoSelect loteId={lote.id} currentEstado={lote.estado} />
                  </TableCell>
                  <TableCell>
                    <EditarLoteDialog lote={lote} etapas={etapas} />
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

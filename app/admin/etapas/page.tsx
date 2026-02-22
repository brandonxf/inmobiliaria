import { getDb } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CrearEtapaDialog } from '@/components/admin/crear-etapa-dialog'
import { ToggleEtapaButton } from '@/components/admin/toggle-etapa-button'

export default async function AdminEtapasPage() {
  const sql = getDb()
  const etapas = await sql`SELECT * FROM etapas ORDER BY orden ASC`

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Etapas</h1>
          <p className="text-muted-foreground">Gestiona las etapas del proyecto.</p>
        </div>
        <CrearEtapaDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripcion</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {etapas.map((etapa) => (
                <TableRow key={etapa.id}>
                  <TableCell>{etapa.orden}</TableCell>
                  <TableCell className="font-medium">{etapa.nombre}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">{etapa.descripcion || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={etapa.activa ? 'default' : 'secondary'}>
                      {etapa.activa ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ToggleEtapaButton id={etapa.id} activa={etapa.activa} />
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

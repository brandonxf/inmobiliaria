import { getDb } from '@/lib/db'
import { formatDate } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CrearUsuarioDialog } from '@/components/admin/crear-usuario-dialog'

export default async function AdminUsuariosPage() {
  const sql = getDb()
  const usuarios = await sql`SELECT id, nombre, apellido, email, telefono, rol, verificado, created_at FROM usuarios ORDER BY created_at DESC`

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
          <p className="text-muted-foreground">Gestiona los usuarios del sistema.</p>
        </div>
        <CrearUsuarioDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefono</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Registro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.nombre} {u.apellido}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.telefono || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={u.rol === 'admin' ? 'default' : 'secondary'} className="capitalize">
                      {u.rol}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(u.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

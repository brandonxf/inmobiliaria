import { getSession } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { redirect } from 'next/navigation'
import { PerfilForm } from '@/components/dashboard/perfil-form'

export default async function PerfilPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const sql = getDb()
  const users = await sql`SELECT nombre, apellido, email, telefono, created_at FROM usuarios WHERE id = ${session.userId}`

  if (users.length === 0) redirect('/login')
  const user = users[0]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Mi Perfil</h1>
        <p className="text-muted-foreground">Actualiza tu informacion personal.</p>
      </div>

      <PerfilForm user={user} />
    </div>
  )
}

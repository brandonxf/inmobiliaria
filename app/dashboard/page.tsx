import { getSession } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { redirect } from 'next/navigation'
import { formatCurrency } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, FileText, MapPin, MessageSquare } from 'lucide-react'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const sql = getDb()

  const [comprasResult, pagosResult, pqrsResult, lotesResult] = await Promise.all([
    sql`SELECT COUNT(*) as total, COALESCE(SUM(saldo_pendiente), 0) as saldo FROM compras WHERE cliente_id = ${session.userId}`,
    sql`SELECT COUNT(*) as total FROM pagos p JOIN compras c ON p.compra_id = c.id WHERE c.cliente_id = ${session.userId}`,
    sql`SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE estado = 'pendiente') as pendientes FROM pqrs WHERE cliente_id = ${session.userId}`,
    sql`SELECT COUNT(*) as total FROM lotes WHERE estado = 'disponible'`,
  ])

  const stats = [
    {
      label: 'Mis Compras',
      value: comprasResult[0].total,
      icon: CreditCard,
      description: `Saldo: ${formatCurrency(Number(comprasResult[0].saldo))}`,
    },
    {
      label: 'Pagos Realizados',
      value: pagosResult[0].total,
      icon: FileText,
      description: 'Total de pagos registrados',
    },
    {
      label: 'PQRS',
      value: pqrsResult[0].total,
      icon: MessageSquare,
      description: `${pqrsResult[0].pendientes} pendientes`,
    },
    {
      label: 'Lotes Disponibles',
      value: lotesResult[0].total,
      icon: MapPin,
      description: 'Lotes para comprar',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Bienvenido, {session.nombre}
        </h1>
        <p className="text-muted-foreground">
          Aqui tienes un resumen de tu actividad en el sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

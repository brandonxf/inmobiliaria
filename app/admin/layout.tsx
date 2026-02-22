import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.rol !== 'admin') redirect('/dashboard')

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <AdminSidebar user={session} />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}

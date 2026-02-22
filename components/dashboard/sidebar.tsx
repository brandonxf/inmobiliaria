'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/lib/actions/auth'
import { Building2, FileText, Home, LogOut, MapPin, MessageSquare, CreditCard, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  user: {
    nombre: string
    apellido: string
    email: string
    rol: string
  }
}

const clientLinks = [
  { href: '/dashboard', label: 'Inicio', icon: Home },
  { href: '/dashboard/lotes', label: 'Lotes', icon: MapPin },
  { href: '/dashboard/compras', label: 'Mis Compras', icon: CreditCard },
  { href: '/dashboard/pagos', label: 'Mis Pagos', icon: FileText },
  { href: '/dashboard/pqrs', label: 'PQRS', icon: MessageSquare },
  { href: '/dashboard/perfil', label: 'Mi Perfil', icon: User },
]

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      {/* Brand */}
      <div className="flex items-center gap-2 border-b border-sidebar-border px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <Building2 className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-sidebar-foreground">InmoGestion</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {clientLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  )}
                >
                  <link.icon className="h-4 w-4 shrink-0" />
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User info + logout */}
      <div className="border-t border-sidebar-border p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sm font-semibold text-sidebar-accent-foreground">
            {user.nombre[0]}{user.apellido[0]}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user.nombre} {user.apellido}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/60">{user.email}</p>
          </div>
        </div>
        <form action={logoutAction}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesion
          </Button>
        </form>
      </div>
    </aside>
  )
}

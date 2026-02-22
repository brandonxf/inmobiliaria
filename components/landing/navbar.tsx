import Link from 'next/link'
import { Building2, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">InmoGestion</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#etapas" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Etapas
          </a>
          <a href="#lotes" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Lotes
          </a>
          <a href="#contacto" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Contacto
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Iniciar Sesion
            </Button>
          </Link>
          <Link href="/registro">
            <Button size="sm">
              Registrate
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}

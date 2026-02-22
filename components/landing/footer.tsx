import { Building2, Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer id="contacto" className="border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">InmoGestion</span>
            </div>
            <p className="text-sm leading-relaxed text-background/70">
              Sistema integral de gestion inmobiliaria para la venta y administracion de lotes residenciales.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-background/50">
              Enlaces
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="#etapas" className="text-sm text-background/70 transition-colors hover:text-background">
                  Etapas del proyecto
                </a>
              </li>
              <li>
                <a href="#lotes" className="text-sm text-background/70 transition-colors hover:text-background">
                  Lotes disponibles
                </a>
              </li>
              <li>
                <Link href="/login" className="text-sm text-background/70 transition-colors hover:text-background">
                  Iniciar sesion
                </Link>
              </li>
              <li>
                <Link href="/registro" className="text-sm text-background/70 transition-colors hover:text-background">
                  Registrarse
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-background/50">
              Contacto
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Phone className="h-4 w-4 shrink-0" />
                +57 (1) 234 5678
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Mail className="h-4 w-4 shrink-0" />
                contacto@inmogestion.com
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <MapPin className="h-4 w-4 shrink-0" />
                Bogota, Colombia
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-background/10 pt-8 text-center text-sm text-background/50">
          2026 InmoGestion. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

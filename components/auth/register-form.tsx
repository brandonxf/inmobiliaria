'use client'

import { useActionState } from 'react'
import { registerAction } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Building2, Loader2 } from 'lucide-react'
import Link from 'next/link'

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, null)

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-balance">Crear Cuenta</CardTitle>
          <CardDescription>Registrate para acceder al sistema inmobiliario</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="flex flex-col gap-4">
            {state?.error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {state.error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" name="nombre" placeholder="Juan" required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input id="apellido" name="apellido" placeholder="Perez" required />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Correo electronico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="telefono">Telefono (opcional)</Label>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                placeholder="+57 300 123 4567"
                autoComplete="tel"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Contrasena</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Minimo 6 caracteres"
                required
                autoComplete="new-password"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirmar contrasena</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repite tu contrasena"
                required
                autoComplete="new-password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Ya tienes cuenta?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Inicia sesion
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useActionState } from 'react'
import { loginAction } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Building2, Loader2 } from 'lucide-react'
import Link from 'next/link'

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null)

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-balance">Iniciar Sesion</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder al sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="flex flex-col gap-4">
            {state?.error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {state.error}
              </div>
            )}

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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contrasena</Label>
                <Link
                  href="/recuperar"
                  className="text-xs text-primary hover:underline"
                >
                  Olvidaste tu contrasena?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Tu contrasena"
                required
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                'Iniciar Sesion'
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              No tienes cuenta?{' '}
              <Link href="/registro" className="font-medium text-primary hover:underline">
                Registrate aqui
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

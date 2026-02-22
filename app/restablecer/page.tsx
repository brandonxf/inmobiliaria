'use client'

import { useActionState } from 'react'
import { resetPasswordAction } from '@/lib/actions/password-recovery'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { KeyRound, CheckCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ResetForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const [state, formAction, pending] = useActionState(resetPasswordAction, null)

  if (state?.success) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-7 w-7 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Contrasena Restablecida</CardTitle>
          <CardDescription>
            Tu contrasena ha sido actualizada exitosamente. Ya puedes iniciar sesion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login">
            <Button className="w-full">Iniciar Sesion</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">Enlace Invalido</CardTitle>
          <CardDescription>
            El enlace de recuperacion no es valido. Solicita uno nuevo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/recuperar">
            <Button variant="outline" className="w-full">Solicitar nuevo enlace</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <KeyRound className="h-7 w-7 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">Nueva Contrasena</CardTitle>
        <CardDescription>Ingresa tu nueva contrasena</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="token" value={token} />
          {state?.error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Nueva contrasena</Label>
            <Input id="password" name="password" type="password" placeholder="Minimo 6 caracteres" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Confirmar contrasena</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Repite tu contrasena" required />
          </div>
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? 'Guardando...' : 'Restablecer Contrasena'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function RestablecerPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Suspense fallback={<div className="text-muted-foreground">Cargando...</div>}>
        <ResetForm />
      </Suspense>
    </div>
  )
}

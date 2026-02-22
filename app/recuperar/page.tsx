'use client'

import { useActionState } from 'react'
import { requestPasswordResetAction } from '@/lib/actions/password-recovery'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function RecuperarPage() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, null)

  if (state?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-7 w-7 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Correo Enviado</CardTitle>
            <CardDescription>
              Si existe una cuenta con ese email, recibiras un enlace para restablecer tu contrasena. Revisa tu bandeja de entrada y spam.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio de sesion
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Recuperar Contrasena</CardTitle>
          <CardDescription>
            Ingresa tu email y te enviaremos un enlace para restablecer tu contrasena.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            {state?.error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {state.error}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Correo electronico</Label>
              <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
            </div>
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? 'Enviando...' : 'Enviar enlace de recuperacion'}
            </Button>
            <Link href="/login" className="text-center text-sm text-muted-foreground hover:text-primary">
              Volver al inicio de sesion
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

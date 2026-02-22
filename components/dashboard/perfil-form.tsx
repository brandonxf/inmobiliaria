'use client'

import { useActionState } from 'react'
import { actualizarPerfilAction } from '@/lib/actions/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

interface PerfilFormProps {
  user: {
    nombre: string
    apellido: string
    email: string
    telefono: string | null
    created_at: string
  }
}

export function PerfilForm({ user }: PerfilFormProps) {
  const [state, action, pending] = useActionState(actualizarPerfilAction, null)

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Informacion Personal</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4">
          {state?.error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}

          {state?.success && (
            <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2.5 text-sm text-accent-foreground">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Perfil actualizado exitosamente.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" defaultValue={user.nombre} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input id="apellido" name="apellido" defaultValue={user.apellido} required />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Correo electronico</Label>
            <Input id="email" value={user.email} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">El correo no se puede modificar.</p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="telefono">Telefono</Label>
            <Input id="telefono" name="telefono" defaultValue={user.telefono || ''} placeholder="+57 300 123 4567" />
          </div>

          <Button type="submit" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

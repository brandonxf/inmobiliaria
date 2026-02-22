'use client'

import { useActionState } from 'react'
import { crearPqrsAction } from '@/lib/actions/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

export function PqrsForm() {
  const [state, action, pending] = useActionState(crearPqrsAction, null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva PQRS</CardTitle>
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
              PQRS creada exitosamente.
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="tipo">Tipo</Label>
            <Select name="tipo" required>
              <SelectTrigger id="tipo">
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="peticion">Peticion</SelectItem>
                <SelectItem value="queja">Queja</SelectItem>
                <SelectItem value="reclamo">Reclamo</SelectItem>
                <SelectItem value="sugerencia">Sugerencia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="asunto">Asunto</Label>
            <Input id="asunto" name="asunto" placeholder="Describe brevemente tu solicitud" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="descripcion">Descripcion</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              placeholder="Describe en detalle tu peticion, queja, reclamo o sugerencia"
              rows={5}
              required
            />
          </div>

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar PQRS'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

'use client'

import { useActionState } from 'react'
import { responderPqrsAction } from '@/lib/actions/admin'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

interface Props {
  pqrsId: number
  currentRespuesta: string
}

export function ResponderPqrsForm({ pqrsId, currentRespuesta }: Props) {
  const [state, action, pending] = useActionState(responderPqrsAction, null)

  return (
    <form action={action} className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="id" value={pqrsId} />

      {state?.error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />{state.error}
        </div>
      )}
      {state?.success && (
        <div className="flex items-center gap-2 text-sm text-accent-foreground">
          <CheckCircle2 className="h-4 w-4" />Respuesta enviada.
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor={`respuesta-${pqrsId}`}>Respuesta</Label>
        <Textarea
          id={`respuesta-${pqrsId}`}
          name="respuesta"
          defaultValue={currentRespuesta}
          placeholder="Escribe la respuesta..."
          rows={3}
          required
        />
      </div>

      <div className="flex items-center gap-3">
        <Select name="estado" defaultValue="resuelto">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en_proceso">En Proceso</SelectItem>
            <SelectItem value="resuelto">Resuelto</SelectItem>
            <SelectItem value="cerrado">Cerrado</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit" size="sm" disabled={pending}>
          {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Enviar Respuesta
        </Button>
      </div>
    </form>
  )
}

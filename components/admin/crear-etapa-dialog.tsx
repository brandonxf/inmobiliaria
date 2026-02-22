'use client'

import { useActionState, useState } from 'react'
import { crearEtapaAction } from '@/lib/actions/admin'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertCircle, CheckCircle2, Loader2, Plus } from 'lucide-react'

export function CrearEtapaDialog() {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(crearEtapaAction, null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" />Nueva Etapa</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Crear Etapa</DialogTitle></DialogHeader>
        <form action={action} className="flex flex-col gap-4">
          {state?.error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />{state.error}
            </div>
          )}
          {state?.success && (
            <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2.5 text-sm text-accent-foreground">
              <CheckCircle2 className="h-4 w-4 shrink-0" />Etapa creada exitosamente.
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" name="nombre" placeholder="Etapa 5" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="descripcion">Descripcion</Label>
            <Textarea id="descripcion" name="descripcion" rows={3} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="orden">Orden</Label>
            <Input id="orden" name="orden" type="number" min="0" defaultValue="0" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="activa" name="activa" />
            <Label htmlFor="activa" className="text-sm">Etapa activa</Label>
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Crear Etapa
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

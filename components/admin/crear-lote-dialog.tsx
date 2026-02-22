'use client'

import { useActionState, useState } from 'react'
import { crearLoteAction } from '@/lib/actions/admin'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, CheckCircle2, Loader2, Plus } from 'lucide-react'

interface Props {
  etapas: Array<{ id: number; nombre: string }>
}

export function CrearLoteDialog({ etapas }: Props) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(crearLoteAction, null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" />Nuevo Lote</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Crear Lote</DialogTitle></DialogHeader>
        <form action={action} className="flex flex-col gap-4">
          {state?.error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />{state.error}
            </div>
          )}
          {state?.success && (
            <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2.5 text-sm text-accent-foreground">
              <CheckCircle2 className="h-4 w-4 shrink-0" />Lote creado exitosamente.
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="codigo">Codigo</Label>
              <Input id="codigo" name="codigo" placeholder="L-011" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="area_m2">Area (m2)</Label>
              <Input id="area_m2" name="area_m2" type="number" min="1" step="0.01" required />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="valor">Valor ($)</Label>
            <Input id="valor" name="valor" type="number" min="1" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ubicacion">Ubicacion</Label>
            <Input id="ubicacion" name="ubicacion" placeholder="Manzana A" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="etapa_id">Etapa</Label>
            <Select name="etapa_id">
              <SelectTrigger><SelectValue placeholder="Sin etapa" /></SelectTrigger>
              <SelectContent>
                {etapas.map((e) => (
                  <SelectItem key={e.id} value={String(e.id)}>{e.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <input type="hidden" name="estado" value="disponible" />
          <div className="flex flex-col gap-2">
            <Label htmlFor="descripcion">Descripcion</Label>
            <Textarea id="descripcion" name="descripcion" rows={3} />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Crear Lote
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

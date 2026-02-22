'use client'

import { useActionState, useState } from 'react'
import { actualizarLoteAction } from '@/lib/actions/admin'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, CheckCircle2, Loader2, Pencil } from 'lucide-react'

interface EditarLoteDialogProps {
  lote: {
    id: number
    codigo: string
    area_m2: number
    ubicacion: string | null
    valor: number
    etapa_id: number | null
    descripcion: string | null
    cuartos: number
    baños: number
    parqueaderos: number
    foto_url: string | null
  }
  etapas: Array<{ id: number; nombre: string }>
}

export function EditarLoteDialog({ lote, etapas }: EditarLoteDialogProps) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(actualizarLoteAction, null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Pencil className="h-4 w-4" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Lote</DialogTitle>
        </DialogHeader>
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
              Lote actualizado exitosamente.
            </div>
          )}
          <Input type="hidden" name="id" value={lote.id} />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="codigo">Codigo</Label>
              <Input id="codigo" name="codigo" defaultValue={lote.codigo} required disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="area_m2">Area (m2)</Label>
              <Input id="area_m2" name="area_m2" type="number" min="1" step="0.01" defaultValue={lote.area_m2} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="cuartos">Cuartos</Label>
              <Input id="cuartos" name="cuartos" type="number" min="0" defaultValue={lote.cuartos || 0} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="baños">Baños</Label>
              <Input id="baños" name="baños" type="number" min="0" defaultValue={lote.baños || 0} required />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="parqueaderos">Parqueaderos</Label>
            <Input id="parqueaderos" name="parqueaderos" type="number" min="0" defaultValue={lote.parqueaderos || 0} required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="valor">Valor ($)</Label>
            <Input id="valor" name="valor" type="number" min="1" defaultValue={lote.valor} required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="ubicacion">Ubicacion</Label>
            <Input id="ubicacion" name="ubicacion" defaultValue={lote.ubicacion || ''} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="etapa_id">Etapa</Label>
            <Select name="etapa_id" defaultValue={lote.etapa_id ? String(lote.etapa_id) : 'none'}>
              <SelectTrigger>
                <SelectValue placeholder="Sin etapa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin etapa</SelectItem>
                {etapas.map((e) => (
                  <SelectItem key={e.id} value={String(e.id)}>
                    {e.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="foto_url">URL Foto</Label>
            <Input id="foto_url" name="foto_url" type="url" defaultValue={lote.foto_url || ''} placeholder="https://ejemplo.com/foto.jpg" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="descripcion">Descripcion</Label>
            <Textarea id="descripcion" name="descripcion" rows={3} defaultValue={lote.descripcion || ''} />
          </div>

          <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Actualizar Lote
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

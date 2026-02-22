'use client'

import { useActionState, useState } from 'react'
import { crearCompraAction } from '@/lib/actions/admin'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, CheckCircle2, Loader2, Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/format'

interface Props {
  clientes: Array<{ id: number; nombre: string; apellido: string; email: string }>
  lotes: Array<{ id: number; codigo: string; valor: number }>
}

export function CrearCompraDialog({ clientes, lotes }: Props) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(crearCompraAction, null)

  if (clientes.length === 0 || lotes.length === 0) {
    return (
      <Button disabled className="gap-2">
        <Plus className="h-4 w-4" />
        {clientes.length === 0 ? 'Sin clientes' : 'Sin lotes disponibles'}
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" />Nueva Compra</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Registrar Compra</DialogTitle></DialogHeader>
        <form action={action} className="flex flex-col gap-4">
          {state?.error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />{state.error}
            </div>
          )}
          {state?.success && (
            <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2.5 text-sm text-accent-foreground">
              <CheckCircle2 className="h-4 w-4 shrink-0" />Compra registrada exitosamente.
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label>Cliente</Label>
            <Select name="cliente_id" required>
              <SelectTrigger><SelectValue placeholder="Selecciona cliente" /></SelectTrigger>
              <SelectContent>
                {clientes.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.nombre} {c.apellido} ({c.email})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Lote</Label>
            <Select name="lote_id" required>
              <SelectTrigger><SelectValue placeholder="Selecciona lote" /></SelectTrigger>
              <SelectContent>
                {lotes.map((l) => (
                  <SelectItem key={l.id} value={String(l.id)}>
                    {l.codigo} - {formatCurrency(Number(l.valor))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="cuota_inicial">Cuota Inicial ($)</Label>
              <Input id="cuota_inicial" name="cuota_inicial" type="number" min="0" defaultValue="0" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="num_cuotas">Numero de Cuotas</Label>
              <Input id="num_cuotas" name="num_cuotas" type="number" min="1" defaultValue="12" required />
            </div>
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Registrar Compra
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

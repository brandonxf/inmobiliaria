'use client'

import { useActionState, useState } from 'react'
import { actualizarUsuarioAction } from '@/lib/actions/admin'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, CheckCircle2, Loader2, Pencil } from 'lucide-react'

interface EditarUsuarioDialogProps {
  usuario: {
    id: number
    nombre: string
    apellido: string
    email: string
    telefono: string | null
    rol: string
  }
}

export function EditarUsuarioDialog({ usuario }: EditarUsuarioDialogProps) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(actualizarUsuarioAction, null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Pencil className="h-4 w-4" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
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
              Usuario actualizado exitosamente.
            </div>
          )}
          <Input type="hidden" name="id" value={usuario.id} />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" defaultValue={usuario.nombre} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input id="apellido" name="apellido" defaultValue={usuario.apellido} required />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={usuario.email} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="telefono">Telefono</Label>
            <Input id="telefono" name="telefono" type="tel" defaultValue={usuario.telefono || ''} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="rol">Rol</Label>
            <Select name="rol" defaultValue={usuario.rol}>
              <SelectTrigger id="rol">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cliente">Cliente</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Contrasena (dejar en blanco para no cambiar)</Label>
            <Input id="password" name="password" type="password" />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Actualizar Usuario
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

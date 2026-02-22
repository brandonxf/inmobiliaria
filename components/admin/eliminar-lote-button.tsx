'use client'

import { useState } from 'react'
import { eliminarLoteAction } from '@/lib/actions/admin'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/dialog'
import { Trash2 } from 'lucide-react'

interface EliminarLoteButtonProps {
  loteId: number
  loteCodigo: string
}

export function EliminarLoteButton({ loteId, loteCodigo }: EliminarLoteButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setIsLoading(true)
    setError('')
    const result = await eliminarLoteAction(loteId)
    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-xs text-destructive">
        <span>{error}</span>
      </div>
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isLoading} className="gap-2">
          <Trash2 className="h-4 w-4" />
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar el <span className="font-semibold">Lote {loteCodigo}</span>? Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-2">
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { MapPin, Maximize2, Sofa, Waves, ParkingCircle } from 'lucide-react'
import { ReservaLoteDialog } from './reserva-lote-dialog'

interface VerLoteDialogProps {
  lote: any
}

export function VerLoteDialog({ lote }: VerLoteDialogProps) {
  const [open, setOpen] = useState(false)
  const isAvailable = lote.estado === 'disponible'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Ver Información</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Lote {lote.codigo}</DialogTitle>
          <DialogDescription>Información detallada del lote.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {/* Foto */}
          <div className="relative h-64 w-full rounded-lg border border-border bg-muted overflow-hidden">
            {lote.imagen_url ? (
              <img
                src={lote.imagen_url}
                alt={`Lote ${lote.codigo}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <MapPin className="h-16 w-16 text-muted-foreground/30" />
              </div>
            )}
            <Badge className="absolute right-3 top-3">
              {lote.estado === 'disponible' && 'Disponible'}
              {lote.estado === 'reservado' && 'Reservado'}
              {lote.estado === 'vendido' && 'Vendido'}
            </Badge>
          </div>

          {/* Información Básica */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Area</p>
              <div className="flex items-center gap-2 mt-1">
                <Maximize2 className="h-4 w-4 text-primary" />
                <p className="font-semibold">{Number(lote.area_m2)} m²</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor</p>
              <p className="font-semibold text-lg text-primary">
                {formatCurrency(Number(lote.valor))}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cuartos</p>
              <div className="flex items-center gap-2 mt-1">
                <Sofa className="h-4 w-4 text-primary" />
                <p className="font-semibold">{lote.cuartos}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Baños</p>
              <div className="flex items-center gap-2 mt-1">
                <Waves className="h-4 w-4 text-primary" />
                <p className="font-semibold">{lote.banos}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Parqueaderos</p>
              <div className="flex items-center gap-2 mt-1">
                <ParkingCircle className="h-4 w-4 text-primary" />
                <p className="font-semibold">{lote.parqueaderos}</p>
              </div>
            </div>
          </div>

          {/* Ubicación y Etapa */}
          <div className="grid grid-cols-2 gap-4 border-y border-border py-4">
            {lote.ubicacion && (
              <div>
                <p className="text-sm text-muted-foreground">Ubicación</p>
                <p className="font-medium mt-1">{lote.ubicacion}</p>
              </div>
            )}
            {lote.etapa_nombre && (
              <div>
                <p className="text-sm text-muted-foreground">Etapa</p>
                <p className="font-medium mt-1">{lote.etapa_nombre}</p>
              </div>
            )}
          </div>

          {/* Descripción */}
          {lote.descripcion && (
            <div>
              <p className="text-sm font-semibold">Descripción</p>
              <p className="text-sm text-muted-foreground mt-2">{lote.descripcion}</p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-2 pt-4 border-t border-border">
            {isAvailable ? (
              <ReservaLoteDialog lote={lote} onClose={() => setOpen(false)} />
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Este lote no está disponible para reserva en este momento
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

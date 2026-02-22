'use client'

import { aprobarPagoAction, rechazarPagoAction } from '@/lib/actions/admin'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'

interface Props {
  pagoId: number
}

export function PagoActions({ pagoId }: Props) {
  return (
    <div className="flex items-center gap-2">
      <form action={() => aprobarPagoAction(pagoId)}>
        <Button type="submit" size="sm" variant="outline" className="gap-1 text-accent">
          <Check className="h-3 w-3" />
          Aprobar
        </Button>
      </form>
      <form action={() => rechazarPagoAction(pagoId)}>
        <Button type="submit" size="sm" variant="outline" className="gap-1 text-destructive">
          <X className="h-3 w-3" />
          Rechazar
        </Button>
      </form>
    </div>
  )
}

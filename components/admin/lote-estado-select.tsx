'use client'

import { actualizarLoteEstadoAction } from '@/lib/actions/admin'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getEstadoLabel } from '@/lib/format'

interface Props {
  loteId: number
  currentEstado: string
}

export function LoteEstadoSelect({ loteId, currentEstado }: Props) {
  async function handleChange(newEstado: string) {
    await actualizarLoteEstadoAction(loteId, newEstado)
  }

  return (
    <Select defaultValue={currentEstado} onValueChange={handleChange}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="disponible">{getEstadoLabel('disponible')}</SelectItem>
        <SelectItem value="reservado">{getEstadoLabel('reservado')}</SelectItem>
        <SelectItem value="vendido">{getEstadoLabel('vendido')}</SelectItem>
      </SelectContent>
    </Select>
  )
}

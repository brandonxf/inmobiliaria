'use client'

import { toggleEtapaAction } from '@/lib/actions/admin'
import { Button } from '@/components/ui/button'

interface Props {
  id: number
  activa: boolean
}

export function ToggleEtapaButton({ id, activa }: Props) {
  return (
    <form action={() => toggleEtapaAction(id, !activa)}>
      <Button type="submit" size="sm" variant="outline">
        {activa ? 'Desactivar' : 'Activar'}
      </Button>
    </form>
  )
}

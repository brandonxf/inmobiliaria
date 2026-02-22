'use client'

import { useActionState } from 'react'
import { registrarPagoAction } from '@/lib/actions/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/format'

interface PagoFormProps {
  compras: Array<{
    id: number
    lote_codigo: string
    saldo_pendiente: number
  }>
}

export function PagoForm({ compras }: PagoFormProps) {
  const [state, action, pending] = useActionState(registrarPagoAction, null)

  if (compras.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Registrar Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No tienes compras activas para registrar pagos.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Pago</CardTitle>
      </CardHeader>
      <CardContent>
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
              Pago registrado exitosamente. Sera revisado por el administrador.
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="compra_id">Compra</Label>
            <Select name="compra_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona la compra" />
              </SelectTrigger>
              <SelectContent>
                {compras.map((compra) => (
                  <SelectItem key={compra.id} value={String(compra.id)}>
                    Lote {compra.lote_codigo} - Saldo: {formatCurrency(Number(compra.saldo_pendiente))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="monto">Monto</Label>
            <Input id="monto" name="monto" type="number" min="1" step="0.01" placeholder="0" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="metodo_pago">Metodo de Pago</Label>
            <Select name="metodo_pago" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona metodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transferencia">Transferencia</SelectItem>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="tarjeta">Tarjeta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="referencia">Referencia (opcional)</Label>
            <Input id="referencia" name="referencia" placeholder="Numero de referencia o comprobante" />
          </div>

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registrando...
              </>
            ) : (
              'Registrar Pago'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

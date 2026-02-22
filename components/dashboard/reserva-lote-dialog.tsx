'use client'

import { useActionState, useState, useMemo } from 'react'
import { crearReservaAction } from '@/lib/actions/client'
import { formatCurrency } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, CheckCircle2, Loader2, ShoppingCart } from 'lucide-react'

interface ReservaLoteDialogProps {
  lote: {
    id: number
    codigo: string
    valor: number
    area_m2: number
    cuartos: number
    baños: number
  }
  onClose: () => void
}

export function ReservaLoteDialog({ lote, onClose }: ReservaLoteDialogProps) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(crearReservaAction, null)
  const [numeroCuenta, setNumeroCuenta] = useState('')
  const [metodoPago, setMetodoPago] = useState('transferencia')
  const [numCuotas, setNumCuotas] = useState('12')
  const [cuotaInicial, setCuotaInicial] = useState('20')

  // Calcular cuota inicial dinámica basada en características del lote
  const cuotaInicialCalculada = useMemo(() => {
    let porcentaje = parseFloat(cuotaInicial) || 20
    
    // Ajuste basado en cuartos
    if (lote.cuartos > 3) porcentaje += 5
    
    // Ajuste basado en baños
    if (lote.baños > 2) porcentaje += 3
    
    // Minimo 10%, máximo 50%
    porcentaje = Math.max(10, Math.min(50, porcentaje))
    
    return (lote.valor * porcentaje) / 100
  }, [cuotaInicial, lote.cuartos, lote.baños, lote.valor])

  const saldoPendiente = lote.valor - cuotaInicialCalculada
  const valorPorCuota = numCuotas ? saldoPendiente / parseInt(numCuotas) : 0

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 w-full">
          <ShoppingCart className="h-4 w-4" />
          Reservar Lote
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reservar Lote {lote.codigo}</DialogTitle>
        </DialogHeader>

        <form action={action} className="flex flex-col gap-4">
          <Input type="hidden" name="lote_id" value={lote.id} />
          
          {state?.error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}
          {state?.success && (
            <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2.5 text-sm text-accent-foreground">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Reserva creada exitosamente.
            </div>
          )}

          {/* Datos Básicos del Pago */}
          <div className="space-y-4 border-b pb-4">
            <h3 className="font-semibold">Datos de Pago</h3>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="numero_cuenta">Número de Cuenta (Ficticio)</Label>
              <Input
                id="numero_cuenta"
                name="numero_cuenta"
                placeholder="Ej: 123456789"
                value={numeroCuenta}
                onChange={(e) => setNumeroCuenta(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Este es un número de cuenta ficticio para la reserva</p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="metodo_pago">Método de Pago</Label>
              <Select name="metodo_pago" value={metodoPago} onValueChange={setMetodoPago}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Plan de Cuotas */}
          <div className="space-y-4 border-b pb-4">
            <h3 className="font-semibold">Plan de Cuotas</h3>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="num_cuotas">Número de Cuotas</Label>
              <Select name="num_cuotas" value={numCuotas} onValueChange={setNumCuotas}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Cuota (Pago Completo)</SelectItem>
                  <SelectItem value="6">6 Cuotas</SelectItem>
                  <SelectItem value="12">12 Cuotas</SelectItem>
                  <SelectItem value="24">24 Cuotas</SelectItem>
                  <SelectItem value="36">36 Cuotas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="cuota_inicial_porcentaje">Porcentaje Cuota Inicial (%)</Label>
              <Input
                id="cuota_inicial_porcentaje"
                name="cuota_inicial_porcentaje"
                type="number"
                min="10"
                max="50"
                value={cuotaInicial}
                onChange={(e) => setCuotaInicial(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Rango permitido: 10% - 50% (Se ajusta según características del lote)
              </p>
            </div>
          </div>

          {/* Resumen de Cálculo */}
          <div className="space-y-2 rounded-lg bg-muted p-4">
            <h3 className="font-semibold mb-3">Resumen de la Reserva</h3>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Valor Total del Lote:</span>
              <span className="font-semibold text-right">{formatCurrency(lote.valor)}</span>
              
              <span className="text-muted-foreground">Cuota Inicial ({parseFloat(cuotaInicial)}%):</span>
              <span className="font-semibold text-right text-primary">
                {formatCurrency(cuotaInicialCalculada)}
              </span>
              
              <span className="text-muted-foreground">Saldo Pendiente:</span>
              <span className="font-semibold text-right">{formatCurrency(saldoPendiente)}</span>
              
              <span className="text-muted-foreground">Valor por Cuota:</span>
              <span className="font-semibold text-right">{formatCurrency(valorPorCuota)}</span>

              <span className="text-muted-foreground">Número de Cuotas:</span>
              <span className="font-semibold text-right">{numCuotas}</span>
            </div>
          </div>

          <Button type="submit" disabled={pending} className="w-full" size="lg">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Completar Reserva
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

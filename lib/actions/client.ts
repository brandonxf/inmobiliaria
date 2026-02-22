'use server'

import { getDb } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { sendPaymentConfirmationEmail } from '@/lib/email'
import { formatCurrency, formatDate } from '@/lib/format'

const pagoSchema = z.object({
  compra_id: z.coerce.number().positive(),
  monto: z.coerce.number().positive('El monto debe ser mayor a 0'),
  metodo_pago: z.string().min(1, 'Selecciona un metodo de pago'),
  referencia: z.string().optional(),
})

export async function registrarPagoAction(_prevState: unknown, formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'No autorizado' }

  const raw = {
    compra_id: formData.get('compra_id'),
    monto: formData.get('monto'),
    metodo_pago: formData.get('metodo_pago'),
    referencia: formData.get('referencia'),
  }

  const parsed = pagoSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const sql = getDb()

  // Verify the purchase belongs to this user
  const compras = await sql`
    SELECT * FROM compras WHERE id = ${parsed.data.compra_id} AND cliente_id = ${session.userId}
  `
  if (compras.length === 0) {
    return { error: 'Compra no encontrada' }
  }

  await sql`
    INSERT INTO pagos (compra_id, monto, metodo_pago, referencia, estado)
    VALUES (${parsed.data.compra_id}, ${parsed.data.monto}, ${parsed.data.metodo_pago}, ${parsed.data.referencia || null}, 'pendiente')
  `

  // Send payment confirmation email
  const compra = compras[0]
  const lotes = await sql`SELECT codigo FROM lotes WHERE id = ${compra.lote_id}`
  const loteCodigo = lotes.length > 0 ? lotes[0].codigo : 'N/A'

  try {
    await sendPaymentConfirmationEmail(session.email, {
      nombre: session.nombre,
      monto: formatCurrency(parsed.data.monto),
      referencia: parsed.data.referencia || null,
      lote: loteCodigo,
      fecha: formatDate(new Date().toISOString()),
      metodoPago: parsed.data.metodo_pago,
    })
  } catch {
    // Email sending failure should not block payment registration
  }

  revalidatePath('/dashboard/pagos')
  revalidatePath('/dashboard/compras')
  return { success: true }
}

const pqrsSchema = z.object({
  tipo: z.enum(['peticion', 'queja', 'reclamo', 'sugerencia']),
  asunto: z.string().min(3, 'El asunto es requerido'),
  descripcion: z.string().min(10, 'La descripcion debe tener al menos 10 caracteres'),
})

export async function crearPqrsAction(_prevState: unknown, formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'No autorizado' }

  const raw = {
    tipo: formData.get('tipo'),
    asunto: formData.get('asunto'),
    descripcion: formData.get('descripcion'),
  }

  const parsed = pqrsSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const sql = getDb()

  await sql`
    INSERT INTO pqrs (cliente_id, tipo, asunto, descripcion, estado)
    VALUES (${session.userId}, ${parsed.data.tipo}, ${parsed.data.asunto}, ${parsed.data.descripcion}, 'pendiente')
  `

  revalidatePath('/dashboard/pqrs')
  return { success: true }
}

export async function actualizarPerfilAction(_prevState: unknown, formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'No autorizado' }

  const nombre = formData.get('nombre') as string
  const apellido = formData.get('apellido') as string
  const telefono = formData.get('telefono') as string

  if (!nombre || !apellido) {
    return { error: 'Nombre y apellido son requeridos' }
  }

  const sql = getDb()

  await sql`
    UPDATE usuarios SET nombre = ${nombre}, apellido = ${apellido}, telefono = ${telefono || null}, updated_at = NOW()
    WHERE id = ${session.userId}
  `

  revalidatePath('/dashboard/perfil')
  return { success: true }
}

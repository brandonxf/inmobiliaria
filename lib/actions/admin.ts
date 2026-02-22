'use server'

import { getDb } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

async function requireAdmin() {
  const session = await getSession()
  if (!session || session.rol !== 'admin') throw new Error('No autorizado')
  return session
}

// --- Lot management ---
const loteSchema = z.object({
  codigo: z.string().min(1),
  area_m2: z.coerce.number().positive(),
  ubicacion: z.string().optional(),
  valor: z.coerce.number().positive(),
  estado: z.enum(['disponible', 'reservado', 'vendido']),
  etapa_id: z.coerce.number().nullable(),
  descripcion: z.string().optional(),
  cuartos: z.coerce.number().min(0),
  baños: z.coerce.number().min(0),
  caracteristicas: z.string().optional(),
  foto_url: z.string().optional(),
})

// Helper to convert empty strings to undefined
const getOptionalString = (value: FormDataEntryValue | null): string | undefined => {
  const str = value as string | null
  return str && str.trim() ? str : undefined
}

export async function crearLoteAction(_prevState: unknown, formData: FormData) {
  await requireAdmin()
  const raw = {
    codigo: formData.get('codigo'),
    area_m2: formData.get('area_m2'),
    ubicacion: getOptionalString(formData.get('ubicacion')),
    valor: formData.get('valor'),
    estado: formData.get('estado') || 'disponible',
    etapa_id: formData.get('etapa_id') === 'none' ? null : getOptionalString(formData.get('etapa_id')) || null,
    descripcion: getOptionalString(formData.get('descripcion')),
    cuartos: formData.get('cuartos') || 0,
    baños: formData.get('baños') || 0,
    caracteristicas: getOptionalString(formData.get('caracteristicas')),
    foto_url: getOptionalString(formData.get('foto_url')),
  }
  const parsed = loteSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const sql = getDb()
  try {
    await sql`
      INSERT INTO lotes (codigo, area_m2, ubicacion, valor, estado, etapa_id, descripcion, cuartos, baños, caracteristicas, foto_url)
      VALUES (${parsed.data.codigo}, ${parsed.data.area_m2}, ${parsed.data.ubicacion || null}, ${parsed.data.valor}, ${parsed.data.estado}, ${parsed.data.etapa_id}, ${parsed.data.descripcion || null}, ${parsed.data.cuartos}, ${parsed.data.baños}, ${parsed.data.caracteristicas || null}, ${parsed.data.foto_url || null})
    `
  } catch {
    return { error: 'El codigo de lote ya existe' }
  }

  revalidatePath('/admin/lotes')
  revalidatePath('/dashboard/lotes')
  return { success: true }
}

export async function actualizarLoteAction(_prevState: unknown, formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  const raw = {
    codigo: formData.get('codigo'),
    area_m2: formData.get('area_m2'),
    ubicacion: getOptionalString(formData.get('ubicacion')),
    valor: formData.get('valor'),
    estado: formData.get('estado') || 'disponible',
    etapa_id: formData.get('etapa_id') === 'none' ? null : getOptionalString(formData.get('etapa_id')) || null,
    descripcion: getOptionalString(formData.get('descripcion')),
    cuartos: formData.get('cuartos') || 0,
    baños: formData.get('baños') || 0,
    caracteristicas: getOptionalString(formData.get('caracteristicas')),
    foto_url: getOptionalString(formData.get('foto_url')),
  }
  const parsed = loteSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const sql = getDb()
  try {
    await sql`
      UPDATE lotes 
      SET codigo = ${parsed.data.codigo}, area_m2 = ${parsed.data.area_m2}, ubicacion = ${parsed.data.ubicacion || null}, valor = ${parsed.data.valor}, 
          estado = ${parsed.data.estado}, etapa_id = ${parsed.data.etapa_id}, descripcion = ${parsed.data.descripcion || null},
          cuartos = ${parsed.data.cuartos}, baños = ${parsed.data.baños}, caracteristicas = ${parsed.data.caracteristicas || null},
          foto_url = ${parsed.data.foto_url || null}, updated_at = NOW()
      WHERE id = ${Number(id)}
    `
  } catch {
    return { error: 'Error al actualizar el lote' }
  }

  revalidatePath('/admin/lotes')
  revalidatePath('/dashboard/lotes')
  return { success: true }
}

export async function actualizarLoteEstadoAction(loteId: number, estado: string) {
  await requireAdmin()
  const sql = getDb()
  await sql`UPDATE lotes SET estado = ${estado}, updated_at = NOW() WHERE id = ${loteId}`
  revalidatePath('/admin/lotes')
  revalidatePath('/admin/compras')
}

// --- Payment management ---
export async function aprobarPagoAction(pagoId: number) {
  await requireAdmin()
  const sql = getDb()

  const pagos = await sql`SELECT * FROM pagos WHERE id = ${pagoId}`
  if (pagos.length === 0) return

  const pago = pagos[0]
  await sql`UPDATE pagos SET estado = 'aprobado' WHERE id = ${pagoId}`
  await sql`UPDATE compras SET saldo_pendiente = saldo_pendiente - ${pago.monto} WHERE id = ${pago.compra_id}`

  // Check if fully paid
  const compra = await sql`SELECT * FROM compras WHERE id = ${pago.compra_id}`
  if (compra.length > 0 && Number(compra[0].saldo_pendiente) <= 0) {
    await sql`UPDATE compras SET estado = 'completada', saldo_pendiente = 0 WHERE id = ${pago.compra_id}`
    await sql`UPDATE lotes SET estado = 'vendido' WHERE id = ${compra[0].lote_id}`
  }

  revalidatePath('/admin/pagos')
  revalidatePath('/admin/compras')
}

export async function rechazarPagoAction(pagoId: number) {
  await requireAdmin()
  const sql = getDb()
  await sql`UPDATE pagos SET estado = 'rechazado' WHERE id = ${pagoId}`
  revalidatePath('/admin/pagos')
}

// --- Purchase management ---
const compraSchema = z.object({
  cliente_id: z.coerce.number().positive(),
  lote_id: z.coerce.number().positive(),
  cuota_inicial: z.coerce.number().min(0),
  num_cuotas: z.coerce.number().min(1),
})

export async function crearCompraAction(_prevState: unknown, formData: FormData) {
  await requireAdmin()
  const raw = {
    cliente_id: formData.get('cliente_id'),
    lote_id: formData.get('lote_id'),
    cuota_inicial: formData.get('cuota_inicial'),
    num_cuotas: formData.get('num_cuotas'),
  }
  const parsed = compraSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const sql = getDb()
  const lotes = await sql`SELECT * FROM lotes WHERE id = ${parsed.data.lote_id} AND estado = 'disponible'`
  if (lotes.length === 0) return { error: 'Lote no disponible' }

  const lote = lotes[0]
  const valorTotal = Number(lote.valor)
  const cuotaInicial = parsed.data.cuota_inicial
  const saldoPendiente = valorTotal - cuotaInicial
  const valorCuota = parsed.data.num_cuotas > 0 ? saldoPendiente / parsed.data.num_cuotas : 0

  await sql`
    INSERT INTO compras (cliente_id, lote_id, valor_total, cuota_inicial, num_cuotas, valor_cuota, saldo_pendiente, estado)
    VALUES (${parsed.data.cliente_id}, ${parsed.data.lote_id}, ${valorTotal}, ${cuotaInicial}, ${parsed.data.num_cuotas}, ${valorCuota}, ${saldoPendiente}, 'activa')
  `
  await sql`UPDATE lotes SET estado = 'reservado', updated_at = NOW() WHERE id = ${parsed.data.lote_id}`

  revalidatePath('/admin/compras')
  revalidatePath('/admin/lotes')
  return { success: true }
}

// --- PQRS management ---
export async function responderPqrsAction(_prevState: unknown, formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  const respuesta = formData.get('respuesta') as string
  const estado = formData.get('estado') as string

  if (!respuesta) return { error: 'La respuesta es requerida' }

  const sql = getDb()
  await sql`UPDATE pqrs SET respuesta = ${respuesta}, estado = ${estado || 'resuelto'}, updated_at = NOW() WHERE id = ${Number(id)}`

  revalidatePath('/admin/pqrs')
  return { success: true }
}

// --- User management ---
export async function crearUsuarioAction(_prevState: unknown, formData: FormData) {
  await requireAdmin()
  const nombre = formData.get('nombre') as string
  const apellido = formData.get('apellido') as string
  const email = formData.get('email') as string
  const telefono = formData.get('telefono') as string
  const password = formData.get('password') as string
  const rol = formData.get('rol') as string

  if (!nombre || !apellido || !email || !password) return { error: 'Todos los campos son requeridos' }

  const sql = getDb()
  const existing = await sql`SELECT id FROM usuarios WHERE email = ${email}`
  if (existing.length > 0) return { error: 'Ya existe un usuario con este email' }

  const passwordHash = await bcrypt.hash(password, 12)
  await sql`
    INSERT INTO usuarios (nombre, apellido, email, telefono, password_hash, rol, verificado)
    VALUES (${nombre}, ${apellido}, ${email}, ${telefono || null}, ${passwordHash}, ${rol || 'cliente'}, true)
  `

  revalidatePath('/admin/usuarios')
  return { success: true }
}

export async function actualizarUsuarioAction(_prevState: unknown, formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  const nombre = formData.get('nombre') as string
  const apellido = formData.get('apellido') as string
  const email = formData.get('email') as string
  const telefono = formData.get('telefono') as string
  const rol = formData.get('rol') as string
  const password = formData.get('password') as string

  if (!nombre || !apellido || !email) return { error: 'Todos los campos son requeridos' }

  const sql = getDb()
  
  // Check if email is already in use by another user
  const existing = await sql`SELECT id FROM usuarios WHERE email = ${email} AND id != ${Number(id)}`
  if (existing.length > 0) return { error: 'Ya existe un usuario con este email' }

  if (password) {
    // If password is provided, update it
    const passwordHash = await bcrypt.hash(password, 12)
    await sql`
      UPDATE usuarios 
      SET nombre = ${nombre}, apellido = ${apellido}, email = ${email}, telefono = ${telefono || null}, password_hash = ${passwordHash}
      WHERE id = ${Number(id)}
    `
  } else {
    // If no password, just update the other fields
    await sql`
      UPDATE usuarios 
      SET nombre = ${nombre}, apellido = ${apellido}, email = ${email}, telefono = ${telefono || null}, rol = ${rol}
      WHERE id = ${Number(id)}
    `
  }

  revalidatePath('/admin/usuarios')
  return { success: true }
}

// --- Stage management ---
export async function crearEtapaAction(_prevState: unknown, formData: FormData) {
  await requireAdmin()
  const nombre = formData.get('nombre') as string
  const descripcion = formData.get('descripcion') as string
  const orden = Number(formData.get('orden'))
  const activa = formData.get('activa') === 'on'

  if (!nombre) return { error: 'El nombre es requerido' }

  const sql = getDb()
  await sql`INSERT INTO etapas (nombre, descripcion, orden, activa) VALUES (${nombre}, ${descripcion || null}, ${orden || 0}, ${activa})`

  revalidatePath('/admin/etapas')
  return { success: true }
}

export async function toggleEtapaAction(id: number, activa: boolean) {
  await requireAdmin()
  const sql = getDb()
  await sql`UPDATE etapas SET activa = ${activa} WHERE id = ${id}`
  revalidatePath('/admin/etapas')
}

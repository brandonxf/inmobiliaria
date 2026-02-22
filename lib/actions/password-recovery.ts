'use server'

import { getDb } from '@/lib/db'
import { sendPasswordRecoveryEmail } from '@/lib/email'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const requestResetSchema = z.object({
  email: z.string().email('Email invalido'),
})

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token invalido'),
  password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contrasenas no coinciden',
  path: ['confirmPassword'],
})

export async function requestPasswordResetAction(_prevState: unknown, formData: FormData) {
  const raw = { email: formData.get('email') as string }

  const parsed = requestResetSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const sql = getDb()
  const users = await sql`SELECT id, nombre, email FROM usuarios WHERE email = ${parsed.data.email}`

  // Always return success to prevent email enumeration
  if (users.length === 0) {
    return { success: true }
  }

  const user = users[0]
  const token = crypto.randomBytes(32).toString('hex')
  const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  await sql`
    UPDATE usuarios SET token_recuperacion = ${token}, token_recuperacion_expira = ${expiry.toISOString()}
    WHERE id = ${user.id}
  `

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'
  const resetUrl = `${baseUrl}/restablecer?token=${token}`

  await sendPasswordRecoveryEmail(user.email, {
    nombre: user.nombre,
    resetUrl,
  })

  return { success: true }
}

export async function resetPasswordAction(_prevState: unknown, formData: FormData) {
  const raw = {
    token: formData.get('token') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  const parsed = resetPasswordSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const sql = getDb()
  const users = await sql`
    SELECT id FROM usuarios 
    WHERE token_recuperacion = ${parsed.data.token} 
      AND token_recuperacion_expira > NOW()
  `

  if (users.length === 0) {
    return { error: 'El enlace ha expirado o es invalido. Solicita uno nuevo.' }
  }

  const user = users[0]
  const passwordHash = await bcrypt.hash(parsed.data.password, 12)

  await sql`
    UPDATE usuarios SET password_hash = ${passwordHash}, token_recuperacion = NULL, token_recuperacion_expira = NULL, updated_at = NOW()
    WHERE id = ${user.id}
  `

  return { success: true }
}

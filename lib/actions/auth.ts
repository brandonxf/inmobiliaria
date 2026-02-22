'use server'

import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/db'
import { createSession, deleteSession, getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

const registerSchema = z.object({
  nombre: z.string().min(2, 'El nombre es requerido'),
  apellido: z.string().min(2, 'El apellido es requerido'),
  email: z.string().email('Email inválido'),
  telefono: z.string().optional(),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

export async function loginAction(_prevState: unknown, formData: FormData) {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const sql = getDb()
  const users = await sql`SELECT * FROM usuarios WHERE email = ${parsed.data.email}`

  if (users.length === 0) {
    return { error: 'Credenciales incorrectas' }
  }

  const user = users[0]
  const passwordMatch = await bcrypt.compare(parsed.data.password, user.password_hash)

  if (!passwordMatch) {
    return { error: 'Credenciales incorrectas' }
  }

  await createSession({
    userId: user.id,
    email: user.email,
    nombre: user.nombre,
    apellido: user.apellido,
    rol: user.rol,
  })

  if (user.rol === 'admin') {
    redirect('/admin')
  } else {
    redirect('/dashboard')
  }
}

export async function registerAction(_prevState: unknown, formData: FormData) {
  const raw = {
    nombre: formData.get('nombre') as string,
    apellido: formData.get('apellido') as string,
    email: formData.get('email') as string,
    telefono: formData.get('telefono') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  const parsed = registerSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const sql = getDb()

  const existing = await sql`SELECT id FROM usuarios WHERE email = ${parsed.data.email}`
  if (existing.length > 0) {
    return { error: 'Ya existe una cuenta con este email' }
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12)

  const result = await sql`
    INSERT INTO usuarios (nombre, apellido, email, telefono, password_hash, rol, verificado)
    VALUES (${parsed.data.nombre}, ${parsed.data.apellido}, ${parsed.data.email}, ${parsed.data.telefono || null}, ${passwordHash}, 'cliente', true)
    RETURNING id, nombre, apellido, email, rol
  `

  const user = result[0]
  await createSession({
    userId: user.id,
    email: user.email,
    nombre: user.nombre,
    apellido: user.apellido,
    rol: user.rol,
  })

  redirect('/dashboard')
}

export async function logoutAction() {
  await deleteSession()
  redirect('/login')
}

export async function getCurrentUser() {
  return await getSession()
}

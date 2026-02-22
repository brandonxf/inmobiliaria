import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'inmobiliaria-secret-key-change-in-production'
)

const publicPaths = ['/', '/login', '/registro', '/recuperar', '/restablecer', '/api/auth']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths, static files, and API auth routes
  if (
    publicPaths.some(p => pathname === p || pathname.startsWith(p + '/')) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/apple') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const token = request.cookies.get('session')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const rol = payload.rol as string

    // Protect admin routes
    if (pathname.startsWith('/admin') && rol !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Protect client routes
    if (pathname.startsWith('/dashboard') && rol !== 'cliente' && rol !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
  } catch {
    // Invalid token - redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('session')
    return response
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

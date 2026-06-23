import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Capturamos el token de las cookies o del encabezado de autorización
  const token = request.cookies.get('pyme_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  // Ajustamos las rutas clave para el entorno de Administración Centralizado
  const isLoginPage = request.nextUrl.pathname === '/loginAdmin'; // ❌ Corregido a /loginAdmin
  const isRootPage = request.nextUrl.pathname === '/';

  // CASO 1: Si no hay token y el usuario NO está en la página de login, lo obligamos a loguearse
  if (!token && !isLoginPage) {
    // Excepción: Dejamos pasar la página raíz '/' porque ella misma hace un router.replace a /loginAdmin
    if (isRootPage) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/loginAdmin', request.url)); // ❌ Corregido a /loginAdmin
  }

  // CASO 2: Si el usuario SÍ tiene un token válido e intenta entrar al login, lo saltamos directo al panel
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/admin/monitoreo', request.url)); // ❌ Corregido a /admin/monitoreo
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
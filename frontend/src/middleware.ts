import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// El middleware intercepta las peticiones y verifica la seguridad antes de renderizar
export function middleware(request: NextRequest) {
  
  // 1. Protección de Rutas (Ejemplo básico para /admin)
  // Si el usuario intenta acceder a /admin pero no tiene un token (cookie), lo redirigimos a /login
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth_token')?.value;
    
    // Si no hay token de sesión, redirige al login.
    // Para entornos locales se podría omitir o modificar, pero esta es la regla estricta.
    if (!token && process.env.NODE_ENV === 'production') {
       return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  const response = NextResponse.next();

  // 2. Cabeceras Anti-Intrusos específicas para el runtime
  // Esto protege contra secuestro de clics (Clickjacking) y envenenamiento MIME
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

// Configurar sobre qué rutas aplica este middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

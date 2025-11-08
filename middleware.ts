import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Obtener usuario y su rol desde la metadata
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const userRole = user?.user_metadata?.rol

    const { pathname } = request.nextUrl

    // Permitir acceso a rutas públicas sin autenticación
    if (!user && !pathname.startsWith('/auth') && pathname !== '/') {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Redirigir desde login si ya está autenticado
    if (user && pathname === '/') {
        // Redirección basada en rol
        switch (userRole) {
            case 'admin':
                return NextResponse.redirect(new URL('/admin', request.url))
            case 'chofer':
                return NextResponse.redirect(new URL('/chofer', request.url))
            case 'comercio':
                return NextResponse.redirect(new URL('/comercio', request.url))
            default:
                // Si no tiene rol, permanece en login
                return response
        }
    }

    // Solo validar roles si el usuario está autenticado
    if (user) {
        // Proteger rutas de admin
        if (pathname.startsWith('/admin') && userRole !== 'admin') {
            // Redirigir según el rol del usuario
            if (userRole === 'chofer') {
                return NextResponse.redirect(new URL('/chofer', request.url))
            } else if (userRole === 'comercio') {
                return NextResponse.redirect(new URL('/comercio', request.url))
            } else {
                return NextResponse.redirect(new URL('/', request.url))
            }
        }

        // Proteger rutas de chofer
        if (pathname.startsWith('/chofer') && userRole !== 'chofer') {
            // Redirigir según el rol del usuario
            if (userRole === 'admin') {
                return NextResponse.redirect(new URL('/admin', request.url))
            } else if (userRole === 'comercio') {
                return NextResponse.redirect(new URL('/comercio', request.url))
            } else {
                return NextResponse.redirect(new URL('/', request.url))
            }
        }

        // Proteger rutas de comercio
        if (pathname.startsWith('/comercio') && userRole !== 'comercio') {
            // Redirigir según el rol del usuario
            if (userRole === 'admin') {
                return NextResponse.redirect(new URL('/admin', request.url))
            } else if (userRole === 'chofer') {
                return NextResponse.redirect(new URL('/chofer', request.url))
            } else {
                return NextResponse.redirect(new URL('/', request.url))
            }
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Coincide con todas las rutas de solicitud excepto las que comienzan con:
         * - api (rutas de API)
         * - _next/static (archivos estáticos)
         * - _next/image (archivos de optimización de imágenes)
         * - favicon.ico (archivo favicon)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
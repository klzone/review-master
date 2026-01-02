import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
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
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 刷新会话
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // 检查受保护路由
    const protectedRoutes = ['/dashboard', '/trades', '/analysis', '/rules', '/profile', '/review']
    const authRoutes = ['/login', '/register']
    const pathname = request.nextUrl.pathname

    // 未登录用户访问受保护路由 -> 重定向到登录
    if (!user && protectedRoutes.some((route) => pathname.startsWith(route))) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // 已登录用户访问登录/注册页 -> 重定向到首页
    if (user && authRoutes.includes(pathname)) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}

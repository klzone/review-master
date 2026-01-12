'use client'

import { BottomNav } from '@/components/layout'
import { usePathname } from 'next/navigation'

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    // 这里的路径列表将不显示底部导航栏
    const hideBottomNavRoutes = ['/trades/new', '/profile/edit', '/feedback', '/about']
    const showBottomNav = !hideBottomNavRoutes.includes(pathname)

    return (
        <>
            {children}
            {showBottomNav && <BottomNav />}
        </>
    )
}

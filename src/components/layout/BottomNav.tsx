'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
    href: string
    label: string
    icon: React.ReactNode
    activeIcon?: React.ReactNode
}

const navItems: NavItem[] = [
    {
        href: '/dashboard',
        label: '首页',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        href: '/analysis',
        label: '统计',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
    },
    {
        href: '/trades',
        label: '日志',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    {
        href: '/profile',
        label: '我的',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border pb-safe">
            <div className="max-w-md mx-auto px-6 py-2">
                <ul className="flex justify-between items-center relative">
                    {navItems.slice(0, 2).map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`flex flex-col items-center gap-1 py-2 px-4 transition-colors ${pathname === item.href
                                        ? 'text-primary'
                                        : 'text-text-muted hover:text-text-sub'
                                    }`}
                            >
                                {item.icon}
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        </li>
                    ))}

                    {/* 中间的添加按钮 */}
                    <li className="relative -top-4">
                        <Link
                            href="/trades/new"
                            className="flex items-center justify-center w-14 h-14 bg-accent text-white rounded-full shadow-lg shadow-accent/30 hover:scale-105 transition-transform active:scale-95 border-4 border-bg"
                        >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </Link>
                    </li>

                    {navItems.slice(2).map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`flex flex-col items-center gap-1 py-2 px-4 transition-colors ${pathname === item.href
                                        ? 'text-primary'
                                        : 'text-text-muted hover:text-text-sub'
                                    }`}
                            >
                                {item.icon}
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}

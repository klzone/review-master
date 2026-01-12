'use client'

import { useUser } from '@/lib/hooks/useUser'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function ProfilePage() {
    const { user, loading, signOut } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    const handleLogout = async () => {
        await signOut()
        router.push('/login')
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-text-muted">正在加载用户信息...</p>
                    <button
                        onClick={handleLogout}
                        className="text-xs text-primary underline opacity-50 hover:opacity-100 transition-opacity mt-4"
                    >
                        加载太久？强制退出并重试
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-md mx-auto min-h-screen pb-24 px-5">
            {/* 顶栏 */}
            <header className="pt-12 pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-text">我的</h1>
                    <p className="text-sm text-text-sub mt-1">记录交易，遇见更好的自己</p>
                </div>
            </header>

            {/* 用户基本信息卡片 */}
            <div className="bg-card rounded-2xl p-6 border border-border mt-2 shadow-soft">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
                        {user?.user_metadata?.avatar_url ? (
                            <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <svg className="w-8 h-8 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        )}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-text">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || '交易员'}</h2>
                        <p className="text-sm text-text-muted mt-0.5">{user?.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
                        <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium">账户等级</p>
                        <p className="text-sm font-bold text-primary mt-1">专业版用户</p>
                    </div>
                    <div className="bg-accent/5 rounded-xl p-3 border border-accent/10">
                        <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium">复盘天数</p>
                        <p className="text-sm font-bold text-accent mt-1">128 天</p>
                    </div>
                </div>
            </div>

            {/* 功能菜单列表 */}
            <div className="mt-8 space-y-3">
                <h3 className="text-xs font-semibold text-text-muted px-1 uppercase tracking-widest mb-2">个人设置</h3>

                <Link href="/profile/edit" className="flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:bg-bg transition-colors active:scale-[0.98] tap-highlight">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <span className="font-medium text-text">个人资料</span>
                    </div>
                    <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>

                <Link href="/profile/settings" className="flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:bg-bg transition-colors active:scale-[0.98] tap-highlight">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <span className="font-medium text-text">系统设置</span>
                    </div>
                    <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>

            <div className="mt-8 space-y-3">
                <h3 className="text-xs font-semibold text-text-muted px-1 uppercase tracking-widest mb-2">支持</h3>

                <Link href="/feedback" className="flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:bg-bg transition-colors active:scale-[0.98] tap-highlight">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                        </div>
                        <span className="font-medium text-text">意见反馈</span>
                    </div>
                    <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>

                <Link href="/about" className="flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:bg-bg transition-colors active:scale-[0.98] tap-highlight">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="font-medium text-text">关于复盘大师</span>
                    </div>
                    <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>

            <button
                onClick={handleLogout}
                className="w-full mt-10 p-4 flex items-center justify-center gap-2 text-red-500 font-bold bg-red-500/5 rounded-xl border border-red-500/20 hover:bg-red-500/10 transition-colors active:scale-95 tap-highlight"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                退出登录
            </button>
        </div>
    )
}

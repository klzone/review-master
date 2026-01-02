'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button, Card, Input } from '@/components/ui'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                setError(error.message)
            } else {
                router.push('/dashboard')
                router.refresh()
            }
        } catch (err) {
            setError('登录失败，请稍后重试')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-bg flex flex-col">
            {/* 顶部装饰 */}
            <div className="h-48 bg-gradient-to-br from-primary via-primary/80 to-accent/60 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent/30 rounded-full blur-3xl" />
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

                <div className="relative z-10 px-6 pt-16">
                    <h1 className="text-3xl font-bold text-white">复盘大师</h1>
                    <p className="text-white/70 text-sm mt-1">专业交易复盘助手</p>
                </div>
            </div>

            {/* 登录表单 */}
            <div className="flex-1 -mt-12 px-5">
                <Card variant="elevated" padding="lg" className="relative z-10">
                    <h2 className="text-xl font-bold text-text mb-6">登录账户</h2>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            label="邮箱"
                            type="email"
                            placeholder="请输入邮箱地址"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            label="密码"
                            type="password"
                            placeholder="请输入密码"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {error && (
                            <div className="p-3 bg-up/10 border border-up/20 rounded-lg">
                                <p className="text-xs text-up font-medium">{error}</p>
                            </div>
                        )}

                        <div className="flex justify-between items-center text-xs">
                            <label className="flex items-center gap-2 text-text-sub cursor-pointer">
                                <input type="checkbox" className="rounded border-border" />
                                记住我
                            </label>
                            <button type="button" className="text-primary font-medium hover:underline">
                                忘记密码？
                            </button>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={loading}
                            className="mt-6"
                        >
                            登录
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-center text-sm text-text-sub">
                            还没有账户？{' '}
                            <Link href="/register" className="text-primary font-medium hover:underline">
                                立即注册
                            </Link>
                        </p>
                    </div>
                </Card>

                {/* 快捷登录 */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-text-muted mb-4">或使用以下方式登录</p>
                    <div className="flex justify-center gap-4">
                        <button className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-bg transition-colors">
                            <svg className="w-5 h-5 text-text-sub" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </button>
                        <button className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-bg transition-colors">
                            <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098c.934.256 1.932.395 2.966.395 4.8 0 8.691-3.288 8.691-7.342-.001-4.054-3.892-7.332-8.82-7.332zM5.785 10.99a1.148 1.148 0 1 1 0-2.297 1.148 1.148 0 0 1 0 2.297zm5.907 0a1.148 1.148 0 1 1 0-2.297 1.148 1.148 0 0 1 0 2.297z" />
                                <path d="M23.995 14.791c0-3.424-3.323-6.183-7.432-6.183-.058 0-.116.003-.173.004-.054.001-.108-.004-.162-.004-.346 0-.685.019-1.019.053 2.633 1.193 4.371 3.435 4.371 6.039 0 .862-.189 1.685-.53 2.445a8.12 8.12 0 0 0 1.341.113 6.6 6.6 0 0 0 2.066-.282.603.603 0 0 1 .5.068l1.326.776a.227.227 0 0 0 .116.038c.111 0 .202-.092.202-.205 0-.051-.02-.1-.033-.148l-.272-1.029a.41.41 0 0 1 .148-.46c1.275-.93 2.09-2.316 2.09-3.82z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* 底部提示 */}
                <p className="text-center text-[10px] text-text-muted mt-8 mb-6">
                    登录即表示您同意我们的
                    <button className="text-text-sub hover:underline mx-1">服务条款</button>
                    和
                    <button className="text-text-sub hover:underline mx-1">隐私政策</button>
                </p>
            </div>
        </div>
    )
}

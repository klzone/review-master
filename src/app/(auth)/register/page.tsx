'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button, Card, Input } from '@/components/ui'

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        displayName: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // 验证密码
        if (formData.password !== formData.confirmPassword) {
            setError('两次输入的密码不一致')
            setLoading(false)
            return
        }

        if (formData.password.length < 6) {
            setError('密码长度至少6位')
            setLoading(false)
            return
        }

        try {
            const supabase = createClient()

            // 注册用户
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        display_name: formData.displayName || formData.email.split('@')[0],
                    },
                },
            })

            if (signUpError) {
                setError(signUpError.message)
            } else if (data.user) {
                // 创建用户配置
                await supabase.from('user_profiles').insert({
                    id: data.user.id,
                    display_name: formData.displayName || formData.email.split('@')[0],
                    initial_capital: 100000,
                } as any)

                setSuccess(true)
            }
        } catch (err) {
            setError('注册失败，请稍后重试')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center px-5">
                <Card variant="elevated" padding="lg" className="text-center max-w-sm w-full">
                    <div className="w-16 h-16 rounded-full bg-down/10 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-down" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-text mb-2">注册成功！</h2>
                    <p className="text-sm text-text-sub mb-6">
                        请查看您的邮箱 <span className="text-primary font-medium">{formData.email}</span> 并点击验证链接完成注册。
                    </p>
                    <Link href="/login">
                        <Button variant="primary" fullWidth>
                            返回登录
                        </Button>
                    </Link>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-bg flex flex-col">
            {/* 顶部装饰 */}
            <div className="h-40 bg-gradient-to-br from-primary via-primary/80 to-accent/60 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent/30 rounded-full blur-3xl" />

                <div className="relative z-10 px-6 pt-12">
                    <Link href="/login" className="inline-flex items-center text-white/70 hover:text-white text-sm mb-4">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        返回
                    </Link>
                    <h1 className="text-2xl font-bold text-white">创建账户</h1>
                </div>
            </div>

            {/* 注册表单 */}
            <div className="flex-1 -mt-8 px-5 pb-8">
                <Card variant="elevated" padding="lg" className="relative z-10">
                    <form onSubmit={handleRegister} className="space-y-4">
                        <Input
                            label="昵称"
                            type="text"
                            placeholder="给自己取个交易代号"
                            value={formData.displayName}
                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        />

                        <Input
                            label="邮箱"
                            type="email"
                            placeholder="用于登录和接收通知"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />

                        <Input
                            label="密码"
                            type="password"
                            placeholder="设置登录密码（至少6位）"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />

                        <Input
                            label="确认密码"
                            type="password"
                            placeholder="再次输入密码"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />

                        {error && (
                            <div className="p-3 bg-up/10 border border-up/20 rounded-lg">
                                <p className="text-xs text-up font-medium">{error}</p>
                            </div>
                        )}

                        <div className="pt-2">
                            <label className="flex items-start gap-2 text-xs text-text-sub cursor-pointer">
                                <input type="checkbox" className="rounded border-border mt-0.5" required />
                                <span>
                                    我已阅读并同意
                                    <button type="button" className="text-primary hover:underline mx-1">服务条款</button>
                                    和
                                    <button type="button" className="text-primary hover:underline mx-1">隐私政策</button>
                                </span>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={loading}
                            className="mt-4"
                        >
                            创建账户
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-center text-sm text-text-sub">
                            已有账户？{' '}
                            <Link href="/login" className="text-primary font-medium hover:underline">
                                立即登录
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    )
}

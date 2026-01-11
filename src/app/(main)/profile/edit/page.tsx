'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function EditProfilePage() {
    const supabase = createClient()
    const router = useRouter()
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [message, setMessage] = useState({ type: '', content: '' })

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setFullName(user.user_metadata?.full_name || '')
            }
            setLoading(false)
        }
        getUser()
    }, [supabase.auth])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setUpdating(true)
        setMessage({ type: '', content: '' })

        const { error } = await supabase.auth.updateUser({
            data: { full_name: fullName }
        })

        if (error) {
            setMessage({ type: 'error', content: '更新失败: ' + error.message })
        } else {
            setMessage({ type: 'success', content: '个人资料已更新' })
            setTimeout(() => router.back(), 1500)
        }
        setUpdating(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="max-w-md mx-auto min-h-screen pb-24 px-5">
            {/* 顶栏 */}
            <header className="pt-12 pb-6 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 rounded-full hover:bg-card transition-colors active:scale-95"
                >
                    <svg className="w-6 h-6 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold text-text">个人资料</h1>
            </header>

            <form onSubmit={handleUpdate} className="mt-4 space-y-6">
                <div className="flex flex-col items-center pb-6">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
                            <svg className="w-12 h-12 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <button type="button" className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg border-2 border-bg transition-transform active:scale-90">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-xs text-text-muted mt-3">点击图标修改头像</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-text-sub ml-1">昵称</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full p-4 bg-card border border-border rounded-xl focus:ring-1 focus:ring-primary/30 outline-none transition-all text-text font-medium"
                            placeholder="输入你的昵称"
                            required
                        />
                    </div>
                </div>

                {message.content && (
                    <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                        {message.content}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={updating}
                    className="w-full p-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all disabled:opacity-50 active:scale-[0.98] tap-highlight"
                >
                    {updating ? '保存中...' : '保存更改'}
                </button>
            </form>
        </div>
    )
}

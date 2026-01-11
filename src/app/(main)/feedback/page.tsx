'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function FeedbackPage() {
    const router = useRouter()
    const [subject, setSubject] = useState('')
    const [content, setContent] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        // 模拟提交过程
        await new Promise(resolve => setTimeout(resolve, 1000))

        setSubmitting(false)
        setSubmitted(true)

        setTimeout(() => router.back(), 2000)
    }

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-text">感谢您的反馈</h2>
                <p className="text-text-sub mt-2">您的建议对我们非常重要，我们将不断优化产品体验。</p>
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
                <h1 className="text-2xl font-bold text-text">意见反馈</h1>
            </header>

            <p className="text-sm text-text-sub mt-2 leading-relaxed">
                在使用过程中遇到任何问题，或是对我们有任何建议，请随时告诉我们。
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-text-sub ml-1">反馈主题</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full p-4 bg-card border border-border rounded-xl focus:ring-1 focus:ring-primary/30 outline-none transition-all text-text font-medium"
                            placeholder="例如：功能建议、遇到 Bug"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-text-sub ml-1">详细描述</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full p-4 bg-card border border-border rounded-xl focus:ring-1 focus:ring-primary/30 outline-none transition-all text-text font-medium min-h-[200px] resize-none"
                            placeholder="请尽可能详细地描述您的问题或建议..."
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full p-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all disabled:opacity-50 active:scale-[0.98] tap-highlight"
                >
                    {submitting ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            提交中...
                        </div>
                    ) : '提交反馈'}
                </button>
            </form>
        </div>
    )
}

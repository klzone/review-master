'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
    const router = useRouter()
    const [commission, setCommission] = useState('0.00025')
    const [stampTax, setStampTax] = useState('0.001')
    const [darkMode, setDarkMode] = useState(false)
    const [notifications, setNotifications] = useState(true)
    const [initialCapital, setInitialCapital] = useState('')
    const { user } = useUser()
    const [saving, setSaving] = useState(false)

    import { useUser } from '@/lib/hooks'
    import { createClient } from '@/lib/supabase/client'
    // 在实际开发中，这里会从 Supabase 或 LocalStorage 加载设置
    useEffect(() => {
        const savedDarkMode = document.documentElement.classList.contains('dark')
        setDarkMode(savedDarkMode)

        // 加载初始资金
        async function loadProfile() {
            if (!user) return
            const supabase = createClient()
            const { data } = await supabase
                .from('user_profiles')
                .select('initial_capital')
                .eq('id', user.id)
                .single()

            if (data?.initial_capital) {
                setInitialCapital(data.initial_capital.toString())
            } else {
                setInitialCapital('100000') // 默认值
            }
        }
        loadProfile()
    }, [user])

    const handleSaveCapital = async () => {
        if (!user || !initialCapital) return
        setSaving(true)
        const supabase = createClient()
        await supabase
            .from('user_profiles')
            .update({ initial_capital: parseFloat(initialCapital) } as any)
            .eq('id', user.id)

        setSaving(false)
        alert('初始资金设置已保存')
    }

    const toggleDarkMode = () => {
        const newMode = !darkMode
        setDarkMode(newMode)
        if (newMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
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
                <h1 className="text-2xl font-bold text-text">系统设置</h1>
            </header>

            {/* 资金设置 */}
            <div className="mt-4 space-y-4">
                <h3 className="text-xs font-semibold text-text-muted px-1 uppercase tracking-widest mb-2">资金管理</h3>
                <div className="bg-card rounded-2xl border border-border divide-y divide-border overflow-hidden shadow-soft">
                    <div className="p-4 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-text">初始本金</p>
                            <p className="text-xs text-text-muted mt-0.5">用于计算收益率的基准本金</p>
                        </div>
                        <div className="relative flex items-center gap-2">
                            <span className="text-sm font-bold text-text-muted">¥</span>
                            <input
                                type="number"
                                value={initialCapital}
                                onChange={(e) => setInitialCapital(e.target.value)}
                                onBlur={handleSaveCapital}
                                className="w-28 text-right bg-bg border-none rounded-lg py-1 px-3 text-sm font-bold text-primary focus:ring-1 focus:ring-primary/30"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 交易费率设置 */}
            <div className="mt-4 space-y-4">
                <h3 className="text-xs font-semibold text-text-muted px-1 uppercase tracking-widest mb-2">交易默认费率</h3>
                <div className="bg-card rounded-2xl border border-border divide-y divide-border overflow-hidden shadow-soft">
                    <div className="p-4 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-text">佣金比例</p>
                            <p className="text-xs text-text-muted mt-0.5">买入与卖出时的券商佣金</p>
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                value={commission}
                                onChange={(e) => setCommission(e.target.value)}
                                className="w-24 text-right bg-bg border-none rounded-lg py-1 px-3 text-sm font-bold text-primary focus:ring-1 focus:ring-primary/30"
                                step="0.00001"
                            />
                        </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-text">印花税</p>
                            <p className="text-xs text-text-muted mt-0.5">仅在卖出时收取的国家税费</p>
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                value={stampTax}
                                onChange={(e) => setStampTax(e.target.value)}
                                className="w-24 text-right bg-bg border-none rounded-lg py-1 px-3 text-sm font-bold text-primary focus:ring-1 focus:ring-primary/30"
                                step="0.0001"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 应用设置 */}
            <div className="mt-8 space-y-4">
                <h3 className="text-xs font-semibold text-text-muted px-1 uppercase tracking-widest mb-2">应用外观</h3>
                <div className="bg-card rounded-2xl border border-border divide-y divide-border overflow-hidden shadow-soft">
                    <div className="p-4 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-text">深色模式</p>
                            <p className="text-xs text-text-muted mt-0.5">开启护眼深色界面</p>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-primary' : 'bg-border'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${darkMode ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-text">系统通知</p>
                            <p className="text-xs text-text-muted mt-0.5">每日复盘提醒与重要通告</p>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-primary' : 'bg-border'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 数据管理 */}
            <div className="mt-8 space-y-4">
                <h3 className="text-xs font-semibold text-text-muted px-1 uppercase tracking-widest mb-2">数据管理</h3>
                <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-soft">
                    <button className="w-full p-4 flex items-center justify-between hover:bg-bg transition-colors active:scale-[0.98]">
                        <span className="font-medium text-text">导出成交数据</span>
                        <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="mt-12 text-center">
                <p className="text-xs text-text-muted">复盘大师 版本 1.2.0</p>
                <p className="text-[10px] text-text-muted mt-1 opacity-50">© 2026 Yvan Planet. All Rights Reserved.</p>
            </div>
        </div>
    )
}

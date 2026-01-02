'use client'

import Link from 'next/link'
import { Header, PageContainer } from '@/components/layout'
import { Card, Button, ProgressBar } from '@/components/ui'
import { useStats, useUser } from '@/lib/hooks'

export default function DashboardPage() {
    const { user, profile, loading: userLoading } = useUser()
    const { stats, loading: statsLoading } = useStats()

    const loading = userLoading || statsLoading

    // 默认值
    const displayName = profile?.display_name || user?.email?.split('@')[0] || '交易员'
    const totalAsset = stats?.totalAsset || 0
    const assetChange = stats?.assetChange || 0
    const metrics = {
        returnRate: stats?.returnRate || 0,
        winRate: stats?.winRate || 0,
        profitLossRatio: stats?.profitLossRatio || 0,
        maxDrawdown: stats?.maxDrawdown || 0,
    }
    const reviewProgress = stats?.reviewProgress || { completed: 0, total: 0 }

    return (
        <PageContainer>
            <Header user={{ name: displayName, avatarUrl: profile?.avatar_url || undefined }} />

            <main className="px-5 space-y-5 pt-4">
                {/* 总资产卡片 */}
                <Card variant="elevated" padding="lg" className="relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-up/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <div>
                            <p className="text-sm font-medium text-text-sub">总资产</p>
                            <h3 className="text-3xl font-bold text-text mt-1">
                                {loading ? (
                                    <span className="animate-pulse bg-card rounded w-32 h-8 inline-block" />
                                ) : (
                                    `¥${totalAsset.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`
                                )}
                            </h3>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${assetChange >= 0
                                ? 'bg-up/10 border-up/20 text-up'
                                : 'bg-down/10 border-down/20 text-down'
                            }`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={assetChange >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"}
                                />
                            </svg>
                            <span className="text-xs font-bold">
                                {assetChange >= 0 ? '+' : ''}{assetChange.toFixed(1)}%
                            </span>
                        </div>
                    </div>

                    {/* 简易权益曲线 */}
                    <div className="relative h-32 w-full mt-4">
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 50">
                            <defs>
                                <linearGradient id="gradientChart" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor={assetChange >= 0 ? "#EF4444" : "#10B981"} stopOpacity="0.25" />
                                    <stop offset="100%" stopColor={assetChange >= 0 ? "#EF4444" : "#10B981"} stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M0,40 C10,35 20,42 30,30 C40,18 50,35 60,25 C70,15 80,20 90,10 L100,5 L100,50 L0,50 Z"
                                fill="url(#gradientChart)"
                            />
                            <path
                                d="M0,40 C10,35 20,42 30,30 C40,18 50,35 60,25 C70,15 80,20 90,10 L100,5"
                                fill="none"
                                stroke={assetChange >= 0 ? "#EF4444" : "#10B981"}
                                strokeWidth="2"
                                vectorEffect="non-scaling-stroke"
                            />
                            <circle cx="90" cy="10" fill={assetChange >= 0 ? "#EF4444" : "#10B981"} r="3" className="animate-pulse" />
                        </svg>
                    </div>

                    <div className="flex justify-between text-xs text-text-muted mt-2 font-medium">
                        <span>周一</span>
                        <span>周二</span>
                        <span>周三</span>
                        <span>周四</span>
                        <span>周五</span>
                    </div>
                </Card>

                {/* 核心指标网格 */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-text">核心指标</h3>
                        <button className="text-xs font-medium text-text-muted hover:text-text transition-colors flex items-center">
                            查看全部
                            <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Card variant="bordered" padding="md" className="hover:border-up/30 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div className="w-8 h-8 rounded-lg bg-up/10 flex items-center justify-center text-up">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-text-muted font-medium">收益率</p>
                            <p className={`text-lg font-bold mt-0.5 ${metrics.returnRate >= 0 ? 'text-up' : 'text-down'}`}>
                                {metrics.returnRate >= 0 ? '+' : ''}{metrics.returnRate.toFixed(1)}%
                            </p>
                        </Card>

                        <Card variant="bordered" padding="md" className="hover:border-up/30 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div className="w-8 h-8 rounded-lg bg-up/10 flex items-center justify-center text-up">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-text-muted font-medium">胜率</p>
                            <p className="text-lg font-bold text-up mt-0.5">{metrics.winRate.toFixed(0)}%</p>
                        </Card>

                        <Card variant="bordered" padding="md" className="hover:border-accent/30 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0 0v4" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-text-muted font-medium">盈亏比</p>
                            <p className="text-lg font-bold text-accent mt-0.5">{metrics.profitLossRatio.toFixed(2)}</p>
                        </Card>

                        <Card variant="bordered" padding="md" className="hover:border-down/30 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div className="w-8 h-8 rounded-lg bg-down/10 flex items-center justify-center text-down">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-text-muted font-medium">最大回撤</p>
                            <p className="text-lg font-bold text-down mt-0.5">{metrics.maxDrawdown.toFixed(1)}%</p>
                        </Card>
                    </div>
                </section>

                {/* 复盘进度卡片 */}
                <Card variant="elevated" padding="lg" className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    className="text-border"
                                    cx="24"
                                    cy="24"
                                    fill="transparent"
                                    r="20"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <circle
                                    className="text-accent"
                                    cx="24"
                                    cy="24"
                                    fill="transparent"
                                    r="20"
                                    stroke="currentColor"
                                    strokeDasharray={125.6}
                                    strokeDashoffset={125.6 * (1 - (reviewProgress.total > 0 ? reviewProgress.completed / reviewProgress.total : 0))}
                                    strokeLinecap="round"
                                    strokeWidth="4"
                                />
                            </svg>
                            <span className="absolute text-[10px] font-bold text-accent">
                                {reviewProgress.total > 0 ? Math.round((reviewProgress.completed / reviewProgress.total) * 100) : 0}%
                            </span>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-text">本周复盘进度</h4>
                            <p className="text-xs text-text-muted mt-1">
                                已复盘 {reviewProgress.completed}/{reviewProgress.total} 笔交易
                            </p>
                        </div>
                    </div>

                    <Link href="/trades" className="p-2 rounded-lg bg-bg hover:bg-border text-text-muted hover:text-text transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </Card>

                {/* 快捷操作 */}
                <section className="grid grid-cols-2 gap-4 pt-2 pb-6">
                    <Link href="/trades/new">
                        <Button variant="outline" size="lg" fullWidth className="flex-col py-5 gap-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>添加交易</span>
                        </Button>
                    </Link>

                    <Link href="/trades">
                        <Button variant="primary" size="lg" fullWidth className="flex-col py-5 gap-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>开始复盘</span>
                        </Button>
                    </Link>
                </section>
            </main>
        </PageContainer>
    )
}

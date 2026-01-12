'use client'

import { Header, PageContainer } from '@/components/layout'
import { Card, Tag } from '@/components/ui'
import Link from 'next/link'
import { useTrades, useStats } from '@/lib/hooks'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default function TradesPage() {
    const { trades, loading: tradesLoading } = useTrades()
    const { stats, loading: statsLoading } = useStats()

    const loading = tradesLoading || statsLoading

    // 格式化日期显示
    const formatDateLabel = (dateStr: string) => {
        const date = new Date(dateStr)
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        const tradeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

        if (tradeDate.getTime() === today.getTime()) return '今天'
        if (tradeDate.getTime() === yesterday.getTime()) return '昨天'
        return format(date, 'MM月dd日', { locale: zhCN })
    }

    // 按日期分组
    const groupedTrades = trades.reduce((acc, trade) => {
        const dateLabel = formatDateLabel(trade.entry_time)
        if (!acc[dateLabel]) {
            acc[dateLabel] = []
        }
        acc[dateLabel].push(trade)
        return acc
    }, {} as Record<string, typeof trades>)

    if (loading && trades.length === 0) {
        return (
            <PageContainer>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            </PageContainer>
        )
    }

    return (
        <PageContainer>
            {/* 顶部导航 */}
            <nav className="sticky top-0 z-50 bg-bg/95 backdrop-blur-md px-4 py-3 flex justify-between items-center border-b border-border">
                <button className="p-2 -ml-2 rounded-full hover:bg-card transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <div className="flex items-center gap-2">
                    <button className="p-2 rounded-full hover:bg-card transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                    <button className="relative p-2 rounded-full hover:bg-card transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-up rounded-full border border-bg" />
                    </button>
                </div>
            </nav>

            <main className="px-4 pb-24">
                {/* 页面标题 */}
                <header className="mt-6 mb-6">
                    <h1 className="text-3xl font-bold text-text">交易日志</h1>
                    <p className="text-sm text-text-sub mt-1">回顾您的近期表现</p>
                </header>

                {/* 统计卡片 */}
                <section className="grid grid-cols-2 gap-3 mb-6">
                    <Card variant="default" padding="md" className="bg-primary text-white relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-white opacity-10 rounded-full" />
                        <div className="relative z-10">
                            <p className="text-xs text-blue-100 mb-1">总资产</p>
                            <h2 className="text-2xl font-semibold">
                                ¥{stats?.totalAsset?.toLocaleString() || '0'}
                            </h2>
                            <div className={`flex items-center mt-2 text-xs ${stats?.assetChange && stats.assetChange >= 0 ? 'text-red-300' : 'text-green-300'}`}>
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stats?.assetChange && stats.assetChange >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"} />
                                </svg>
                                <span>{stats?.assetChange && stats.assetChange >= 0 ? '+' : ''}{stats?.assetChange?.toFixed(1) || '0.0'}%</span>
                            </div>
                        </div>
                    </Card>

                    <Card variant="bordered" padding="md">
                        <p className="text-xs text-text-sub mb-1">胜率</p>
                        <h2 className="text-2xl font-semibold text-text">{stats?.winRate?.toFixed(0) || '0'}%</h2>
                        <div className="w-full bg-border h-1.5 rounded-full mt-3 overflow-hidden">
                            <div className="bg-up h-1.5 rounded-full" style={{ width: `${stats?.winRate || 0}%` }} />
                        </div>
                        <p className="text-[10px] text-text-sub mt-1 text-right">{trades.length} 笔交易</p>
                    </Card>
                </section>

                {/* 交易列表 */}
                <section className="space-y-4">
                    {trades.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-card border border-dashed border-border rounded-full flex items-center justify-center mx-auto mb-4 grayscale opacity-50">
                                <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <p className="text-text-sub font-medium">暂无交易记录</p>
                            <Link href="/trades/new" className="text-primary text-sm mt-2 inline-block">立即添加第一笔交易</Link>
                        </div>
                    ) : (
                        Object.entries(groupedTrades).map(([date, dayTrades]) => (
                            <div key={date}>
                                {/* 日期分隔线 */}
                                <div className="flex items-center gap-2 my-2">
                                    <div className="h-px bg-border flex-1" />
                                    <span className="text-xs font-semibold text-text-sub uppercase tracking-wider">{date}</span>
                                    <div className="h-px bg-border flex-1" />
                                </div>

                                {/* 交易卡片 */}
                                {dayTrades.map((trade) => (
                                    <Link key={trade.id} href={`/trades/${trade.id}`}>
                                        <Card variant="default" padding="md" hover className="mb-3 border border-transparent hover:border-primary/20">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-bg flex items-center justify-center">
                                                        <span className="font-bold text-xs text-text-sub">{trade.stock_code.slice(0, 4)}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-text leading-tight">{trade.stock_code}</h4>
                                                        <p className="text-xs text-text-sub">{trade.stock_name}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`block font-bold ${(trade.profit_loss_percent || 0) > 0 ? 'text-up' : (trade.profit_loss_percent || 0) < 0 ? 'text-down' : 'text-text-muted'
                                                        }`}>
                                                        {(trade.profit_loss_percent || 0) > 0 ? '+' : ''}{(trade.profit_loss_percent || 0).toFixed(2)}%
                                                    </span>
                                                    <span className="block text-xs text-text-sub">
                                                        {(trade.profit_loss || 0) > 0 ? '+' : ''}{(trade.profit_loss || 0) === 0 ? '¥0.00' : `¥${(trade.profit_loss || 0).toFixed(2)}`}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="border-t border-border pt-3 flex justify-between items-center">
                                                <div className="flex gap-2">
                                                    <Tag variant={trade.direction === 'long' ? 'danger' : 'success'} size="sm">
                                                        {trade.direction === 'long' ? '做多' : '做空'}
                                                    </Tag>
                                                    {trade.trade_type && (
                                                        <Tag variant="default" size="sm">{trade.trade_type}</Tag>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-text-sub flex items-center">
                                                    {format(new Date(trade.entry_time), 'HH:mm')}
                                                    <svg className={`w-4 h-4 ml-1 ${trade.review_status === 'completed' ? 'text-primary' : 'text-text-muted'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        ))
                    )}
                </section>
            </main>

            {/* 浮动添加按钮 */}
            <Link
                href="/trades/new"
                className="fixed bottom-24 right-4 z-40 bg-primary hover:bg-primary-hover text-white rounded-full p-4 shadow-xl shadow-primary/40 transition-transform hover:scale-105 active:scale-95"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </Link>
        </PageContainer>
    )
}

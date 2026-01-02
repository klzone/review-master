'use client'

import { useState } from 'react'
import { PageContainer } from '@/components/layout'
import { Card, Tag, ProgressBar } from '@/components/ui'

// 模拟分析数据
const mockData = {
    totalAsset: 124592.4,
    weeklyChange: 5.2,
    weeklyProfit: 6120.5,
    dailyProfits: [
        { day: '周一', value: 320 },
        { day: '周二', value: -150 },
        { day: '周三', value: 580 },
        { day: '周四', value: 420 },
        { day: '周五', value: 890 },
    ],
    winRate: 68,
    totalWins: 23,
    totalLosses: 11,
    avgFocus: 85,
    avgHoldTime: '2.5小时',
    errors: [
        { name: '追涨杀跌', count: 5, percentage: 35 },
        { name: '过早止盈', count: 3, percentage: 21 },
        { name: '情绪化交易', count: 2, percentage: 14 },
        { name: '仓位过重', count: 2, percentage: 14 },
        { name: '未设止损', count: 2, percentage: 14 },
    ],
    heatmapData: [
        { name: '茅台', code: '600519', value: 2.1 },
        { name: '比亚迪', code: '002594', value: 1.4 },
        { name: '宁德', code: '300750', value: -0.8 },
        { name: '招行', code: '600036', value: 0.6 },
        { name: '腾讯', code: 'HK0700', value: 3.2 },
        { name: '中免', code: '601888', value: -1.2 },
    ],
}

const TIME_PERIODS = ['日', '周', '月', '年']

export default function AnalysisPage() {
    const [selectedPeriod, setSelectedPeriod] = useState('周')

    const maxDailyProfit = Math.max(...mockData.dailyProfits.map((d) => Math.abs(d.value)))

    return (
        <PageContainer>
            {/* 顶部导航 */}
            <nav className="sticky top-0 z-50 bg-bg/95 backdrop-blur-md px-4 py-3 flex justify-between items-center border-b border-border">
                <h1 className="text-xl font-bold text-text">复盘大师</h1>
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
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-400 p-[2px]">
                        <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-sm font-bold text-primary">
                            A
                        </div>
                    </div>
                </div>
            </nav>

            <main className="px-4 pb-24">
                {/* 时间周期选择 */}
                <div className="flex justify-center gap-2 py-4">
                    {TIME_PERIODS.map((period) => (
                        <button
                            key={period}
                            onClick={() => setSelectedPeriod(period)}
                            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${selectedPeriod === period
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-card border border-border text-text-sub hover:text-text'
                                }`}
                        >
                            {period}
                        </button>
                    ))}
                </div>

                {/* 总资产卡片 */}
                <Card variant="elevated" padding="lg" className="mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm text-text-sub font-medium">总资产估值</p>
                            <h2 className="text-3xl font-bold text-text mt-1">
                                ¥{mockData.totalAsset.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                            </h2>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${mockData.weeklyChange >= 0
                                ? 'bg-up/10 border-up/20 text-up'
                                : 'bg-down/10 border-down/20 text-down'
                            }`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mockData.weeklyChange >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"} />
                            </svg>
                            <span className="text-xs font-bold">
                                本周 {mockData.weeklyChange >= 0 ? '+' : ''}{mockData.weeklyChange}%
                            </span>
                        </div>
                    </div>

                    {/* 每日盈亏柱状图 */}
                    <div className="flex items-end justify-between h-24 px-2">
                        {mockData.dailyProfits.map((day, i) => {
                            const height = Math.abs(day.value) / maxDailyProfit * 100
                            return (
                                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                                    <span className={`text-[10px] font-bold ${day.value >= 0 ? 'text-up' : 'text-down'}`}>
                                        {day.value >= 0 ? '+' : ''}{day.value}
                                    </span>
                                    <div
                                        className={`w-8 rounded-t transition-all ${day.value >= 0 ? 'bg-up' : 'bg-down'}`}
                                        style={{ height: `${height}%`, minHeight: '8px' }}
                                    />
                                    <span className="text-[10px] text-text-muted mt-1">{day.day}</span>
                                </div>
                            )
                        })}
                    </div>
                </Card>

                {/* 胜率分析 + 指标 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* 胜率饼图 */}
                    <Card variant="bordered" padding="md">
                        <p className="text-xs text-text-sub font-medium mb-3">胜率分析</p>
                        <div className="flex items-center justify-center">
                            <div className="relative w-20 h-20">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        className="text-down/20"
                                        cx="40"
                                        cy="40"
                                        fill="transparent"
                                        r="32"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                    />
                                    <circle
                                        className="text-up"
                                        cx="40"
                                        cy="40"
                                        fill="transparent"
                                        r="32"
                                        stroke="currentColor"
                                        strokeDasharray={201}
                                        strokeDashoffset={201 * (1 - mockData.winRate / 100)}
                                        strokeLinecap="round"
                                        strokeWidth="12"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-lg font-bold text-text">{mockData.winRate}%</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4 mt-3 text-[10px]">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-up" />
                                <span className="text-text-sub">盈 {mockData.totalWins}</span>
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-down" />
                                <span className="text-text-sub">亏 {mockData.totalLosses}</span>
                            </span>
                        </div>
                    </Card>

                    {/* 其他指标 */}
                    <div className="space-y-3">
                        <Card variant="bordered" padding="md">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] text-text-muted">平均专注度</p>
                                    <p className="text-lg font-bold text-text">{mockData.avgFocus}%</p>
                                </div>
                            </div>
                        </Card>

                        <Card variant="bordered" padding="md">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] text-text-muted">平均持仓时长</p>
                                    <p className="text-lg font-bold text-text">{mockData.avgHoldTime}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* 错误库 Top 榜 */}
                <Card variant="bordered" padding="lg" className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-bold text-text flex items-center gap-2">
                            <svg className="w-5 h-5 text-up" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            错误库 Top 榜
                        </h3>
                        <button className="text-xs text-primary font-medium hover:underline">查看全部</button>
                    </div>

                    <div className="space-y-4">
                        {mockData.errors.slice(0, 3).map((error, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-sm font-medium text-text">{error.name}</span>
                                    <span className="text-xs text-text-sub">{error.count} 次</span>
                                </div>
                                <ProgressBar value={error.percentage} color="danger" size="sm" />
                            </div>
                        ))}
                    </div>
                </Card>

                {/* 组合热力图 */}
                <Card variant="bordered" padding="lg">
                    <h3 className="text-base font-bold text-text mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                        组合热力图
                    </h3>

                    <div className="grid grid-cols-3 gap-2">
                        {mockData.heatmapData.map((stock, i) => (
                            <div
                                key={i}
                                className={`p-3 rounded-lg text-center ${stock.value >= 2 ? 'bg-up/20' :
                                        stock.value >= 0 ? 'bg-up/10' :
                                            stock.value >= -1 ? 'bg-down/10' : 'bg-down/20'
                                    }`}
                            >
                                <p className="text-xs font-bold text-text">{stock.name}</p>
                                <p className={`text-sm font-bold mt-0.5 ${stock.value >= 0 ? 'text-up' : 'text-down'}`}>
                                    {stock.value >= 0 ? '+' : ''}{stock.value}%
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>
            </main>
        </PageContainer>
    )
}

import { Header, PageContainer } from '@/components/layout'
import { Card, Tag } from '@/components/ui'
import Link from 'next/link'

// 模拟数据
const mockStats = {
    totalProfitLoss: 2450,
    profitLossPercent: 12.5,
    winRate: 68,
    totalTrades: 34,
}

const mockTrades = [
    {
        id: '1',
        stockCode: 'AAPL',
        stockName: '苹果公司',
        profitLossPercent: 12.4,
        profitLoss: 420.5,
        direction: 'long' as const,
        tradeType: '超短线',
        time: '14:30',
        date: '今天',
        hasReview: true,
    },
    {
        id: '2',
        stockCode: 'TSLA',
        stockName: '特斯拉',
        profitLossPercent: -4.2,
        profitLoss: -125.0,
        direction: 'short' as const,
        tradeType: '日内交易',
        time: '09:45',
        date: '今天',
        hasReview: false,
    },
    {
        id: '3',
        stockCode: 'NVDA',
        stockName: '英伟达',
        profitLossPercent: 8.1,
        profitLoss: 310.2,
        direction: 'long' as const,
        tradeType: undefined,
        time: '11:15',
        date: '昨天',
        hasReview: true,
    },
    {
        id: '4',
        stockCode: 'AMZN',
        stockName: '亚马逊',
        profitLossPercent: 0,
        profitLoss: 0,
        direction: 'long' as const,
        tradeType: '波段',
        time: '10:00',
        date: '昨天',
        hasReview: false,
    },
]

export default function TradesPage() {
    const { totalProfitLoss, profitLossPercent, winRate, totalTrades } = mockStats

    // 按日期分组
    const groupedTrades = mockTrades.reduce((acc, trade) => {
        if (!acc[trade.date]) {
            acc[trade.date] = []
        }
        acc[trade.date].push(trade)
        return acc
    }, {} as Record<string, typeof mockTrades>)

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
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-400 p-[2px]">
                        <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-sm font-bold text-primary">
                            A
                        </div>
                    </div>
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
                            <p className="text-xs text-blue-100 mb-1">总盈亏 (8月)</p>
                            <h2 className="text-2xl font-semibold">
                                {totalProfitLoss >= 0 ? '+' : ''}¥{Math.abs(totalProfitLoss).toLocaleString()}
                            </h2>
                            <div className={`flex items-center mt-2 text-xs ${profitLossPercent >= 0 ? 'text-red-300' : 'text-green-300'}`}>
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={profitLossPercent >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"} />
                                </svg>
                                <span>{profitLossPercent >= 0 ? '+' : ''}{profitLossPercent}%</span>
                            </div>
                        </div>
                    </Card>

                    <Card variant="bordered" padding="md">
                        <p className="text-xs text-text-sub mb-1">胜率</p>
                        <h2 className="text-2xl font-semibold text-text">{winRate}%</h2>
                        <div className="w-full bg-border h-1.5 rounded-full mt-3 overflow-hidden">
                            <div className="bg-up h-1.5 rounded-full" style={{ width: `${winRate}%` }} />
                        </div>
                        <p className="text-[10px] text-text-sub mt-1 text-right">{totalTrades} 笔交易</p>
                    </Card>
                </section>

                {/* 时间轴选择器 */}
                <section className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-text">时间轴</h3>
                        <button className="text-primary text-sm font-medium flex items-center">
                            2024年8月
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                        {[
                            { day: '周三', date: 23, active: true },
                            { day: '周四', date: 22 },
                            { day: '周五', date: 21, hasTrade: true },
                            { day: '周六', date: 20 },
                            { day: '周日', date: 19 },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className={`flex flex-col items-center justify-center min-w-[3.5rem] h-16 rounded-xl flex-shrink-0 cursor-pointer transition-colors ${item.active
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-card border border-border text-text-sub hover:border-primary/50'
                                    }`}
                            >
                                <span className={`text-xs font-medium ${item.active ? 'opacity-80' : ''}`}>{item.day}</span>
                                <span className={`text-lg font-bold ${item.active ? '' : 'text-text'}`}>{item.date}</span>
                                {(item.active || item.hasTrade) && (
                                    <div className={`w-1 h-1 rounded-full mt-1 ${item.active ? 'bg-white' : 'bg-text-muted'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* 交易列表 */}
                <section className="space-y-4">
                    {Object.entries(groupedTrades).map(([date, trades]) => (
                        <div key={date}>
                            {/* 日期分隔线 */}
                            <div className="flex items-center gap-2 my-2">
                                <div className="h-px bg-border flex-1" />
                                <span className="text-xs font-semibold text-text-sub uppercase tracking-wider">{date}</span>
                                <div className="h-px bg-border flex-1" />
                            </div>

                            {/* 交易卡片 */}
                            {trades.map((trade) => (
                                <Link key={trade.id} href={`/trades/${trade.id}`}>
                                    <Card variant="default" padding="md" hover className="mb-3 border border-transparent hover:border-primary/20">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-bg flex items-center justify-center">
                                                    <span className="font-bold text-xs text-text-sub">{trade.stockCode.slice(0, 4)}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-text leading-tight">{trade.stockCode}</h4>
                                                    <p className="text-xs text-text-sub">{trade.stockName}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`block font-bold ${trade.profitLossPercent > 0 ? 'text-up' : trade.profitLossPercent < 0 ? 'text-down' : 'text-text-muted'
                                                    }`}>
                                                    {trade.profitLossPercent > 0 ? '+' : ''}{trade.profitLossPercent}%
                                                </span>
                                                <span className="block text-xs text-text-sub">
                                                    {trade.profitLoss > 0 ? '+' : ''}{trade.profitLoss === 0 ? '¥0.00' : `¥${trade.profitLoss.toFixed(2)}`}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="border-t border-border pt-3 flex justify-between items-center">
                                            <div className="flex gap-2">
                                                <Tag variant={trade.direction === 'long' ? 'danger' : 'success'} size="sm">
                                                    {trade.direction === 'long' ? '做多' : '做空'}
                                                </Tag>
                                                {trade.tradeType && (
                                                    <Tag variant="default" size="sm">{trade.tradeType}</Tag>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-text-sub flex items-center">
                                                {trade.time}
                                                <svg className={`w-4 h-4 ml-1 ${trade.hasReview ? 'text-primary' : 'text-text-muted'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </span>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ))}
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

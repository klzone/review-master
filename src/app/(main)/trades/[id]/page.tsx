import { Header, PageContainer } from '@/components/layout'
import { Card, Tag, Button } from '@/components/ui'
import Link from 'next/link'

// 模拟交易详情数据
const mockTrade = {
    id: '1',
    stockCode: '002594',
    stockName: '比亚迪',
    market: 'A股 · 深交所',
    direction: 'long' as const,
    date: '2023年10月24日',
    time: '14:32',
    entryPrice: 238.5,
    exitPrice: 241.2,
    quantity: 100,
    profitLoss: 270.0,
    profitLossPercent: 1.13,
    review: {
        emotionLabel: '信心十足',
        emotionScore: 85,
        tags: ['突破战法', '早盘交易', '知行合一'],
        notes: '预期240元整数关口存在阻力，但早盘成交量配合放大。在回踩VWAP均线时果断买入。盘中冲高后，在分时高点附近分批止盈，没有贪婪，严格执行了交易计划。',
    },
    attachments: [
        { id: '1', url: '/placeholder-chart-1.png' },
        { id: '2', url: '/placeholder-chart-2.png' },
    ],
}

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function TradeDetailPage({ params }: PageProps) {
    const { id } = await params
    const trade = mockTrade // 实际应根据 id 从数据库获取

    return (
        <PageContainer withBottomNav={false}>
            {/* 导航栏 */}
            <nav className="sticky top-0 z-50 bg-bg/90 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-border/50">
                <Link href="/trades" className="p-2 rounded-full hover:bg-card transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="text-lg font-semibold text-primary">交易详情</h1>
                <button className="p-2 rounded-full hover:bg-card transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                </button>
            </nav>

            <main className="px-4 pt-4 pb-24">
                {/* 股票基本信息 */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-2xl font-bold text-text">{trade.stockName}</h2>
                            <span className="text-sm font-medium text-text-muted">{trade.stockCode}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tag variant={trade.direction === 'long' ? 'danger' : 'success'} size="sm">
                                {trade.direction === 'long' ? '做多' : '做空'}
                            </Tag>
                            <p className="text-sm text-text-sub">{trade.market}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-text">{trade.date}</p>
                        <p className="text-xs text-text-muted">{trade.time}</p>
                    </div>
                </div>

                {/* K线图占位 */}
                <Card variant="bordered" padding="md" className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-semibold text-text-muted tracking-wider">15分钟 K线</span>
                        <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                    </div>
                    <div className="relative w-full h-56 bg-bg rounded-lg border border-border flex items-center justify-center">
                        <div className="text-center text-text-muted">
                            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                            <p className="text-xs">K线图将在后续版本中添加</p>
                        </div>
                        {/* 买卖点标记示意 */}
                        <div className="absolute bottom-1/3 left-1/4 flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full bg-up text-white flex items-center justify-center text-[10px] font-bold shadow-lg">买</div>
                        </div>
                        <div className="absolute top-1/4 right-1/3 flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full bg-down text-white flex items-center justify-center text-[10px] font-bold shadow-lg">卖</div>
                        </div>
                    </div>
                </Card>

                {/* 盈亏统计 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <Card variant="bordered" padding="md">
                        <span className="text-xs text-text-muted mb-1 block">总盈亏</span>
                        <span className={`text-2xl font-bold flex items-center ${trade.profitLoss >= 0 ? 'text-up' : 'text-down'}`}>
                            {trade.profitLoss >= 0 ? '+' : ''}{trade.profitLoss.toFixed(2)}
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={trade.profitLoss >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"} />
                            </svg>
                        </span>
                        <div className="mt-2">
                            <Tag variant={trade.profitLoss >= 0 ? 'danger' : 'success'} size="sm">
                                {trade.profitLoss >= 0 ? '+' : ''}{trade.profitLossPercent}%
                            </Tag>
                        </div>
                    </Card>

                    <Card variant="bordered" padding="md" className="space-y-2">
                        <div className="flex justify-between items-center border-b border-border pb-2">
                            <span className="text-xs text-text-muted">持仓数量</span>
                            <span className="text-sm font-semibold text-text">{trade.quantity} 股</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-text-muted">买入均价</span>
                            <span className="text-sm font-medium text-text">{trade.entryPrice}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-text-muted">卖出均价</span>
                            <span className="text-sm font-medium text-text">{trade.exitPrice}</span>
                        </div>
                    </Card>
                </div>

                {/* 复盘分析 */}
                <Card variant="bordered" padding="lg" className="mb-6">
                    <h3 className="text-base font-bold text-text mb-5 flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        复盘分析
                    </h3>

                    {/* 情绪状态 */}
                    <div className="mb-6">
                        <div className="flex justify-between mb-3">
                            <span className="text-xs font-medium text-text-muted">交易情绪</span>
                            <span className="text-xs font-bold text-primary">{trade.review.emotionLabel}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xl">😓</span>
                            <div className="flex-1 h-1.5 bg-border rounded-lg overflow-hidden">
                                <div className="h-full bg-accent rounded-lg" style={{ width: `${trade.review.emotionScore}%` }} />
                            </div>
                            <span className="text-xl">😎</span>
                        </div>
                    </div>

                    {/* 策略标签 */}
                    <div className="mb-6">
                        <p className="text-xs font-medium text-text-muted mb-3">策略标签</p>
                        <div className="flex flex-wrap gap-2">
                            {trade.review.tags.map((tag, i) => (
                                <Tag key={i} variant={i === 0 ? 'primary' : i === 1 ? 'default' : 'warning'} size="md">
                                    {tag}
                                </Tag>
                            ))}
                        </div>
                    </div>

                    {/* 交易笔记 */}
                    <div>
                        <p className="text-xs font-medium text-text-muted mb-2">交易笔记</p>
                        <div className="bg-bg p-4 rounded-lg text-sm text-text leading-relaxed border border-border">
                            {trade.review.notes}
                        </div>
                    </div>
                </Card>

                {/* 附件 */}
                <Card variant="bordered" padding="lg" className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-bold text-text flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            附件
                        </h3>
                        <button className="text-xs text-primary font-medium hover:underline">查看全部</button>
                    </div>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                        {trade.attachments.map((attachment) => (
                            <div key={attachment.id} className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden relative group bg-bg border border-border">
                                <div className="w-full h-full flex items-center justify-center text-text-muted">
                                    <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                        <button className="flex-shrink-0 w-24 h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-colors bg-bg/50">
                            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-[10px] font-medium">添加</span>
                        </button>
                    </div>
                </Card>
            </main>

            {/* 编辑浮动按钮 */}
            <Link
                href={`/review/${trade.id}`}
                className="fixed bottom-8 right-6 z-40 bg-primary hover:bg-primary-hover text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl transition-transform hover:scale-105 active:scale-95"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            </Link>
        </PageContainer>
    )
}

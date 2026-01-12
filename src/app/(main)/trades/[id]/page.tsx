'use client'

import { Header, PageContainer } from '@/components/layout'
import { Card, Tag, Button } from '@/components/ui'
import Link from 'next/link'
import { useTrade, useDeleteTrade } from '@/lib/hooks'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface PageProps {
    params: Promise<{ id: string }>
}

export default function TradeDetailPage({ params }: PageProps) {
    const { id } = use(params)
    const router = useRouter()
    const { trade, loading, error } = useTrade(id)
    const { deleteTrade, loading: deleteLoading } = useDeleteTrade()

    const handleDelete = async () => {
        if (confirm('确定要删除这条交易记录吗？此操作无法撤销。')) {
            const success = await deleteTrade(id)
            if (success) {
                router.replace('/trades')
            }
        }
    }

    if (loading) {
        return (
            <PageContainer>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            </PageContainer>
        )
    }

    if (error || !trade) {
        return (
            <PageContainer>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-text mb-2">无法加载交易详情</h2>
                    <p className="text-text-sub mb-6">{error || '找不到该交易记录'}</p>
                    <Link href="/trades" className="text-primary hover:underline">返回交易列表</Link>
                </div>
            </PageContainer>
        )
    }

    const tradeDate = new Date(trade.entry_time)
    const formattedDate = format(tradeDate, 'yyyy年MM月dd日', { locale: zhCN })
    const formattedTime = format(tradeDate, 'HH:mm')
    const profitLoss = trade.profit_loss || 0
    const profitLossPercent = trade.profit_loss_percent || 0

    return (
        <PageContainer withBottomNav={false}>
            {/* 导航栏 */}
            <nav className="sticky top-0 z-50 bg-bg/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-border">
                <Link href="/trades" className="p-2 -ml-2 rounded-full hover:bg-card transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <div className="flex gap-2">
                    <button
                        onClick={handleDelete}
                        disabled={deleteLoading}
                        className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors disabled:opacity-50"
                    >
                        {deleteLoading ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        )}
                    </button>
                    <Link href={`/trades/${id}/edit`} className="p-2 rounded-full hover:bg-card transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </Link>
                </div>
            </nav>

            <main className="px-4 pt-4 pb-24">
                {/* 股票基本信息 */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-2xl font-bold text-text">{trade.stock_name}</h2>
                            <span className="text-sm font-medium text-text-muted">{trade.stock_code}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tag variant={trade.direction === 'long' ? 'danger' : 'success'} size="sm">
                                {trade.direction === 'long' ? '做多' : '做空'}
                            </Tag>
                            <p className="text-sm text-text-sub">{trade.market}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-text">{formattedDate}</p>
                        <p className="text-xs text-text-muted">{formattedTime}</p>
                    </div>
                </div>

                {/* K线图占位 */}
                <Card variant="bordered" padding="md" className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-semibold text-text-muted tracking-wider">K线图</span>
                        <span className="text-xs text-text-muted">开发中</span>
                    </div>
                    <div className="relative w-full h-40 bg-bg rounded-lg border border-border flex items-center justify-center">
                        <div className="text-center text-text-muted">
                            <svg className="w-10 h-10 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                            <p className="text-xs opacity-70">图表功能即将上线</p>
                        </div>
                    </div>
                </Card>

                {/* 盈亏统计 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <Card variant="bordered" padding="md">
                        <span className="text-xs text-text-muted mb-1 block">总盈亏</span>
                        <span className={`text-2xl font-bold flex items-center ${profitLoss >= 0 ? 'text-up' : 'text-down'}`}>
                            {profitLoss >= 0 ? '+' : ''}{profitLoss.toFixed(2)}
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={profitLoss >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"} />
                            </svg>
                        </span>
                        <div className="mt-2">
                            <Tag variant={profitLoss >= 0 ? 'danger' : 'success'} size="sm">
                                {profitLoss >= 0 ? '+' : ''}{profitLossPercent}%
                            </Tag>
                        </div>
                    </Card>

                    <Card variant="bordered" padding="md" className="space-y-2">
                        <div className="flex justify-between items-center border-b border-border pb-2">
                            <span className="text-xs text-text-muted">持仓数量</span>
                            <span className="text-sm font-semibold text-text">{trade.entry_quantity} 股</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-text-muted">买入均价</span>
                            <span className="text-sm font-medium text-text">{trade.entry_price}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-text-muted">卖出均价</span>
                            <span className="text-sm font-medium text-text">{trade.exit_price || '-'}</span>
                        </div>
                    </Card>
                </div>

                {/* 复盘分析 - 暂时仅显示占位，因为新建交易没有复盘数据 */}
                <Card variant="bordered" padding="lg" className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-bold text-text flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            复盘分析
                        </h3>
                        <Link href={`/review/${trade.id}`} className="text-xs text-primary font-medium hover:underline">
                            {trade.review_status === 'pending' ? '开始复盘' : '查看详情'}
                        </Link>
                    </div>
                    {trade.review_status === 'pending' ? (
                        <div className="text-center py-6 text-text-sub text-sm">
                            <p>尚未进行复盘</p>
                        </div>
                    ) : (
                        <div className="text-center py-6 text-text-sub text-sm">
                            <p>已在进行中...</p>
                        </div>
                    )}
                </Card>
            </main>
        </PageContainer>
    )
}

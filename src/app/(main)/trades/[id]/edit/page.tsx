'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { PageContainer } from '@/components/layout'
import { Card, Button, Input, Tag } from '@/components/ui'
import { useUser, useTrade } from '@/lib/hooks'

// 预设选项
const MARKETS = [
    { value: 'A', label: 'A股' },
    { value: 'HK', label: '港股' },
    { value: 'US', label: '美股' },
]

const DIRECTIONS = [
    { value: 'long', label: '做多', color: 'danger' as const },
    { value: 'short', label: '做空', color: 'success' as const },
]

const TRADE_TYPES = ['超短线', '日内交易', '波段', '中长线']

interface PageProps {
    params: Promise<{ id: string }>
}

export default function EditTradePage({ params }: PageProps) {
    const { id } = use(params)
    const router = useRouter()
    const { user, loading: userLoading } = useUser()
    const { trade, loading: tradeLoading, error: tradeError } = useTrade(id)

    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        stockCode: '',
        stockName: '',
        market: 'A',
        direction: 'long',
        tradeType: '',
        entryPrice: '',
        entryQuantity: '',
        entryTime: '',
        exitPrice: '',
        exitQuantity: '',
        exitTime: '',
    })

    // 初始化表单数据
    useEffect(() => {
        if (trade) {
            setFormData({
                stockCode: trade.stock_code,
                stockName: trade.stock_name,
                market: trade.market,
                direction: trade.direction,
                tradeType: trade.trade_type || '',
                entryPrice: trade.entry_price.toString(),
                entryQuantity: trade.entry_quantity.toString(),
                entryTime: trade.entry_time.slice(0, 16), // datetime-local format
                exitPrice: trade.exit_price ? trade.exit_price.toString() : '',
                exitQuantity: trade.exit_quantity ? trade.exit_quantity.toString() : '',
                exitTime: trade.exit_time ? trade.exit_time.slice(0, 16) : '',
            })
        }
    }, [trade])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('[EditTrade] Starting submission...')

        if (!user) {
            setError('未登录或登录已过期，请重新登录')
            return
        }

        setSubmitting(true)
        setError(null)

        try {
            const supabase = createClient()

            // 计算盈亏
            let profitLoss = null
            let profitLossPercent = null
            let status = 'open'

            if (formData.exitPrice && formData.exitQuantity) {
                const entryValue = parseFloat(formData.entryPrice) * parseInt(formData.entryQuantity)
                const exitValue = parseFloat(formData.exitPrice) * parseInt(formData.exitQuantity)

                if (formData.direction === 'long') {
                    profitLoss = exitValue - entryValue
                } else {
                    profitLoss = entryValue - exitValue
                }

                profitLossPercent = (profitLoss / entryValue) * 100
                status = 'closed'
            } else if (trade?.status === 'closed' && (!formData.exitPrice || !formData.exitQuantity)) {
                // 如果之前是已平仓，现在清除了卖出信息，则改回 open
                status = 'open'
            } else {
                // 保持原有状态或默认为 open
                status = trade?.status || 'open'
            }

            const updateData = {
                stock_code: formData.stockCode.toUpperCase(),
                stock_name: formData.stockName,
                market: formData.market,
                direction: formData.direction,
                trade_type: formData.tradeType || null,
                entry_price: parseFloat(formData.entryPrice),
                entry_quantity: parseInt(formData.entryQuantity),
                entry_time: formData.entryTime,
                exit_price: formData.exitPrice ? parseFloat(formData.exitPrice) : null,
                exit_quantity: formData.exitQuantity ? parseInt(formData.exitQuantity) : null,
                exit_time: formData.exitTime || null,
                profit_loss: profitLoss,
                profit_loss_percent: profitLossPercent,
                status,
                updated_at: new Date().toISOString(),
            }

            console.log('[EditTrade] Updating record:', updateData)

            const { error: updateError } = await (supabase
                .from('trades') as any)
                .update(updateData)
                .eq('id', id)
                .select()

            if (updateError) {
                console.error('[EditTrade] Update error:', updateError)
                setError(updateError.message)
            } else {
                console.log('[EditTrade] Update successful')
                router.push(`/trades/${id}`)
                router.refresh()
            }
        } catch (err) {
            console.error('[EditTrade] Unexpected error:', err)
            setError('保存失败，请稍后重试')
        } finally {
            setSubmitting(false)
        }
    }

    if (tradeLoading || userLoading) {
        return (
            <PageContainer>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            </PageContainer>
        )
    }

    if (tradeError || (!trade && !tradeLoading)) {
        return (
            <PageContainer>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <p className="text-text-sub mb-4">无法加载交易信息</p>
                    <Link href="/trades" className="text-primary hover:underline">返回列表</Link>
                </div>
            </PageContainer>
        )
    }

    return (
        <PageContainer withBottomNav={false}>
            {/* 导航栏 */}
            <nav className="sticky top-0 z-50 bg-bg/95 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-border">
                <Link href={`/trades/${id}`} className="p-2 rounded-full hover:bg-card transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </Link>
                <h1 className="text-lg font-semibold text-text">编辑交易</h1>
                <div className="w-10" />
            </nav>

            <form onSubmit={handleSubmit} className="px-4 py-6 pb-32 space-y-6">
                {/* 股票信息 */}
                <Card variant="bordered" padding="lg">
                    <h3 className="text-sm font-bold text-text mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        股票信息
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="股票代码"
                            placeholder="如 600519"
                            value={formData.stockCode}
                            onChange={(e) => setFormData({ ...formData, stockCode: e.target.value })}
                            required
                        />
                        <Input
                            label="股票名称"
                            placeholder="如 贵州茅台"
                            value={formData.stockName}
                            onChange={(e) => setFormData({ ...formData, stockName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-xs font-medium text-text-sub mb-2">交易市场</label>
                        <div className="flex gap-2">
                            {MARKETS.map((market) => (
                                <button
                                    key={market.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, market: market.value })}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${formData.market === market.value
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'bg-bg border border-border text-text-sub hover:text-text'
                                        }`}
                                >
                                    {market.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* 交易方向 */}
                <Card variant="bordered" padding="lg">
                    <h3 className="text-sm font-bold text-text mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        交易方向
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        {DIRECTIONS.map((dir) => (
                            <button
                                key={dir.value}
                                type="button"
                                onClick={() => setFormData({ ...formData, direction: dir.value })}
                                className={`py-4 rounded-xl text-base font-bold transition-all ${formData.direction === dir.value
                                    ? dir.value === 'long'
                                        ? 'bg-up text-white shadow-lg shadow-up/30'
                                        : 'bg-down text-white shadow-lg shadow-down/30'
                                    : 'bg-bg border border-border text-text-sub hover:text-text'
                                    }`}
                            >
                                {dir.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-4">
                        <label className="block text-xs font-medium text-text-sub mb-2">交易类型</label>
                        <div className="flex flex-wrap gap-2">
                            {TRADE_TYPES.map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, tradeType: formData.tradeType === type ? '' : type })}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${formData.tradeType === type
                                        ? 'bg-accent text-black shadow-glow'
                                        : 'bg-bg border border-border text-text-sub hover:text-text'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* 买入信息 */}
                <Card variant="bordered" padding="lg">
                    <h3 className="text-sm font-bold text-text mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-up" />
                        买入信息
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="买入价格"
                            type="number"
                            step="0.001"
                            placeholder="0.00"
                            value={formData.entryPrice}
                            onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
                            required
                        />
                        <Input
                            label="买入数量"
                            type="number"
                            placeholder="100"
                            value={formData.entryQuantity}
                            onChange={(e) => setFormData({ ...formData, entryQuantity: e.target.value })}
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <Input
                            label="买入时间"
                            type="datetime-local"
                            value={formData.entryTime}
                            onChange={(e) => setFormData({ ...formData, entryTime: e.target.value })}
                            required
                        />
                    </div>
                </Card>

                {/* 卖出信息（可选） */}
                <Card variant="bordered" padding="lg">
                    <h3 className="text-sm font-bold text-text mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-down" />
                        卖出信息
                        <Tag variant="default" size="sm">可选</Tag>
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="卖出价格"
                            type="number"
                            step="0.001"
                            placeholder="留空表示持仓中"
                            value={formData.exitPrice}
                            onChange={(e) => setFormData({ ...formData, exitPrice: e.target.value })}
                        />
                        <Input
                            label="卖出数量"
                            type="number"
                            placeholder="留空表示持仓中"
                            value={formData.exitQuantity}
                            onChange={(e) => setFormData({ ...formData, exitQuantity: e.target.value })}
                        />
                    </div>

                    <div className="mt-4">
                        <Input
                            label="卖出时间"
                            type="datetime-local"
                            value={formData.exitTime}
                            onChange={(e) => setFormData({ ...formData, exitTime: e.target.value })}
                        />
                    </div>
                </Card>

                {/* 错误提示 */}
                {error && (
                    <div className="p-3 bg-up/10 border border-up/20 rounded-lg">
                        <p className="text-xs text-up font-medium">{error}</p>
                    </div>
                )}
            </form>

            {/* 底部按钮 */}
            <div className="fixed bottom-0 left-0 right-0 p-5 bg-card border-t border-border z-40 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] safe-area-bottom">
                <div className="max-w-md mx-auto flex gap-4">
                    <Link href={`/trades/${id}`} className="flex-1">
                        <Button variant="outline" fullWidth>
                            取消
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        loading={submitting}
                        onClick={handleSubmit}
                        className="flex-[2]"
                    >
                        保存修改
                    </Button>
                </div>
            </div>
        </PageContainer>
    )
}

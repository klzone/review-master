'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { PageContainer } from '@/components/layout'
import { Card, Button, Input, Tag } from '@/components/ui'

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

export default function NewTradePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        stockCode: '',
        stockName: '',
        market: 'A',
        direction: 'long',
        tradeType: '',
        entryPrice: '',
        entryQuantity: '',
        entryTime: new Date().toISOString().slice(0, 16),
        exitPrice: '',
        exitQuantity: '',
        exitTime: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const supabase = createClient()

            // 获取当前用户
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

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
            }

            // 插入交易记录
            const { error: insertError } = await supabase.from('trades').insert({
                user_id: user.id,
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
                review_status: 'pending',
            } as any)

            if (insertError) {
                setError(insertError.message)
            } else {
                router.push('/trades')
                router.refresh()
            }
        } catch (err) {
            setError('保存失败，请稍后重试')
        } finally {
            setLoading(false)
        }
    }

    return (
        <PageContainer withBottomNav={false}>
            {/* 导航栏 */}
            <nav className="sticky top-0 z-50 bg-bg/95 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-border">
                <Link href="/trades" className="p-2 rounded-full hover:bg-card transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </Link>
                <h1 className="text-lg font-semibold text-text">添加交易</h1>
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
                    <Link href="/trades" className="flex-1">
                        <Button variant="outline" fullWidth>
                            取消
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        loading={loading}
                        onClick={handleSubmit}
                        className="flex-[2]"
                    >
                        保存交易
                    </Button>
                </div>
            </div>
        </PageContainer>
    )
}

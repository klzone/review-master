'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Trade } from '@/types/database'

interface DashboardStats {
    totalAsset: number
    availableCash: number
    marketValue: number
    assetChange: number
    returnRate: number
    winRate: number
    profitLossRatio: number
    maxDrawdown: number
    reviewProgress: {
        completed: number
        total: number
    }
}

export function useStats() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchStats() {
            setLoading(true)
            setError(null)

            try {
                const supabase = createClient()

                // 获取用户配置
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    setError('请先登录')
                    setLoading(false)
                    return
                }

                // 获取用户初始资金
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('initial_capital')
                    .eq('id', user.id)
                    .single() as any

                const initialCapital = (profile?.initial_capital as number) || 100000

                // 获取所有交易（包括持仓中）
                const { data: allTrades } = await supabase
                    .from('trades')
                    .select('*')
                    .order('entry_time', { ascending: true }) as any

                const trades = allTrades || []

                // 区分已平仓和持仓中
                const closedTrades = trades.filter((t: any) => t.status === 'closed' || t.status === 'partial')
                const openTrades = trades.filter((t: any) => t.status === 'open' || t.status === 'partial')

                // 1. 计算已实现盈亏 (Realized P&L)
                const totalRealizedProfitLoss = closedTrades.reduce((sum: number, t: any) => sum + (t.profit_loss || 0), 0)

                // 2. 计算持仓市值 (Market Value - Cost Basis)
                // 注意：由于没有实时行情，这里暂时用"持仓成本"代替市值
                // 如果是部分平仓，需要减去已平仓部分的成本
                let totalMarketValue = 0
                for (const t of openTrades) {
                    const entryPrice = t.entry_price || 0
                    const entryQty = t.entry_quantity || 0
                    const exitQty = t.exit_quantity || 0 // 或者是已平仓数量

                    // 简单处理：如果是 open，持仓量 = entry_quantity
                    // 如果是 partial，持仓量 = entry_quantity - exit_quantity (假设 exit_quantity 是累计卖出量)
                    // 但根据数据库设计，status='partial' 时 exit_quantity 可能只表示最近一次卖出的量？
                    // 这里的逻辑需要根据实际业务调整。目前假设 trades 表是一次完整的开平仓记录。
                    // 如果是分批买卖，通常会有多条记录或子表。
                    // 既然 NewTradePage 只有单次买卖，我们假设 partial 意味着 exit_quantity < entry_quantity

                    let currentQty = entryQty
                    if (t.status === 'partial' || (t.exit_quantity && t.exit_quantity < t.entry_quantity)) {
                        currentQty = t.entry_quantity - (t.exit_quantity || 0)
                    }

                    totalMarketValue += currentQty * entryPrice
                }

                // 3. 计算总资产 (Total Asset)
                // 总资产 = 初始本金 + 已实现盈亏 + (浮动盈亏 - 暂时忽略，假设为0)
                // 也就是：目前总资产 = 初始本金 + 已实现盈亏
                const totalAsset = initialCapital + totalRealizedProfitLoss

                // 4. 计算可用资金 (Available Cash)
                // 可用资金 = 总资产 - 持仓占用资金 (持仓市值)
                const availableCash = totalAsset - totalMarketValue

                const assetChange = (totalRealizedProfitLoss / initialCapital) * 100

                // 胜率 (只看已平仓)
                const wins = closedTrades.filter((t: any) => (t.profit_loss || 0) > 0)
                const losses = closedTrades.filter((t: any) => (t.profit_loss || 0) < 0)
                const winRate = closedTrades.length > 0 ? (wins.length / closedTrades.length) * 100 : 0

                // 盈亏比
                const avgWin = wins.length > 0
                    ? wins.reduce((sum: number, t: any) => sum + (t.profit_loss || 0), 0) / wins.length
                    : 0
                const avgLoss = losses.length > 0
                    ? Math.abs(losses.reduce((sum: number, t: any) => sum + (t.profit_loss || 0), 0)) / losses.length
                    : 1
                const profitLossRatio = avgLoss > 0 ? avgWin / avgLoss : avgWin

                // 最大回撤
                let peak = initialCapital
                let maxDrawdown = 0
                let currentValue = initialCapital

                for (const trade of closedTrades) {
                    currentValue += (trade as any).profit_loss || 0
                    if (currentValue > peak) {
                        peak = currentValue
                    }
                    const drawdown = ((peak - currentValue) / peak) * 100
                    if (drawdown > maxDrawdown) {
                        maxDrawdown = drawdown
                    }
                }

                // 复盘进度
                const total = trades.length || 0
                const completed = trades.filter((t: any) => t.review_status === 'completed').length || 0

                setStats({
                    totalAsset,
                    availableCash: Math.max(0, availableCash), // 防止负数显示不好看
                    marketValue: totalMarketValue,
                    assetChange,
                    returnRate: assetChange,
                    winRate,
                    profitLossRatio,
                    maxDrawdown: -maxDrawdown,
                    reviewProgress: { completed, total },
                })
            } catch (err) {
                console.error('Stats fetch error:', err)
                setError('获取统计数据失败')
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    return { stats, loading, error }
}

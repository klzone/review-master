'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Trade } from '@/types/database'

interface DashboardStats {
    totalAsset: number
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

                // 获取所有已平仓交易
                const { data: trades } = await supabase
                    .from('trades')
                    .select('*')
                    .eq('status', 'closed')
                    .order('entry_time', { ascending: true }) as any

                if (!trades || trades.length === 0) {
                    // 没有交易记录时返回默认值
                    setStats({
                        totalAsset: initialCapital,
                        assetChange: 0,
                        returnRate: 0,
                        winRate: 0,
                        profitLossRatio: 0,
                        maxDrawdown: 0,
                        reviewProgress: { completed: 0, total: 0 },
                    })
                    setLoading(false)
                    return
                }

                // 计算统计数据
                const totalProfitLoss = (trades as any[]).reduce((sum: number, t: any) => sum + (t.profit_loss || 0), 0)
                const totalAsset = initialCapital + totalProfitLoss
                const assetChange = (totalProfitLoss / initialCapital) * 100

                // 胜率
                const wins = (trades as any[]).filter((t: any) => (t.profit_loss || 0) > 0)
                const losses = (trades as any[]).filter((t: any) => (t.profit_loss || 0) < 0)
                const winRate = trades.length > 0 ? (wins.length / trades.length) * 100 : 0

                // 盈亏比
                const avgWin = wins.length > 0
                    ? wins.reduce((sum: number, t: any) => sum + (t.profit_loss || 0), 0) / wins.length
                    : 0
                const avgLoss = losses.length > 0
                    ? Math.abs(losses.reduce((sum: number, t: any) => sum + (t.profit_loss || 0), 0)) / losses.length
                    : 1
                const profitLossRatio = avgLoss > 0 ? avgWin / avgLoss : avgWin

                // 最大回撤（简化计算）
                let peak = initialCapital
                let maxDrawdown = 0
                let currentValue = initialCapital

                for (const trade of (trades as any[])) {
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
                const { data: allTrades } = await supabase
                    .from('trades')
                    .select('review_status') as any

                const total = allTrades?.length || 0
                const completed = (allTrades || []).filter((t: any) => t.review_status === 'completed').length || 0

                setStats({
                    totalAsset,
                    assetChange,
                    returnRate: assetChange,
                    winRate,
                    profitLossRatio,
                    maxDrawdown: -maxDrawdown,
                    reviewProgress: { completed, total },
                })
            } catch (err) {
                setError('获取统计数据失败')
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    return { stats, loading, error }
}

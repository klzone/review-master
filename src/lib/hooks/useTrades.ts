'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Trade, TradeInsert } from '@/types/database'

export function useTrades() {
    const [trades, setTrades] = useState<Trade[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchTrades = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('trades')
                .select('*')
                .order('entry_time', { ascending: false }) as any

            if (error) {
                setError(error.message)
            } else {
                setTrades((data || []) as Trade[])
            }
        } catch (err) {
            setError('获取交易记录失败')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchTrades()
    }, [fetchTrades])

    return { trades, loading, error, refetch: fetchTrades }
}

export function useTrade(id: string) {
    const [trade, setTrade] = useState<Trade | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchTrade() {
            setLoading(true)
            setError(null)

            try {
                const supabase = createClient()
                const { data, error } = await supabase
                    .from('trades')
                    .select('*')
                    .eq('id', id)
                    .single() as any

                if (error) {
                    setError(error.message)
                } else {
                    setTrade(data as Trade)
                }
            } catch (err) {
                setError('获取交易详情失败')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchTrade()
        }
    }, [id])

    return { trade, loading, error }
}

export function useCreateTrade() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createTrade = async (trade: TradeInsert) => {
        setLoading(true)
        setError(null)

        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('trades')
                .insert(trade as any)
                .select()
                .single() as any

            if (error) {
                setError(error.message)
                return null
            }

            return data
        } catch (err) {
            setError('创建交易记录失败')
            return null
        } finally {
            setLoading(false)
        }
    }

    return { createTrade, loading, error }
}

export function useDeleteTrade() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const deleteTrade = async (id: string) => {
        setLoading(true)
        setError(null)

        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('trades')
                .delete()
                .eq('id', id)

            if (error) {
                setError(error.message)
                return false
            }

            return true
        } catch (err) {
            setError('删除交易记录失败')
            return false
        } finally {
            setLoading(false)
        }
    }

    return { deleteTrade, loading, error }
}

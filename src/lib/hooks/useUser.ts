'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface UserProfile {
    id: string
    display_name: string | null
    avatar_url: string | null
    initial_capital: number | null
}

export function useUser() {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const timeout = (ms: number) => new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Auth Timeout')), ms)
        )

        async function getUser() {
            console.log('[useUser] Start getUser flow...')
            const supabase = createClient()
            let userFromSession: User | null = null; // Track user from getSession

            try {
                // 首先尝试获取本地会话，增加 5s 超时保护
                console.log('[useUser] Calling getSession...')
                const { data: { session } } = await Promise.race([
                    supabase.auth.getSession(),
                    timeout(5000)
                ]) as any

                if (session?.user) {
                    console.log('[useUser] Found session user:', session.user.id)
                    setUser(session.user)
                    userFromSession = session.user;
                    // 后台异步加载 Profile
                    fetchProfile(session.user.id)
                }

                // 然后尝试获取最新的用户信息（包含网络校验），增加 5s 超时保护
                console.log('[useUser] Calling getUser...')
                const { data: { user } } = await Promise.race([
                    supabase.auth.getUser(),
                    timeout(5000)
                ]) as any

                if (user) {
                    console.log('[useUser] User refreshed:', user.id)
                    setUser(user)
                    fetchProfile(user.id)
                } else {
                    console.log('[useUser] No user found in getUser')
                    // If getUser returns null, and getSession also returned null, then set user to null
                    if (!userFromSession) setUser(null)
                }
            } catch (err: any) {
                console.error('[useUser] Auth check failed or timed out:', err.message)
                // 如果超时且没有从 getSession 拿到用户信息，则认为未登录
                if (!userFromSession) setUser(null)
            } finally {
                setLoading(false)
                console.log('[useUser] Loading finished')
            }
        }

        async function fetchProfile(userId: string) {
            try {
                const supabase = createClient()
                const { data: profile, error: profileError } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('id', userId)
                    .single()

                if (profileError) {
                    console.error('[useUser] Profile fetch error:', profileError)
                } else {
                    console.log('[useUser] Profile loaded successfully')
                    setProfile(profile)
                }
            } catch (err) {
                console.error('[useUser] Profile fetch exception:', err)
            }
        }

        getUser()

        const supabase = createClient()
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('[useUser] Auth state change:', event)
                setUser(session?.user ?? null)

                if (session?.user) {
                    fetchProfile(session.user.id)
                } else {
                    setProfile(null)
                }
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const signOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
    }

    return { user, profile, loading, signOut }
}

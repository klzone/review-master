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
        async function getUser() {
            console.log('[useUser] Start getUser flow...')
            try {
                const supabase = createClient()

                // 首先尝试获取本地会话，速度更快
                console.log('[useUser] Calling getSession...')
                const { data: { session }, error: sessionError } = await supabase.auth.getSession()

                if (sessionError) {
                    console.error('[useUser] Session error:', sessionError)
                }

                if (session?.user) {
                    console.log('[useUser] Found session user:', session.user.id)
                    setUser(session.user)
                    // 后台异步加载 Profile
                    fetchProfile(session.user.id)
                }

                // 然后尝试获取最新的用户信息（包含网络校验）
                console.log('[useUser] Calling getUser...')
                const { data: { user }, error: userError } = await supabase.auth.getUser()

                if (userError) {
                    console.error('[useUser] Auth getUser error:', userError)
                    if (!session?.user) {
                        setUser(null)
                        setLoading(false)
                        return
                    }
                }

                if (user) {
                    console.log('[useUser] User refreshed:', user.id)
                    setUser(user)
                    fetchProfile(user.id)
                } else {
                    console.log('[useUser] No user found in getUser')
                    if (!session?.user) setUser(null)
                }
            } catch (err) {
                console.error('[useUser] Unexpected error in getUser:', err)
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
                setUser(session?.user ?? null)

                if (session?.user) {
                    const { data: profile } = await supabase
                        .from('user_profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single()

                    setProfile(profile)
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

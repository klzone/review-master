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
            console.log('[useUser] Fetching user...')
            try {
                const supabase = createClient()
                const { data: { user }, error: userError } = await supabase.auth.getUser()

                if (userError) {
                    console.error('[useUser] Auth error:', userError)
                    setUser(null)
                    setLoading(false)
                    return
                }

                console.log('[useUser] User found:', user?.id)
                setUser(user)

                if (user) {
                    const { data: profile, error: profileError } = await supabase
                        .from('user_profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single()

                    if (profileError) {
                        console.error('[useUser] Profile fetch error:', profileError)
                    }
                    console.log('[useUser] Profile loaded:', !!profile)
                    setProfile(profile)
                }
            } catch (err) {
                console.error('[useUser] Unexpected error in getUser:', err)
            } finally {
                setLoading(false)
                console.log('[useUser] Loading finished')
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

/**
 * 复盘大师 - 数据库类型定义
 * 
 * 此文件定义了 Supabase 数据库表的 TypeScript 类型
 * 可以使用 supabase gen types typescript 命令自动生成
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            user_profiles: {
                Row: {
                    id: string
                    display_name: string | null
                    avatar_url: string | null
                    initial_capital: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    display_name?: string | null
                    avatar_url?: string | null
                    initial_capital?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    display_name?: string | null
                    avatar_url?: string | null
                    initial_capital?: number | null
                    created_at?: string
                    updated_at?: string
                }
            }
            trades: {
                Row: {
                    id: string
                    user_id: string
                    stock_code: string
                    stock_name: string
                    market: string
                    direction: 'long' | 'short'
                    trade_type: string | null
                    entry_price: number
                    entry_quantity: number
                    entry_time: string
                    exit_price: number | null
                    exit_quantity: number | null
                    exit_time: string | null
                    profit_loss: number | null
                    profit_loss_percent: number | null
                    status: 'open' | 'closed' | 'partial'
                    review_status: 'pending' | 'in_progress' | 'completed'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    stock_code: string
                    stock_name: string
                    market?: string
                    direction: 'long' | 'short'
                    trade_type?: string | null
                    entry_price: number
                    entry_quantity: number
                    entry_time: string
                    exit_price?: number | null
                    exit_quantity?: number | null
                    exit_time?: string | null
                    profit_loss?: number | null
                    profit_loss_percent?: number | null
                    status?: 'open' | 'closed' | 'partial'
                    review_status?: 'pending' | 'in_progress' | 'completed'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    stock_code?: string
                    stock_name?: string
                    market?: string
                    direction?: 'long' | 'short'
                    trade_type?: string | null
                    entry_price?: number
                    entry_quantity?: number
                    entry_time?: string
                    exit_price?: number | null
                    exit_quantity?: number | null
                    exit_time?: string | null
                    profit_loss?: number | null
                    profit_loss_percent?: number | null
                    status?: 'open' | 'closed' | 'partial'
                    review_status?: 'pending' | 'in_progress' | 'completed'
                    created_at?: string
                    updated_at?: string
                }
            }
            trade_reviews: {
                Row: {
                    id: string
                    trade_id: string
                    user_id: string
                    entry_strategy: string | null
                    resonance_factors: string[] | null
                    entry_description: string | null
                    emotion_score: number | null
                    exit_strategy: string | null
                    exit_description: string | null
                    what_went_well: string | null
                    what_went_wrong: string | null
                    lessons_learned: string | null
                    tags: string[] | null
                    current_step: number
                    completed_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    trade_id: string
                    user_id: string
                    entry_strategy?: string | null
                    resonance_factors?: string[] | null
                    entry_description?: string | null
                    emotion_score?: number | null
                    exit_strategy?: string | null
                    exit_description?: string | null
                    what_went_well?: string | null
                    what_went_wrong?: string | null
                    lessons_learned?: string | null
                    tags?: string[] | null
                    current_step?: number
                    completed_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    trade_id?: string
                    user_id?: string
                    entry_strategy?: string | null
                    resonance_factors?: string[] | null
                    entry_description?: string | null
                    emotion_score?: number | null
                    exit_strategy?: string | null
                    exit_description?: string | null
                    what_went_well?: string | null
                    what_went_wrong?: string | null
                    lessons_learned?: string | null
                    tags?: string[] | null
                    current_step?: number
                    completed_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            trade_attachments: {
                Row: {
                    id: string
                    trade_id: string
                    user_id: string
                    file_path: string
                    file_type: string | null
                    caption: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    trade_id: string
                    user_id: string
                    file_path: string
                    file_type?: string | null
                    caption?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    trade_id?: string
                    user_id?: string
                    file_path?: string
                    file_type?: string | null
                    caption?: string | null
                    created_at?: string
                }
            }
            trading_rules: {
                Row: {
                    id: string
                    user_id: string
                    category: string
                    title: string
                    description: string | null
                    is_active: boolean
                    icon: string | null
                    color: string | null
                    sort_order: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    category: string
                    title: string
                    description?: string | null
                    is_active?: boolean
                    icon?: string | null
                    color?: string | null
                    sort_order?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    category?: string
                    title?: string
                    description?: string | null
                    is_active?: boolean
                    icon?: string | null
                    color?: string | null
                    sort_order?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            rule_violations: {
                Row: {
                    id: string
                    trade_id: string | null
                    rule_id: string
                    user_id: string
                    description: string
                    severity: 'low' | 'medium' | 'high'
                    acknowledged: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    trade_id?: string | null
                    rule_id: string
                    user_id: string
                    description: string
                    severity?: 'low' | 'medium' | 'high'
                    acknowledged?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    trade_id?: string | null
                    rule_id?: string
                    user_id?: string
                    description?: string
                    severity?: 'low' | 'medium' | 'high'
                    acknowledged?: boolean
                    created_at?: string
                }
            }
            error_types: {
                Row: {
                    id: string
                    user_id: string
                    error_name: string
                    occurrence_count: number
                    last_occurred_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    error_name: string
                    occurrence_count?: number
                    last_occurred_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    error_name?: string
                    occurrence_count?: number
                    last_occurred_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}

// 便捷类型别名
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type Trade = Database['public']['Tables']['trades']['Row']
export type TradeInsert = Database['public']['Tables']['trades']['Insert']
export type TradeReview = Database['public']['Tables']['trade_reviews']['Row']
export type TradingRule = Database['public']['Tables']['trading_rules']['Row']
export type RuleViolation = Database['public']['Tables']['rule_violations']['Row']
export type ErrorType = Database['public']['Tables']['error_types']['Row']

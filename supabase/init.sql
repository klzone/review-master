-- =============================================
-- 复盘大师 (ReviewMaster) 数据库初始化脚本
-- 适用于: Supabase PostgreSQL
-- =============================================

-- 用户配置表
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name VARCHAR(50),
    avatar_url TEXT,
    initial_capital DECIMAL(12,2) DEFAULT 100000.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 交易记录表
CREATE TABLE IF NOT EXISTS trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    stock_code VARCHAR(10) NOT NULL,
    stock_name VARCHAR(50) NOT NULL,
    market VARCHAR(10) DEFAULT 'A',
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('long', 'short')),
    trade_type VARCHAR(20),
    
    -- 买入信息
    entry_price DECIMAL(10,3) NOT NULL,
    entry_quantity INTEGER NOT NULL,
    entry_time TIMESTAMPTZ NOT NULL,
    
    -- 卖出信息 (可为空，表示持仓中)
    exit_price DECIMAL(10,3),
    exit_quantity INTEGER,
    exit_time TIMESTAMPTZ,
    
    -- 盈亏计算
    profit_loss DECIMAL(12,2),
    profit_loss_percent DECIMAL(6,3),
    
    -- 状态
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'partial')),
    review_status VARCHAR(20) DEFAULT 'pending' CHECK (review_status IN ('pending', 'in_progress', 'completed')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 复盘记录表
CREATE TABLE IF NOT EXISTS trade_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_id UUID REFERENCES trades(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- 入场策略 (Step 2)
    entry_strategy VARCHAR(50),
    resonance_factors TEXT[],
    entry_description TEXT,
    
    -- 情绪状态 (Step 3)
    emotion_score INTEGER CHECK (emotion_score BETWEEN 1 AND 5),
    
    -- 出场策略 (Step 4)
    exit_strategy VARCHAR(50),
    exit_description TEXT,
    
    -- 复盘总结 (Step 5-7)
    what_went_well TEXT,
    what_went_wrong TEXT,
    lessons_learned TEXT,
    
    -- 标签
    tags TEXT[],
    
    -- 进度
    current_step INTEGER DEFAULT 1,
    completed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 附件表
CREATE TABLE IF NOT EXISTS trade_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_id UUID REFERENCES trades(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(20),
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 交易规则表
CREATE TABLE IF NOT EXISTS trading_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category VARCHAR(30) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    icon VARCHAR(50),
    color VARCHAR(30),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 规则违规记录表
CREATE TABLE IF NOT EXISTS rule_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_id UUID REFERENCES trades(id) ON DELETE SET NULL,
    rule_id UUID REFERENCES trading_rules(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
    acknowledged BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 错误类型统计表
CREATE TABLE IF NOT EXISTS error_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    error_name VARCHAR(50) NOT NULL,
    occurrence_count INTEGER DEFAULT 0,
    last_occurred_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 索引
-- =============================================
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_entry_time ON trades(entry_time DESC);
CREATE INDEX IF NOT EXISTS idx_trades_status ON trades(status);
CREATE INDEX IF NOT EXISTS idx_trade_reviews_trade_id ON trade_reviews(trade_id);
CREATE INDEX IF NOT EXISTS idx_trade_reviews_user_id ON trade_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_trading_rules_user_id ON trading_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_rule_violations_user_id ON rule_violations(user_id);

-- =============================================
-- RLS 策略 (Row Level Security)
-- =============================================

-- 启用 RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_types ENABLE ROW LEVEL SECURITY;

-- user_profiles 策略
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- trades 策略
CREATE POLICY "Users can view own trades" ON trades
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own trades" ON trades
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own trades" ON trades
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own trades" ON trades
    FOR DELETE USING (auth.uid() = user_id);

-- trade_reviews 策略
CREATE POLICY "Users can view own reviews" ON trade_reviews
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reviews" ON trade_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON trade_reviews
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON trade_reviews
    FOR DELETE USING (auth.uid() = user_id);

-- trade_attachments 策略
CREATE POLICY "Users can view own attachments" ON trade_attachments
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attachments" ON trade_attachments
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own attachments" ON trade_attachments
    FOR DELETE USING (auth.uid() = user_id);

-- trading_rules 策略
CREATE POLICY "Users can view own rules" ON trading_rules
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own rules" ON trading_rules
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own rules" ON trading_rules
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own rules" ON trading_rules
    FOR DELETE USING (auth.uid() = user_id);

-- rule_violations 策略
CREATE POLICY "Users can view own violations" ON rule_violations
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own violations" ON rule_violations
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own violations" ON rule_violations
    FOR UPDATE USING (auth.uid() = user_id);

-- error_types 策略
CREATE POLICY "Users can view own error types" ON error_types
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own error types" ON error_types
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own error types" ON error_types
    FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- 触发器: 自动更新 updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trades_updated_at
    BEFORE UPDATE ON trades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trade_reviews_updated_at
    BEFORE UPDATE ON trade_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trading_rules_updated_at
    BEFORE UPDATE ON trading_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_error_types_updated_at
    BEFORE UPDATE ON error_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 完成提示
-- =============================================
-- 请在 Supabase Dashboard 的 SQL Editor 中运行此脚本
-- 脚本将创建所有必要的表、索引、RLS策略和触发器

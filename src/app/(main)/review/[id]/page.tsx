'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageContainer } from '@/components/layout'
import { Card, Button, ProgressBar, Tag } from '@/components/ui'
import Link from 'next/link'

// 复盘步骤配置
const REVIEW_STEPS = [
    { id: 1, title: '基础信息', description: '确认交易基本信息' },
    { id: 2, title: '入场策略', description: '选择您的入场核心逻辑' },
    { id: 3, title: '情绪状态', description: '回顾交易时的心理状态' },
    { id: 4, title: '出场策略', description: '记录您的出场决策过程' },
    { id: 5, title: '做对了什么', description: '总结成功的地方' },
    { id: 6, title: '做错了什么', description: '反思需要改进的地方' },
    { id: 7, title: '经验教训', description: '提炼可复用的经验' },
]

// 预设策略选项
const ENTRY_STRATEGIES = [
    '突破策略 (Breakout)',
    '趋势跟随 (Trend Following)',
    '均值回归 (Mean Reversion)',
    '支撑反弹 (Support Bounce)',
    '事件驱动 (Event Driven)',
]

const RESONANCE_FACTORS = [
    '量能爆发',
    'RSI底背离',
    '均线金叉',
    '板块效应',
    'MACD背离',
    '突破前高',
]

const EXIT_STRATEGIES = [
    '止盈目标达成',
    '止损触发',
    '时间止损',
    '信号反转',
    '计划外出场',
]

// 模拟交易数据
const mockTrade = {
    id: '1',
    stockCode: '600519',
    stockName: '贵州茅台',
    direction: 'long' as const,
    profitLoss: 2010.0,
    profitLossPercent: 3.5,
    entryPrice: 1750.0,
    exitPrice: 1810.0,
    entryTime: '2024-01-15 09:35',
    exitTime: '2024-01-15 14:30',
}

interface PageProps {
    params: Promise<{ id: string }>
}

export default function ReviewPage({ params }: PageProps) {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(2) // 从第2步开始（假设第1步已确认）
    const [formData, setFormData] = useState({
        entryStrategy: ENTRY_STRATEGIES[0],
        resonanceFactors: ['量能爆发'],
        entryDescription: '',
        emotionScore: 3,
        exitStrategy: '',
        exitDescription: '',
        whatWentWell: '',
        whatWentWrong: '',
        lessonsLearned: '',
        tags: [] as string[],
    })

    const handleNext = () => {
        if (currentStep < REVIEW_STEPS.length) {
            setCurrentStep(currentStep + 1)
        } else {
            // 完成复盘
            router.push(`/trades/${mockTrade.id}`)
        }
    }

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSaveDraft = () => {
        // TODO: 保存草稿到数据库
        console.log('Saving draft:', formData)
    }

    const toggleResonanceFactor = (factor: string) => {
        setFormData((prev) => ({
            ...prev,
            resonanceFactors: prev.resonanceFactors.includes(factor)
                ? prev.resonanceFactors.filter((f) => f !== factor)
                : [...prev.resonanceFactors, factor],
        }))
    }

    const emotionEmojis = ['😰', '😓', '😐', '😎', '🤑']
    const emotionLabels = ['恐惧', '担忧', '平静', '自信', '贪婪']

    return (
        <PageContainer withBottomNav={false}>
            {/* 顶部导航 */}
            <header className="sticky top-0 z-30 bg-bg/95 backdrop-blur-md px-5 pt-12 pb-4 flex items-center justify-between border-b border-border">
                <Link href={`/trades/${mockTrade.id}`} className="p-2 -ml-2 rounded-full hover:bg-card transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="text-lg font-bold text-text tracking-wide">交易复盘</h1>
                <button className="p-2 -mr-2 rounded-full hover:bg-card transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </header>

            {/* 进度条 */}
            <div className="px-6 py-4">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-semibold text-text-sub">复盘进度</span>
                    <span className="text-sm font-bold text-accent">
                        第 {currentStep} 步 / 共 {REVIEW_STEPS.length} 步
                    </span>
                </div>
                <ProgressBar
                    value={currentStep}
                    max={REVIEW_STEPS.length}
                    color="accent"
                />
            </div>

            <main className="flex-1 px-5 space-y-6 pb-32">
                {/* 已完成步骤预览 */}
                {currentStep > 1 && (
                    <Card variant="bordered" padding="md" className="opacity-60">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-down/20 flex items-center justify-center text-down">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-text text-sm">{mockTrade.stockCode} {mockTrade.stockName}</h3>
                                    <p className="text-[10px] text-text-sub">基础信息 • 已确认</p>
                                </div>
                            </div>
                            <Tag variant={mockTrade.profitLoss >= 0 ? 'danger' : 'success'} size="sm">
                                {mockTrade.profitLoss >= 0 ? '+' : ''}¥{mockTrade.profitLoss.toFixed(2)}
                            </Tag>
                        </div>
                    </Card>
                )}

                {/* 当前步骤内容 */}
                <Card variant="elevated" padding="lg" className="relative overflow-hidden">
                    {/* 左侧高亮条 */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />

                    {/* 步骤标题 */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-accent text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
                                STEP {currentStep}
                            </span>
                            <label className="block text-lg font-bold text-text">
                                {REVIEW_STEPS[currentStep - 1].title}
                            </label>
                        </div>
                        <p className="text-xs text-text-sub">
                            {REVIEW_STEPS[currentStep - 1].description}
                        </p>
                    </div>

                    {/* 步骤 2: 入场策略 */}
                    {currentStep === 2 && (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-medium text-text-sub mb-2">核心策略</label>
                                <select
                                    value={formData.entryStrategy}
                                    onChange={(e) => setFormData({ ...formData, entryStrategy: e.target.value })}
                                    className="w-full rounded-xl border border-border bg-bg text-text py-3.5 pl-4 pr-10 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                                >
                                    {ENTRY_STRATEGIES.map((strategy) => (
                                        <option key={strategy} value={strategy}>{strategy}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-text-sub mb-3">共振因子 (可多选)</label>
                                <div className="flex flex-wrap gap-2.5">
                                    {RESONANCE_FACTORS.map((factor) => (
                                        <button
                                            key={factor}
                                            type="button"
                                            onClick={() => toggleResonanceFactor(factor)}
                                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${formData.resonanceFactors.includes(factor)
                                                    ? 'bg-accent text-black shadow-glow'
                                                    : 'bg-bg text-text-sub border border-border hover:border-text-sub/50 hover:bg-card'
                                                }`}
                                        >
                                            {factor}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        className="flex items-center px-3 py-2 rounded-lg text-xs font-medium border border-dashed border-text-sub/40 text-text-sub hover:text-accent hover:border-accent transition-colors bg-transparent"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        自定义
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-text-sub mb-2">补充说明</label>
                                <input
                                    type="text"
                                    placeholder="一句话描述入场时的具体形态..."
                                    value={formData.entryDescription}
                                    onChange={(e) => setFormData({ ...formData, entryDescription: e.target.value })}
                                    className="w-full rounded-xl bg-bg border border-border text-sm text-text placeholder-text-muted py-3 px-4 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                                />
                            </div>
                        </div>
                    )}

                    {/* 步骤 3: 情绪状态 */}
                    {currentStep === 3 && (
                        <div className="space-y-5">
                            <div className="relative pt-2 pb-1">
                                <div className="flex justify-between text-xs text-text-sub mb-2 font-medium">
                                    <span>恐惧</span>
                                    <span>贪婪</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={formData.emotionScore}
                                    onChange={(e) => setFormData({ ...formData, emotionScore: parseInt(e.target.value) })}
                                    className="w-full h-1.5 bg-bg rounded-lg appearance-none cursor-pointer accent-accent"
                                />
                                <div className="flex justify-between mt-3 px-1">
                                    {emotionEmojis.map((emoji, i) => (
                                        <span
                                            key={i}
                                            className={`text-xl transition-all ${formData.emotionScore === i + 1
                                                    ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]'
                                                    : 'grayscale opacity-50'
                                                }`}
                                        >
                                            {emoji}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-center text-sm font-medium text-accent mt-4">
                                    {emotionLabels[formData.emotionScore - 1]}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 步骤 4: 出场策略 */}
                    {currentStep === 4 && (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-medium text-text-sub mb-3">出场原因</label>
                                <div className="flex flex-wrap gap-2.5">
                                    {EXIT_STRATEGIES.map((strategy) => (
                                        <button
                                            key={strategy}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, exitStrategy: strategy })}
                                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${formData.exitStrategy === strategy
                                                    ? 'bg-accent text-black shadow-glow'
                                                    : 'bg-bg text-text-sub border border-border hover:border-text-sub/50 hover:bg-card'
                                                }`}
                                        >
                                            {strategy}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-text-sub mb-2">出场描述</label>
                                <textarea
                                    placeholder="描述您的出场决策过程..."
                                    value={formData.exitDescription}
                                    onChange={(e) => setFormData({ ...formData, exitDescription: e.target.value })}
                                    rows={3}
                                    className="w-full rounded-xl bg-bg border border-border text-sm text-text placeholder-text-muted py-3 px-4 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* 步骤 5: 做对了什么 */}
                    {currentStep === 5 && (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-medium text-text-sub mb-2">
                                    <span className="text-down mr-1">✓</span>
                                    这笔交易中哪些决策是正确的？
                                </label>
                                <textarea
                                    placeholder="例如：严格执行了止损计划，没有追高..."
                                    value={formData.whatWentWell}
                                    onChange={(e) => setFormData({ ...formData, whatWentWell: e.target.value })}
                                    rows={4}
                                    className="w-full rounded-xl bg-bg border border-border text-sm text-text placeholder-text-muted py-3 px-4 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* 步骤 6: 做错了什么 */}
                    {currentStep === 6 && (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-medium text-text-sub mb-2">
                                    <span className="text-up mr-1">✗</span>
                                    这笔交易中哪些决策需要改进？
                                </label>
                                <textarea
                                    placeholder="例如：仓位过重，情绪化加仓..."
                                    value={formData.whatWentWrong}
                                    onChange={(e) => setFormData({ ...formData, whatWentWrong: e.target.value })}
                                    rows={4}
                                    className="w-full rounded-xl bg-bg border border-border text-sm text-text placeholder-text-muted py-3 px-4 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* 步骤 7: 经验教训 */}
                    {currentStep === 7 && (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-medium text-text-sub mb-2">
                                    <span className="text-accent mr-1">💡</span>
                                    从这笔交易中学到了什么？
                                </label>
                                <textarea
                                    placeholder="总结可以应用到未来交易中的经验教训..."
                                    value={formData.lessonsLearned}
                                    onChange={(e) => setFormData({ ...formData, lessonsLearned: e.target.value })}
                                    rows={4}
                                    className="w-full rounded-xl bg-bg border border-border text-sm text-text placeholder-text-muted py-3 px-4 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors resize-none"
                                />
                            </div>

                            <div className="pt-4 border-t border-border">
                                <p className="text-xs text-text-sub mb-3">🎉 最后一步！完成后即可保存复盘记录</p>
                            </div>
                        </div>
                    )}
                </Card>

                {/* 下一步预览（非最后一步时显示） */}
                {currentStep < REVIEW_STEPS.length && (
                    <Card variant="bordered" padding="md" className="opacity-80">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1 block">
                                    STEP {currentStep + 1}
                                </span>
                                <label className="block text-base font-bold text-text">
                                    {REVIEW_STEPS[currentStep].title}
                                </label>
                            </div>
                            <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                    </Card>
                )}
            </main>

            {/* 底部操作按钮 */}
            <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-bg via-bg to-transparent z-20">
                <div className="max-w-md mx-auto flex gap-4">
                    {currentStep > 1 ? (
                        <Button variant="outline" onClick={handlePrev} className="flex-1">
                            上一步
                        </Button>
                    ) : (
                        <Button variant="outline" onClick={handleSaveDraft} className="flex-1">
                            保存草稿
                        </Button>
                    )}
                    <Button
                        variant="primary"
                        onClick={handleNext}
                        className="flex-[2] flex items-center justify-center gap-2"
                    >
                        {currentStep === REVIEW_STEPS.length ? '完成复盘' : '下一步'}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Button>
                </div>
            </div>
        </PageContainer>
    )
}

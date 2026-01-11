'use client'

import { useState } from 'react'
import { PageContainer, Header } from '@/components/layout'
import { Card, Tag, Button } from '@/components/ui'

// 模拟规则数据
const mockRules = [
    {
        id: '1',
        category: '进场设定',
        title: '等待 K 线收盘',
        description: '不在 K 线收盘前入场，避免假突破',
        icon: '⏰',
        color: 'blue',
        isActive: true,
    },
    {
        id: '2',
        category: '风控管理',
        title: '单笔风险上限 2%',
        description: '每笔交易亏损不超过总资产的 2%',
        icon: '🛡️',
        color: 'green',
        isActive: true,
    },
    {
        id: '3',
        category: '心态控制',
        title: '禁止报复性交易',
        description: '亏损后不能在同一天内加仓翻本',
        icon: '🧘',
        color: 'purple',
        isActive: true,
    },
    {
        id: '4',
        category: '止盈止损',
        title: '2R 止盈原则',
        description: '盈利达到 2 倍风险时考虑止盈',
        icon: '🎯',
        color: 'orange',
        isActive: false,
    },
    {
        id: '5',
        category: '进场设定',
        title: '只做主升浪',
        description: '只在趋势确认后的回踩进场',
        icon: '📈',
        color: 'blue',
        isActive: true,
    },
]

const mockViolations = [
    {
        id: '1',
        ruleTitle: '止损违规',
        description: '比亚迪 002594 未执行止损',
        severity: 'high',
        date: '今天',
    },
]

const CATEGORIES = ['全部', '进场设定', '风控管理', '心态控制', '止盈止损']

export default function RulesPage() {
    const [selectedCategory, setSelectedCategory] = useState('全部')
    const [rules, setRules] = useState(mockRules)

    const filteredRules = selectedCategory === '全部'
        ? rules
        : rules.filter((rule) => rule.category === selectedCategory)

    const toggleRule = (ruleId: string) => {
        setRules((prev) =>
            prev.map((rule) =>
                rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
            )
        )
    }

    const getCategoryColor = (category: string) => {
        switch (category) {
            case '进场设定': return 'primary'
            case '风控管理': return 'success'
            case '心态控制': return 'warning'
            case '止盈止损': return 'danger'
            default: return 'default'
        }
    }

    return (
        <PageContainer>
            {/* 顶部导航 */}
            <nav className="sticky top-0 z-50 bg-bg/95 backdrop-blur-md px-4 py-3 flex justify-between items-center border-b border-border">
                <button
                    onClick={() => window.history.back()}
                    className="p-2 -ml-2 rounded-full hover:bg-card transition-colors active:scale-95"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="flex items-center gap-2">
                    <button className="p-2 rounded-full hover:bg-card transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                    <button className="relative p-2 rounded-full hover:bg-card transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {mockViolations.length > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-up rounded-full border border-bg" />
                        )}
                    </button>
                </div>
            </nav>

            <main className="px-4 pb-24">
                {/* 页面标题 */}
                <header className="mt-6 mb-4 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-text">我的规则</h1>
                        <p className="text-sm text-text-sub mt-1">建立并遵守您的交易纪律</p>
                    </div>
                    <Button variant="primary" size="sm" className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        新建
                    </Button>
                </header>

                {/* 违规提醒卡片 */}
                {mockViolations.length > 0 && (
                    <Card variant="bordered" padding="md" className="mb-6 border-up/30 bg-up/5">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-up/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-up" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-text">规则检查器</h3>
                                    <p className="text-xs text-text-sub mt-0.5">
                                        发现 <span className="text-up font-bold">{mockViolations.length} 个违规</span>
                                    </p>
                                </div>
                            </div>
                            <button className="text-xs text-primary font-medium hover:underline flex items-center">
                                查看分析
                                <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* 违规详情 */}
                        <div className="mt-4 pt-3 border-t border-up/20">
                            {mockViolations.map((violation) => (
                                <div key={violation.id} className="flex items-center gap-3">
                                    <div className="w-1 h-8 bg-up rounded-full" />
                                    <div>
                                        <p className="text-sm font-medium text-text">{violation.ruleTitle}</p>
                                        <p className="text-xs text-text-sub">{violation.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* 分类筛选 */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-all ${selectedCategory === category
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-card border border-border text-text-sub hover:text-text hover:border-text-sub/50'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* 规则列表 */}
                <div className="space-y-3">
                    {filteredRules.map((rule) => (
                        <Card
                            key={rule.id}
                            variant="bordered"
                            padding="md"
                            className={`transition-opacity ${!rule.isActive ? 'opacity-50' : ''}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-bg flex items-center justify-center text-xl">
                                        {rule.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-text">{rule.title}</h3>
                                        </div>
                                        <p className="text-xs text-text-sub leading-relaxed">{rule.description}</p>
                                        <Tag variant={getCategoryColor(rule.category) as any} size="sm" className="mt-2">
                                            {rule.category}
                                        </Tag>
                                    </div>
                                </div>

                                {/* 开关 */}
                                <button
                                    onClick={() => toggleRule(rule.id)}
                                    className={`relative w-12 h-7 rounded-full transition-colors ${rule.isActive ? 'bg-primary' : 'bg-border'
                                        }`}
                                >
                                    <span
                                        className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${rule.isActive ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* 空状态 */}
                {filteredRules.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <p className="text-sm text-text-sub">该分类下暂无规则</p>
                        <Button variant="outline" size="sm" className="mt-4">
                            创建规则
                        </Button>
                    </div>
                )}
            </main>
        </PageContainer>
    )
}

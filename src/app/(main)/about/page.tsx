'use client'

import { useRouter } from 'next/navigation'

export default function AboutPage() {
    const router = useRouter()

    return (
        <div className="max-w-md mx-auto min-h-screen pb-24 px-5">
            {/* 顶栏 */}
            <header className="pt-12 pb-6 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 rounded-full hover:bg-card transition-colors active:scale-95"
                >
                    <svg className="w-6 h-6 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold text-text">关于复盘大师</h1>
            </header>

            <div className="mt-8 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-primary rounded-3xl shadow-xl shadow-primary/20 flex items-center justify-center mb-6">
                    <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-black text-text italic">REVIEW MASTER</h2>
                <p className="text-primary font-bold tracking-[0.2em] text-xs mt-1">复盘大师 v1.2.0</p>

                <div className="mt-12 space-y-6 text-left">
                    <section>
                        <h3 className="font-bold text-text flex items-center gap-2">
                            <span className="w-1 h-4 bg-primary rounded-full" />
                            我们的使命
                        </h3>
                        <p className="text-sm text-text-sub mt-2 leading-relaxed">
                            复盘大师致力于通过数字化的手段，帮助每一位 A 股交易者建立科学的交易纪律，记录真实的成交心路，并通过多维度的统计分析，发现自身的交易弱点，最终实现稳定盈利。
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-text flex items-center gap-2">
                            <span className="w-1 h-4 bg-primary rounded-full" />
                            核心功能
                        </h3>
                        <ul className="mt-3 grid grid-cols-2 gap-3">
                            {[
                                ['记录', '秒级成交记录存储'],
                                ['分析', '多维度胜率与盈亏比'],
                                ['规则', '可视化交易纪律检查'],
                                ['成长', '权益曲线动态跟踪'],
                            ].map(([title, desc]) => (
                                <li key={title} className="bg-card p-3 rounded-xl border border-border">
                                    <h4 className="text-xs font-black text-primary">{title}</h4>
                                    <p className="text-[10px] text-text-sub mt-1">{desc}</p>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-bold text-text flex items-center gap-2">
                            <span className="w-1 h-4 bg-primary rounded-full" />
                            联系我们
                        </h3>
                        <div className="mt-3 p-4 bg-card rounded-xl border border-border space-y-2">
                            <p className="text-sm text-text">
                                <span className="text-text-muted">官方网站：</span>
                                <span className="font-medium">yvanplanet.com</span>
                            </p>
                            <p className="text-sm text-text">
                                <span className="text-text-muted">技术支持：</span>
                                <span className="font-medium">support@yvanplanet.com</span>
                            </p>
                        </div>
                    </section>
                </div>

                <div className="mt-16 pb-12">
                    <p className="text-[10px] text-text-muted uppercase tracking-widest font-medium">Produced by</p>
                    <p className="text-sm font-black text-text mt-1">YVAN PLANET LABS</p>
                </div>
            </div>
        </div>
    )
}

export default function ProfilePage() {
    return (
        <div className="max-w-md mx-auto min-h-screen pb-24 px-5">
            <header className="pt-12 pb-6">
                <h1 className="text-2xl font-bold text-text">我的</h1>
                <p className="text-sm text-text-sub mt-1">账户设置与个人信息</p>
            </header>

            <div className="flex items-center justify-center h-64 bg-card rounded-xl border border-border">
                <div className="text-center text-text-muted">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-sm">个人中心开发中...</p>
                    <p className="text-xs mt-1">敬请期待</p>
                </div>
            </div>
        </div>
    )
}

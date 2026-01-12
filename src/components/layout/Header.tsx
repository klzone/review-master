import Link from 'next/link'

interface HeaderProps {
    title?: string
    showBack?: boolean
    showNotification?: boolean
    showSettings?: boolean
    backHref?: string
    rightElement?: React.ReactNode
    user?: {
        name: string
        avatarUrl?: string
    }
}

export function Header({
    title,
    showBack = false,
    showNotification = true,
    showSettings = true,
    backHref = '/',
    rightElement,
    user,
}: HeaderProps) {
    return (
        <header className="sticky top-0 z-40 bg-bg/95 backdrop-blur-md px-5 pt-12 pb-4 flex justify-between items-center border-b border-border/50">
            {/* 左侧 */}
            <div className="flex items-center gap-3">
                {showBack ? (
                    <Link
                        href={backHref}
                        className="p-2 -ml-2 rounded-full hover:bg-card transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                ) : user ? (
                    <>
                        <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center border border-border overflow-hidden">
                            {user.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt="头像"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-lg font-bold text-primary">
                                    {user.name.charAt(0)}
                                </span>
                            )}
                        </div>
                        <div>
                            <p className="text-xs text-text-sub font-medium">欢迎回来，</p>
                            <h2 className="text-lg font-bold text-text leading-tight">
                                {user.name}
                            </h2>
                        </div>
                    </>
                ) : null}

                {title && !user && !showBack && (
                    <h1 className="text-lg font-bold text-text tracking-wide">{title}</h1>
                )}
            </div>

            {/* 中间标题 */}
            {title && showBack && (
                <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-text">
                    {title}
                </h1>
            )}

            {/* 右侧 */}
            <div className="flex items-center gap-2">
                {rightElement || (
                    <>
                        {showNotification && (
                            <button className="relative p-2 rounded-full bg-card border border-border text-text-muted hover:text-text transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {/* 通知小红点 */}
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-up rounded-full border-2 border-bg" />
                            </button>
                        )}
                        {showSettings && (
                            <Link
                                href="/profile/settings"
                                className="p-2 rounded-full bg-card border border-border text-text-muted hover:text-text transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </Link>
                        )}
                    </>
                )}
            </div>
        </header>
    )
}

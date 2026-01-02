import { ReactNode } from 'react'

interface PageContainerProps {
    children: ReactNode
    className?: string
    withBottomNav?: boolean
    withHeader?: boolean
}

export function PageContainer({
    children,
    className = '',
    withBottomNav = true,
    withHeader = true,
}: PageContainerProps) {
    return (
        <div
            className={`
        max-w-md mx-auto min-h-screen relative
        bg-bg
        ${withBottomNav ? 'pb-24' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    )
}

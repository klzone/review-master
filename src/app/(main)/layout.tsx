import { BottomNav } from '@/components/layout'

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
            <BottomNav />
        </>
    )
}

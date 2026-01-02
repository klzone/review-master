interface ProgressBarProps {
    value: number // 0-100
    max?: number
    size?: 'sm' | 'md' | 'lg'
    color?: 'primary' | 'accent' | 'success' | 'danger'
    showLabel?: boolean
    label?: string
    animated?: boolean
}

export function ProgressBar({
    value,
    max = 100,
    size = 'md',
    color = 'accent',
    showLabel = false,
    label,
    animated = true,
}: ProgressBarProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const heights = {
        sm: 'h-1',
        md: 'h-1.5',
        lg: 'h-2',
    }

    const colors = {
        primary: 'bg-primary',
        accent: 'bg-accent',
        success: 'bg-down',
        danger: 'bg-up',
    }

    const glowColors = {
        primary: 'shadow-[0_0_8px_rgba(46,58,89,0.5)]',
        accent: 'shadow-[0_0_8px_rgba(245,158,11,0.5)]',
        success: 'shadow-[0_0_8px_rgba(16,185,129,0.5)]',
        danger: 'shadow-[0_0_8px_rgba(239,68,68,0.5)]',
    }

    return (
        <div className="w-full">
            {(showLabel || label) && (
                <div className="flex justify-between mb-1.5">
                    {label && (
                        <span className="text-xs font-medium text-text-sub">{label}</span>
                    )}
                    {showLabel && (
                        <span className="text-xs font-bold text-accent">
                            {Math.round(percentage)}%
                        </span>
                    )}
                </div>
            )}
            <div
                className={`w-full bg-border rounded-full overflow-hidden ${heights[size]}`}
            >
                <div
                    className={`
            ${heights[size]}
            ${colors[color]}
            ${glowColors[color]}
            rounded-full
            ${animated ? 'transition-all duration-500 ease-out' : ''}
          `}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}

export type { ProgressBarProps }

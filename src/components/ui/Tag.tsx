import { HTMLAttributes, forwardRef } from 'react'

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'primary' | 'success' | 'danger' | 'warning'
    size?: 'sm' | 'md'
    removable?: boolean
    onRemove?: () => void
}

const Tag = forwardRef<HTMLSpanElement, TagProps>(
    (
        {
            children,
            className = '',
            variant = 'default',
            size = 'md',
            removable = false,
            onRemove,
            ...props
        },
        ref
    ) => {
        const baseStyles =
            'inline-flex items-center font-medium rounded-lg border transition-colors'

        const variants = {
            default: 'bg-bg border-border text-text-sub',
            primary: 'bg-accent/10 border-accent/20 text-accent',
            success: 'bg-down/10 border-down/20 text-down',
            danger: 'bg-up/10 border-up/20 text-up',
            warning: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
        }

        const sizes = {
            sm: 'px-2 py-0.5 text-[10px]',
            md: 'px-3 py-1 text-xs',
        }

        return (
            <span
                ref={ref}
                className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
                {...props}
            >
                {children}
                {removable && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="ml-1.5 -mr-0.5 hover:opacity-70 transition-opacity"
                    >
                        <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
            </span>
        )
    }
)

Tag.displayName = 'Tag'

export { Tag }
export type { TagProps }

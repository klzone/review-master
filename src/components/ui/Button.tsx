import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            className = '',
            variant = 'primary',
            size = 'md',
            fullWidth = false,
            loading = false,
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles =
            'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none'

        const variants = {
            primary:
                'bg-accent text-white hover:bg-accent-hover shadow-lg shadow-accent/20',
            secondary:
                'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20',
            outline:
                'bg-transparent border border-border text-text hover:bg-card hover:border-primary/30',
            ghost:
                'bg-transparent text-text-sub hover:bg-card hover:text-text',
            danger:
                'bg-up text-white hover:bg-up/90 shadow-lg shadow-up/20',
        }

        const sizes = {
            sm: 'px-3 py-1.5 text-xs',
            md: 'px-4 py-2.5 text-sm',
            lg: 'px-6 py-3.5 text-base',
        }

        return (
            <button
                ref={ref}
                className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
                disabled={disabled || loading}
                {...props}
            >
                {loading && (
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'

export { Button }
export type { ButtonProps }

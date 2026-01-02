import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'bordered' | 'glow'
    padding?: 'none' | 'sm' | 'md' | 'lg'
    hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            children,
            className = '',
            variant = 'default',
            padding = 'md',
            hover = false,
            ...props
        },
        ref
    ) => {
        const baseStyles = 'rounded-xl transition-all duration-200'

        const variants = {
            default: 'bg-card shadow-card',
            elevated: 'bg-card shadow-soft',
            bordered: 'bg-card border border-border',
            glow: 'bg-card shadow-soft shadow-glow',
        }

        const paddings = {
            none: '',
            sm: 'p-3',
            md: 'p-4',
            lg: 'p-6',
        }

        const hoverStyles = hover
            ? 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
            : ''

        return (
            <div
                ref={ref}
                className={`
          ${baseStyles}
          ${variants[variant]}
          ${paddings[padding]}
          ${hoverStyles}
          ${className}
        `}
                {...props}
            >
                {children}
            </div>
        )
    }
)

Card.displayName = 'Card'

export { Card }
export type { CardProps }

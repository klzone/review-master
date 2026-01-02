import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, className = '', id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

        return (
            <div className="space-y-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-xs font-medium text-text-sub"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`
            w-full px-4 py-3 text-sm
            bg-bg border border-border rounded-xl
            text-text placeholder-text-muted
            focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-up focus:ring-up/50 focus:border-up' : ''}
            ${className}
          `}
                    {...props}
                />
                {error && (
                    <p className="text-xs text-up font-medium">{error}</p>
                )}
                {hint && !error && (
                    <p className="text-xs text-text-muted">{hint}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export { Input }
export type { InputProps }

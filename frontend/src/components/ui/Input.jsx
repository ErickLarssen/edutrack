import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export const Input = forwardRef(function Input({ className, label, error, id, ...props }, ref) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={id} className="text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                id={id}
                className={cn(
                    'h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900',
                    'placeholder:text-slate-400',
                    'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
                    error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
                    className
                )}
                {...props}
            />
            {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
    )
})
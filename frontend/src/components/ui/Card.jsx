import { cn } from '../../utils/cn'

export function Card({ className, children, ...props }) {
    return (
        <div className={cn('rounded-card border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900', className)} {...props}>
            {children}
        </div>
    )
}

export function CardHeader({ className, children, ...props }) {
    return (
        <div className={cn('border-b border-slate-200 px-6 py-4 dark:border-slate-800', className)} {...props}>
            {children}
        </div>
    )
}

export function CardContent({ className, children, ...props }) {
    return (
        <div className={cn('px-6 py-4', className)} {...props}>
            {children}
        </div>
    )
}
import { cn } from '../../utils/cn'

export function Card({ className, children, ...props }) {
    return (
        <div className={cn('rounded-card border border-slate-200 bg-white shadow-sm', className)} {...props}>
            {children}
        </div>
    )
}

export function CardHeader({ className, children, ...props }) {
    return (
        <div className={cn('border-b border-slate-200 px-6 py-4', className)} {...props}>
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
import { cn } from '../../utils/cn'

const VARIANTS = {
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    success: 'bg-green-100 text-green-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
    danger: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
    info: 'bg-blue-100 text-blue-700 dark:bg-sky-500/15 dark:text-sky-400',
}

export function Badge({ variant = 'neutral', className, children }) {
    return (
        <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', VARIANTS[variant], className)}>
            {children}
        </span>
    )
}
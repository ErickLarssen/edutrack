import { cn } from '../../utils/cn'
import { Card } from './Card'

const TONES = {
    brand: {
        chip: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400',
        glow: 'from-brand-500/20 dark:from-brand-500/40',
        ring: 'dark:ring-brand-500/25',
        shadow: 'dark:shadow-brand-500/20',
        linha: 'text-brand-500/0 dark:text-brand-500/50',
    },
    success: {
        chip: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
        glow: 'from-emerald-400/25 dark:from-emerald-500/40',
        ring: 'dark:ring-emerald-500/25',
        shadow: 'dark:shadow-emerald-500/20',
        linha: 'text-emerald-500/0 dark:text-emerald-400/50',
    },
    warning: {
        chip: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
        glow: 'from-amber-400/25 dark:from-amber-500/40',
        ring: 'dark:ring-amber-500/25',
        shadow: 'dark:shadow-amber-500/20',
        linha: 'text-amber-500/0 dark:text-amber-400/50',
    },
    neutral: {
        chip: 'bg-slate-100 text-slate-500 dark:text-slate-400 dark:bg-slate-500/15 dark:text-slate-400',
        glow: 'from-slate-400/20 dark:from-slate-500/35',
        ring: 'dark:ring-slate-500/20',
        shadow: 'dark:shadow-slate-500/10',
        linha: 'text-slate-500/0 dark:text-slate-400/40',
    },
}

export function StatCard({ label, value, icon: Icon, tone = 'brand' }) {
    const tons = TONES[tone]

    return (
        <Card className={cn('relative overflow-hidden p-5 transition-shadow dark:shadow-lg dark:ring-1', tons.ring, tons.shadow)}>
            <div className={cn('pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-linear-to-br to-transparent blur-2xl', tons.glow)} />

            <svg className={cn('pointer-events-none absolute -bottom-1 -right-1 h-20 w-20 transition-colors', tons.linha)} viewBox="0 0 100 100" fill="none">
                <path d="M100 20 L60 60" stroke="currentColor" strokeWidth="1.5" />
                <path d="M100 45 L75 70" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="60" cy="60" r="3" fill="currentColor" />
                <circle cx="75" cy="70" r="2" fill="currentColor" />
            </svg>

            <div className={cn('relative flex h-12 w-12 items-center justify-center rounded-xl', tons.chip)}>
                <Icon className="h-6 w-6" />
            </div>

            <p className="relative mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{value}</p>
            <p className="relative mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        </Card>
    )
}
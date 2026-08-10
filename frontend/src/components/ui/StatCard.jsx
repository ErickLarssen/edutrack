import { Card } from './Card'
import { cn } from '../../utils/cn'

const TONES = {
    brand: 'bg-brand-50 text-brand-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-amber-50 text-amber-600',
    neutral: 'bg-slate-100 text-slate-600',
}

export function StatCard({ label, value, icon: Icon, tone = 'brand' }) {
    return (
        <Card className="flex items-center gap-4 p-5">
            <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-lg', TONES[tone])}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-2xl font-semibold text-slate-900">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
            </div>
        </Card>
    )
}
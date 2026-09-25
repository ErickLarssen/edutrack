import { cn } from '../../utils/cn'

export function Table({ className, children }) {
    return (
        <div className="overflow-x-auto rounded-card border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <table className={cn('w-full text-left text-sm', className)}>{children}</table>
        </div>
    )
}

export function TableHead({ children }) {
    return <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">{children}</thead>
}

export function TableBody({ children }) {
    return <tbody className="divide-y divide-slate-100 dark:divide-slate-800">{children}</tbody>
}

export function TableRow({ children, className }) {
    return <tr className={cn('hover:bg-slate-50 dark:hover:bg-slate-800/50', className)}>{children}</tr>
}

export function TableHeaderCell({ children, className }) {
    return <th className={cn('px-4 py-3 font-medium text-slate-600 dark:text-slate-400', className)}>{children}</th>
}

export function TableCell({ children, className }) {
    return <td className={cn('px-4 py-3 text-slate-700 dark:text-slate-300', className)}>{children}</td>
}
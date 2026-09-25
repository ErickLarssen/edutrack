export function Spinner({ className = '' }) {
    return (
        <div className={`flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 ${className}`}>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600 dark:border-slate-700" />
            Carregando...
        </div>
    )
}
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'

export function Pagination({ pagina, limite, total, onChange }) {
    const totalPaginas = Math.max(1, Math.ceil(total / limite))
    if (totalPaginas <= 1) return null

    return (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-600">
            <span>
                Página {pagina} de {totalPaginas} — {total} registro{total === 1 ? '' : 's'}
            </span>
            <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => onChange(pagina - 1)} disabled={pagina <= 1}>
                    <ChevronLeft className="h-4 w-4" /> Anterior
                </Button>
                <Button variant="secondary" size="sm" onClick={() => onChange(pagina + 1)} disabled={pagina >= totalPaginas}>
                    Próxima <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
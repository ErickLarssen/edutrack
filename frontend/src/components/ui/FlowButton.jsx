import { ArrowRight } from 'lucide-react'
import { cn } from '../../utils/cn'

export function FlowButton({ text = 'Continuar', className, ...props }) {
    return (
        <button
            className={cn(
                'group relative flex w-full items-center justify-center gap-1 overflow-hidden rounded-[100px] border-[1.5px] border-slate-400/40 bg-transparent px-8 py-3 text-sm font-semibold text-slate-900 transition-all duration-600 ease-[cubic-bezier(0.23,1,0.32,1)]',
                'hover:rounded-xl hover:border-transparent hover:text-white active:scale-[0.97]',
                'disabled:pointer-events-none disabled:opacity-50',
                className
            )}
            {...props}
        >
            <span className="absolute inset-0 origin-center scale-0 rounded-[inherit] bg-blue-600 transition-transform duration-600 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-100" />

            <ArrowRight className="absolute left-[-25%] z-9 h-4 w-4 stroke-slate-900 transition-all duration-800 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:left-4 group-hover:stroke-white" />
            <span className="relative z-1 -translate-x-3 transition-all duration-800 ease-out group-hover:translate-x-3">
                {text}
            </span>
            <ArrowRight className="absolute right-4 z-9 h-4 w-4 stroke-slate-900 transition-all duration-800 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:right-[-25%] group-hover:stroke-white" />
        </button>
    )
}
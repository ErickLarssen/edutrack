import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { createPortal } from 'react-dom'
import { useEffect } from 'react'
import { X } from 'lucide-react'

export function Modal({ aberto, onFechar, title, children }) {
    const conteudoRef = useRef(null)

    useEffect(() => {
        if (!aberto) return
        const handleEsc = (e) => e.key === 'Escape' && onFechar()
        document.addEventListener('keydown', handleEsc)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', handleEsc)
            document.body.style.overflow = ''
        }
    }, [aberto, onFechar])

    useGSAP(
        () => {
            if (!aberto) return
            gsap.fromTo(
                conteudoRef.current,
                { opacity: 0, scale: 0.96, y: 8 },
                { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: 'power2.out' }
            )
        },
        { dependencies: [aberto] }
    )

    if (!aberto) return null

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/50" onClick={onFechar} />
            <div ref={conteudoRef} className="relative z-10 w-full max-w-lg rounded-card bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                    <button onClick={onFechar} className="text-slate-400 hover:text-slate-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto p-6">{children}</div>
            </div>
        </div>,
        document.body
    )
}
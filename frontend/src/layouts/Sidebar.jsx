import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    Laptop,
    GraduationCap,
    ArrowRightLeft,
    Undo2,
    Wrench,
    BarChart3,
    UserCog,
    QrCode,
    X,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { cn } from '../utils/cn'

const NAV_ITEMS = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/equipamentos', label: 'Equipamentos', icon: Laptop },
    { to: '/etiquetas', label: 'Etiquetas', icon: QrCode },
    { to: '/professores', label: 'Professores', icon: GraduationCap },
    { to: '/emprestimos', label: 'Empréstimos', icon: ArrowRightLeft },
    { to: '/devolucoes', label: 'Devoluções', icon: Undo2 },
    { to: '/manutencoes', label: 'Manutenção', icon: Wrench },
    { to: '/relatorios', label: 'Relatórios', icon: BarChart3 },
    { to: '/usuarios', label: 'Usuários', icon: UserCog, apenasAdmin: true },
]

export function Sidebar({ aberta, onFechar }) {
    const { usuario } = useAuth()
    const itensVisiveis = NAV_ITEMS.filter((item) => !item.apenasAdmin || usuario?.role === 'ADMIN')

    return (
        <>
            {aberta && <div className="fixed inset-0 z-30 bg-slate-900/40 md:hidden print:hidden" onClick={onFechar} />}

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-40 w-64 -translate-x-full overflow-hidden border-r border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 transition-transform duration-200 md:translate-x-0 print:hidden',
                    aberta && 'translate-x-0'
                )}
            >
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -left-10 top-16 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl" />
                    <div className="absolute -right-16 top-1/2 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
                    <svg className="absolute bottom-0 left-0 h-64 w-64 text-blue-400/10" viewBox="0 0 200 200" fill="none">
                        <circle cx="20" cy="180" r="70" stroke="currentColor" strokeWidth="1" />
                        <circle cx="20" cy="180" r="110" stroke="currentColor" strokeWidth="1" />
                    </svg>
                    <svg className="absolute right-4 top-24 h-24 w-24 text-indigo-400/10" viewBox="0 0 100 100" fill="none">
                        <rect x="10" y="10" width="80" height="80" rx="16" stroke="currentColor" strokeWidth="1" transform="rotate(15 50 50)" />
                    </svg>
                </div>

                <div className="relative flex h-16 items-center justify-between border-b border-white/10 px-6">
                    <img src="/logo-proadesk.png" alt="Proadesk" className="h-9 w-auto" />
                    <button onClick={onFechar} className="text-slate-400 md:hidden">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="relative flex flex-col gap-1 p-3">
                    {itensVisiveis.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            onClick={onFechar}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400',
                                    isActive
                                        ? 'bg-gradient-to-r from-brand-500 to-indigo-600 text-white shadow-lg shadow-brand-900/40'
                                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                )
                            }
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    )
}
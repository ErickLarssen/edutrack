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
    X,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { cn } from '../utils/cn'

const NAV_ITEMS = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/equipamentos', label: 'Equipamentos', icon: Laptop },
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
            {aberta && <div className="fixed inset-0 z-30 bg-slate-900/40 md:hidden" onClick={onFechar} />}

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-40 w-64 -translate-x-full border-r border-slate-200 bg-white transition-transform duration-200 md:translate-x-0',
                    aberta && 'translate-x-0'
                )}
            >
                <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
                    <span className="text-lg font-semibold text-brand-600">EduTrack</span>
                    <button onClick={onFechar} className="md:hidden">
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                <nav className="flex flex-col gap-1 p-3">
                    {itensVisiveis.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            onClick={onFechar}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
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
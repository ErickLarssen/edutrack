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

/**
 * Rail flutuante.
 * - md+: pílula vertical só com ícones (4rem) que expande com rótulos ao hover
 *   ou foco por teclado, sobrepondo o painel (não empurra o conteúdo).
 * - mobile: drawer de vidro aberto pelo botão do Topbar.
 */
export function Sidebar({ aberta, onFechar }) {
    const { usuario } = useAuth()
    const itensVisiveis = NAV_ITEMS.filter((item) => !item.apenasAdmin || usuario?.role === 'ADMIN')

    return (
        <>
            {aberta && (
                <div
                    className="fixed inset-0 z-30 bg-slate-900/40 md:hidden print:hidden"
                    onClick={onFechar}
                    aria-hidden="true"
                />
            )}

            <aside
                aria-label="Navegação principal"
                className={cn(
                    'rail-flutuante vidro-pilula group fixed z-40 flex flex-col overflow-y-auto overflow-x-hidden print:hidden',
                    // mobile: drawer
                    'bottom-3 left-3 top-3 w-64 -translate-x-[120%] rounded-[1.75rem] p-3 transition-transform duration-300',
                    aberta && 'translate-x-0',
                    // desktop: pílula vertical centralizada que expande no hover/foco
                    'md:bottom-auto md:left-4 md:top-1/2 md:max-h-[calc(100dvh-2rem)] md:w-16 md:-translate-y-1/2 md:translate-x-0 md:rounded-[2rem] md:p-2',
                    'md:transition-[width,box-shadow] md:duration-300 md:ease-out',
                    'md:hover:w-60 md:has-[:focus-visible]:w-60'
                )}
            >
                <div className="mb-2 flex h-12 shrink-0 items-center justify-between">
                    <img src="/logo-proadesk.png" alt="Proadesk" className="h-10 w-auto md:hidden" />
                    <img
                        src="/proadesk-logo-sem-tipografia.png"
                        alt="Proadesk"
                        className="mx-auto hidden h-9 w-9 object-contain md:block"
                    />
                    <button
                        onClick={onFechar}
                        aria-label="Fechar menu"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/10 md:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="flex flex-col gap-1">
                    {itensVisiveis.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            onClick={onFechar}
                            className={({ isActive }) =>
                                cn(
                                    'flex h-11 shrink-0 items-center gap-3 rounded-2xl px-3.5 text-sm font-medium transition-colors',
                                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400',
                                    isActive
                                        ? 'bg-linear-to-r from-brand-500 to-indigo-600 text-white shadow-lg shadow-brand-500/30'
                                        : 'text-slate-600 hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                                )
                            }
                        >
                            <Icon className="h-5 w-5 shrink-0" />
                            <span className="whitespace-nowrap transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100 md:group-has-[:focus-visible]:opacity-100">
                                {label}
                            </span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    )
}

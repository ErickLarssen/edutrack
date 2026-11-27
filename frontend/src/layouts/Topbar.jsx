import { Menu, LogOut, Sun, Moon } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { ROLE_LABELS } from '../utils/role'
import { useTheme } from '../hooks/useTheme'
import { iniciaisDe, corDoAvatar } from '../utils/avatar'
import { cn } from '../utils/cn'

export function Topbar({ onAbrirMenu }) {
    const { usuario, logout } = useAuth()
    const { tema, alternar } = useTheme()
    const cor = corDoAvatar(usuario?.nome ?? '')

    return (
        <header className="vidro-pilula fixed left-3 right-3 top-3 z-30 flex h-14 items-center rounded-full px-3 md:left-24 md:right-4 md:top-4 md:px-4 print:hidden">
            <button
                onClick={onAbrirMenu}
                aria-label="Abrir menu"
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-900/5 focus-visible:outline-2 focus-visible:outline-brand-400 dark:text-slate-300 dark:hover:bg-white/10 md:hidden"
            >
                <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5 pl-1 md:pl-2">
                <img src="/proadesk-logo-sem-tipografia.png" alt="" className="h-8 w-8 object-contain" />
                <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">Proadesk</span>
            </div>

            <div className="ml-auto flex items-center gap-2 md:gap-3">
                <button
                    onClick={alternar}
                    title={tema === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
                    aria-label="Alternar tema"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-900/5 focus-visible:outline-2 focus-visible:outline-brand-400 dark:text-slate-300 dark:hover:bg-white/10"
                >
                    {tema === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>

                <span className="h-6 w-px bg-slate-900/10 dark:bg-white/15" />

                <div className="flex items-center gap-3">
                    <span
                        aria-hidden="true"
                        className={cn('flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold', cor.bg, cor.text)}
                    >
                        {iniciaisDe(usuario?.nome)}
                    </span>
                    <div className="hidden text-left sm:block">
                        <p className="text-sm font-medium leading-tight text-slate-900 dark:text-slate-100">{usuario?.nome}</p>
                        <p className="text-xs leading-tight text-slate-500 dark:text-slate-400">
                            {ROLE_LABELS[usuario?.role] ?? usuario?.role}
                        </p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    title="Sair"
                    aria-label="Sair"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-red-500/10 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-brand-400 dark:text-slate-300 dark:hover:text-red-400"
                >
                    <LogOut className="h-4 w-4" />
                </button>
            </div>
        </header>
    )
}

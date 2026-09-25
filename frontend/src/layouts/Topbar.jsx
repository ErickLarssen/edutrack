import { Menu, LogOut, Sun, Moon } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { ROLE_LABELS } from '../utils/role'
import { useTheme } from '../hooks/useTheme'

export function Topbar({ onAbrirMenu }) {
    const { usuario, logout } = useAuth()
    const { tema, alternar } = useTheme()

    return (
        <header className="flex h-16 items-center border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900 print:hidden">
            <button onClick={onAbrirMenu} className="text-slate-500 dark:text-slate-400 md:hidden" aria-label="Abrir menu">
                <Menu className="h-5 w-5" />
            </button>

            <div className="ml-auto flex items-center gap-4">
                <button
                    onClick={alternar}
                    title={tema === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
                    aria-label="Alternar tema"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                    {tema === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>

                <span className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

                <div className="text-right">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{usuario?.nome}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{ROLE_LABELS[usuario?.role] ?? usuario?.role}</p>
                </div>
                <button
                    onClick={logout}
                    title="Sair"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                >
                    <LogOut className="h-4 w-4" />
                </button>
            </div>
        </header>
    )
}
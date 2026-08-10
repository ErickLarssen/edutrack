import { Menu, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const ROLE_LABELS = {
    ADMIN: 'Administrador',
    COORDENADOR: 'Coordenador',
    DIRETOR: 'Diretor',
    ESTAGIARIO: 'Estagiário',
}

export function Topbar({ onAbrirMenu }) {
    const { usuario, logout } = useAuth()

    return (
        <header className="flex h-16 items-center border-b border-slate-200 bg-white px-6">
            <button onClick={onAbrirMenu} className="md:hidden">
                <Menu className="h-5 w-5 text-slate-600" />
            </button>

            <div className="ml-auto flex items-center gap-4">
                <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">{usuario?.nome}</p>
                    <p className="text-xs text-slate-500">{ROLE_LABELS[usuario?.role] ?? usuario?.role}</p>
                </div>
                <button
                    onClick={logout}
                    title="Sair"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-red-600"
                >
                    <LogOut className="h-4 w-4" />
                </button>
            </div>
        </header>
    )
}
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function ProtectedRoute() {
    const { estaAutenticado, carregando } = useAuth()

    if (carregando) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="text-sm text-slate-500">Carregando...</p>
            </div>
        )
    }

    if (!estaAutenticado) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}
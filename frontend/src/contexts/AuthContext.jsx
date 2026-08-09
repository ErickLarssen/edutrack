import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

const TOKEN_KEY = 'edutrack:token'
const USER_KEY = 'edutrack:usuario'

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => {
        const salvo = localStorage.getItem(USER_KEY)
        return salvo ? JSON.parse(salvo) : null
    })
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY)
        if (!token) {
            setCarregando(false)
            return
        }

        authService
            .me()
            .then((usuarioAtual) => {
                setUsuario(usuarioAtual)
                localStorage.setItem(USER_KEY, JSON.stringify(usuarioAtual))
            })
            .catch(() => {
                localStorage.removeItem(TOKEN_KEY)
                localStorage.removeItem(USER_KEY)
                setUsuario(null)
            })
            .finally(() => setCarregando(false))
    }, [])

    const login = async (email, senha) => {
        const { token, usuario: usuarioLogado } = await authService.login(email, senha)
        localStorage.setItem(TOKEN_KEY, token)
        localStorage.setItem(USER_KEY, JSON.stringify(usuarioLogado))
        setUsuario(usuarioLogado)
    }

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setUsuario(null)
    }

    return (
        <AuthContext.Provider value={{ usuario, carregando, login, logout, estaAutenticado: !!usuario }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth precisa ser usado dentro de um AuthProvider')
    }
    return context
}
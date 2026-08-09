import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'

export function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState('')
    const [enviando, setEnviando] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setErro('')
        setEnviando(true)
        try {
            await login(email, senha)
            navigate('/')
        } catch (error) {
            setErro(error.response?.data?.error?.message || 'Erro ao entrar. Tente novamente.')
        } finally {
            setEnviando(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <h1 className="text-lg font-semibold text-slate-900">EduTrack</h1>
                    <p className="text-sm text-slate-500">Entre com sua conta</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Input
                            id="email"
                            type="email"
                            label="Email"
                            placeholder="voce@edutrack.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            id="senha"
                            type="password"
                            label="Senha"
                            placeholder="********"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                        {erro && <p className="text-sm text-red-600">{erro}</p>}
                        <Button type="submit" disabled={enviando} className="mt-2">
                            {enviando ? 'Entrando...' : 'Entrar'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Laptop, ArrowRightLeft, BarChart3 } from 'lucide-react'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'

const DESTAQUES = [
    { icon: Laptop, texto: 'Controle completo do inventário de equipamentos' },
    { icon: ArrowRightLeft, texto: 'Empréstimos e devoluções em poucos cliques' },
    { icon: BarChart3, texto: 'Relatórios e dashboard em tempo real' },
]

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
        <div className="grid min-h-screen lg:grid-cols-2">
            <div className="relative hidden flex-col justify-between overflow-hidden bg-slate-900 p-10 text-white lg:flex">
                <div
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.5), transparent 40%), radial-gradient(circle at 80% 70%, rgba(99,102,241,0.35), transparent 45%)',
                    }}
                />
                <div className="relative flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
                        <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-semibold">EduTrack</span>
                </div>

                <div className="relative flex flex-col gap-8">
                    <div>
                        <h1 className="text-3xl font-semibold leading-tight">
                            Gestão de equipamentos escolares, sem planilha e sem papel.
                        </h1>
                        <p className="mt-3 text-sm text-slate-300">
                            Desenvolvido para o dia a dia do PROATI. Controle de tablets, notebooks e Chromebooks,
                            da retirada à devolução.
                        </p>
                    </div>

                    <ul className="flex flex-col gap-4">
                        {DESTAQUES.map(({ icon: Icon, texto }) => (
                            <li key={texto} className="flex items-center gap-3 text-sm text-slate-200">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                                    <Icon className="h-4 w-4" />
                                </span>
                                {texto}
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="relative text-xs text-slate-400">
                    Sistema desenvolvido por <a href="https://ericksilva.dev/">Erick Silva</a>.
                </p>
            </div>

            <div className="flex items-center justify-center bg-slate-50 p-6">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <div className="mb-1 flex items-center gap-2 lg:hidden">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
                                <GraduationCap className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-base font-semibold text-brand-600">EduTrack</span>
                        </div>
                        <h1 className="text-lg font-semibold text-slate-900">Bem-vindo de volta</h1>
                        <p className="text-sm text-slate-500">Entre com sua conta para continuar</p>
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
        </div>
    )
}
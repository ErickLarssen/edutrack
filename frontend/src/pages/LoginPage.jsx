import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Laptop, ArrowRightLeft, BarChart3 } from 'lucide-react'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { FlowButton } from '../components/ui/FlowButton'
import { SmokeyBackground } from '../components/ui/SmokeyBackground'
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
                <SmokeyBackground className="opacity-30" color="#009870" backdropBlurAmount="lg" />
                <div className="pointer-events-none absolute inset-0 bg-slate-900/50" />

                <div className="relative flex items-center">
                    <img src="/logo-proadesk.png" alt="Proadesk" className="h-60 w-auto" />
                </div>

                <div className="relative flex flex-col gap-8">
                    <div>
                        <h1 className="text-3xl font-semibold leading-tight">
                            Gestão de equipamentos escolares, sem planilha e sem papel.
                        </h1>
                        <p className="mt-3 text-sm text-slate-300">
                            Desenvolvido para o dia a dia do PROATI - controle de tablets, notebooks e Chromebooks,
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
                    Sistema desenvolvido para a rede estadual de ensino de São Paulo.
                </p>
            </div>

            <div className="relative flex items-center justify-center overflow-hidden bg-slate-50 p-6 tema-claro-forcado">
                <div className="pointer-events-none absolute left-[10%] top-[15%] h-72 w-72 rounded-full bg-linear-to-br from-brand-400/25 to-transparent blur-3xl" />
                <div className="pointer-events-none absolute bottom-[15%] right-[10%] h-72 w-72 rounded-full bg-linear-to-br from-emerald-400/25 to-transparent blur-3xl" />

                <Card className="relative w-full max-w-sm border-white/60 bg-white/70 shadow-2xl backdrop-blur-xl">
                    <CardHeader className="border-white/40">
                        <div className="mb-1 flex items-center lg:hidden">
                            <img src="/logo-proadesk.png" alt="Proadesk" className="h-10 w-auto" />
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
                            <FlowButton
                                type="submit"
                                disabled={enviando}
                                text={enviando ? 'Entrando...' : 'Entrar'}
                                className="mt-2"
                            />
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
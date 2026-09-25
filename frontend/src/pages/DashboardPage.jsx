import { Laptop, CheckCircle2, Wrench, XCircle, AlertTriangle } from 'lucide-react'
import { useDashboard } from '../hooks/useDashboard'
import { useAuth } from '../contexts/AuthContext'
import { useRevealOnData } from '../hooks/useRevealOnData'
import { StatCard } from '../components/ui/StatCard'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Spinner } from '../components/ui/Spinner'
import { formatarData } from '../utils/formatDate'
import { iniciaisDe, corDoAvatar } from '../utils/avatar'

export function DashboardPage() {
    const { data, isLoading, isError } = useDashboard()
    const { usuario } = useAuth()
    const statsRef = useRevealOnData(data)

    if (isLoading) return <Spinner />
    if (isError) return <p className="text-sm text-red-600">Não foi possível carregar o dashboard.</p>

    const { equipamentos, ultimosEmprestimos, ultimasDevolucoes, alertas } = data

    return (
        <div className="flex flex-col gap-6">
            <div>
                <div className="mb-1 flex items-center gap-2">
                    <span className="h-4 w-1 rounded-full bg-brand-500" />
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Bem-vindo(a), {usuario?.nome?.split(' ')[0] || usuario?.nome}!
                    </p>
                </div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Dashboard</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Visão geral do sistema</p>
            </div>

            <div ref={statsRef} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard label="Disponíveis" value={equipamentos.DISPONIVEL} icon={CheckCircle2} tone="success" />
                <StatCard label="Emprestados" value={equipamentos.EMPRESTADO} icon={Laptop} tone="brand" />
                <StatCard label="Em manutenção" value={equipamentos.MANUTENCAO} icon={Wrench} tone="warning" />
                <StatCard label="Inativos" value={equipamentos.INATIVO} icon={XCircle} tone="neutral" />
            </div>

            {alertas.totalAtrasados > 0 && (
                <Card className="border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                        <AlertTriangle className="h-5 w-5" />
                        <p className="text-sm font-medium">{alertas.totalAtrasados} empréstimo(s) com devolução atrasada</p>
                    </div>
                </Card>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Últimos empréstimos</h2>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        {ultimosEmprestimos.length === 0 && (
                            <p className="text-sm text-slate-500 dark:text-slate-400">Nenhum empréstimo registrado.</p>
                        )}
                        {ultimosEmprestimos.map((emprestimo) => {
                            const cor = corDoAvatar(emprestimo.professor.nome)
                            return (
                                <div key={emprestimo.id} className="flex items-center justify-between gap-3 text-sm">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${cor.bg} ${cor.text}`}>
                                            {iniciaisDe(emprestimo.professor.nome)}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-slate-900 dark:text-slate-100">{emprestimo.professor.nome}</p>
                                            <p className="text-slate-500 dark:text-slate-400">{formatarData(emprestimo.data)}</p>
                                        </div>
                                    </div>
                                    <Badge variant={emprestimo.status === 'ATIVO' ? 'info' : 'neutral'}>{emprestimo.status}</Badge>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Últimas devoluções</h2>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        {ultimasDevolucoes.length === 0 && (
                            <p className="text-sm text-slate-500 dark:text-slate-400">Nenhuma devolução registrada.</p>
                        )}
                        {ultimasDevolucoes.map((devolucao) => {
                            const patrimonio = devolucao.emprestimoItem.equipamento.numeroPatrimonio
                            const cor = corDoAvatar(patrimonio)
                            return (
                                <div key={devolucao.id} className="flex items-center justify-between gap-3 text-sm">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${cor.bg} ${cor.text}`}>
                                            {patrimonio.slice(0, 2).toUpperCase()}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-slate-900 dark:text-slate-100">{patrimonio}</p>
                                            <p className="text-slate-500 dark:text-slate-400">{formatarData(devolucao.data)}</p>
                                        </div>
                                    </div>
                                    <Badge variant={devolucao.conferencia === 'OK' ? 'success' : 'danger'}>
                                        {devolucao.conferencia === 'OK' ? 'OK' : 'Com problema'}
                                    </Badge>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
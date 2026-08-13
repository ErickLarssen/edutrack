import { Laptop, CheckCircle2, Wrench, XCircle, AlertTriangle } from 'lucide-react'
import { useDashboard } from '../hooks/useDashboard'
import { StatCard } from '../components/ui/StatCard'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { formatarData } from '../utils/formatDate'
import { useRevealOnData } from '../hooks/useRevealOnData'
import { Spinner } from '../components/ui/Spinner'

export function DashboardPage() {
    const { data, isLoading, isError } = useDashboard()
    const statsRef = useRevealOnData(data)

    if (isLoading) {
        return <Spinner />
    }

    if (isError) {
        return <p className="text-sm text-red-600">Não foi possível carregar o dashboard.</p>
    }

    const { equipamentos, ultimosEmprestimos, ultimasDevolucoes, alertas } = data

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-500">Visão geral do sistema</p>
            </div>

            <div ref={statsRef} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard label="Disponíveis" value={equipamentos.DISPONIVEL} icon={CheckCircle2} tone="success" />
                <StatCard label="Emprestados" value={equipamentos.EMPRESTADO} icon={Laptop} tone="brand" />
                <StatCard label="Em manutenção" value={equipamentos.MANUTENCAO} icon={Wrench} tone="warning" />
                <StatCard label="Inativos" value={equipamentos.INATIVO} icon={XCircle} tone="neutral" />
            </div>

            {alertas.totalAtrasados > 0 && (
                <Card className="border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-center gap-2 text-amber-800">
                        <AlertTriangle className="h-5 w-5" />
                        <p className="text-sm font-medium">{alertas.totalAtrasados} empréstimo(s) com devolução atrasada</p>
                    </div>
                </Card>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <h2 className="text-sm font-semibold text-slate-900">Últimos empréstimos</h2>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        {ultimosEmprestimos.length === 0 && (
                            <p className="text-sm text-slate-500">Nenhum empréstimo registrado.</p>
                        )}
                        {ultimosEmprestimos.map((emprestimo) => (
                            <div key={emprestimo.id} className="flex items-center justify-between text-sm">
                                <div>
                                    <p className="font-medium text-slate-900">{emprestimo.professor.nome}</p>
                                    <p className="text-slate-500">{formatarData(emprestimo.data)}</p>
                                </div>
                                <Badge variant={emprestimo.status === 'ATIVO' ? 'info' : 'neutral'}>{emprestimo.status}</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className="text-sm font-semibold text-slate-900">Últimas devoluções</h2>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        {ultimasDevolucoes.length === 0 && (
                            <p className="text-sm text-slate-500">Nenhuma devolução registrada.</p>
                        )}
                        {ultimasDevolucoes.map((devolucao) => (
                            <div key={devolucao.id} className="flex items-center justify-between text-sm">
                                <div>
                                    <p className="font-medium text-slate-900">
                                        {devolucao.emprestimoItem.equipamento.numeroPatrimonio}
                                    </p>
                                    <p className="text-slate-500">{formatarData(devolucao.data)}</p>
                                </div>
                                <Badge variant={devolucao.conferencia === 'OK' ? 'success' : 'danger'}>
                                    {devolucao.conferencia}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
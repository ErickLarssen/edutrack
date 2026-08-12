import { Clock } from 'lucide-react'
import { useEquipamentosMaisUtilizados, useEquipamentosMaisDanificados, useTempoMedioEmprestimo } from '../hooks/useRelatorios'
import { RankingList } from '../components/relatorios/RankingList'
import { StatCard } from '../components/ui/StatCard'

export function RelatoriosPage() {
    const { data: maisUtilizados, isLoading: carregandoUtilizados } = useEquipamentosMaisUtilizados()
    const { data: maisDanificados, isLoading: carregandoDanificados } = useEquipamentosMaisDanificados()
    const { data: tempoMedio, isLoading: carregandoTempo } = useTempoMedioEmprestimo()

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">Relatórios</h1>
                <p className="text-sm text-slate-500">Indicadores de uso do inventário</p>
            </div>

            {!carregandoTempo && tempoMedio && (
                <div className="sm:max-w-xs">
                    <StatCard
                        label={`Tempo médio de empréstimo (${tempoMedio.totalAmostras} amostra${tempoMedio.totalAmostras === 1 ? '' : 's'})`}
                        value={`${tempoMedio.mediaDias} dia(s)`}
                        icon={Clock}
                        tone="brand"
                    />
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                {carregandoUtilizados ? (
                    <p className="text-sm text-slate-500">Carregando...</p>
                ) : (
                    <RankingList
                        title="Equipamentos mais utilizados"
                        itens={maisUtilizados ?? []}
                        campoContagem="totalEmprestimos"
                        labelContagem="empréstimos"
                    />
                )}

                {carregandoDanificados ? (
                    <p className="text-sm text-slate-500">Carregando...</p>
                ) : (
                    <RankingList
                        title="Equipamentos mais danificados"
                        itens={maisDanificados ?? []}
                        campoContagem="totalDanos"
                        labelContagem="danos"
                    />
                )}
            </div>
        </div>
    )
}
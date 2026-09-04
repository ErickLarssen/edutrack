import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Printer, CheckCheck } from 'lucide-react'
import { useEquipamentos } from '../hooks/useEquipamentos'
import { useEquipamentoMutations } from '../hooks/useEquipamentoMutations'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { SearchInput } from '../components/ui/SearchInput'
import { Button } from '../components/ui/Button'
import { Pagination } from '../components/ui/Pagination'

export function EtiquetasPage() {
    const [apenasPendentes, setApenasPendentes] = useState(true)
    const [busca, setBusca] = useState('')
    const buscaComAtraso = useDebouncedValue(busca)
    const [pagina, setPagina] = useState(1)
    const [erro, setErro] = useState('')

    const { data, isLoading, isError } = useEquipamentos({
        semQrCode: apenasPendentes || undefined,
        busca: buscaComAtraso || undefined,
        pagina,
        limite: 30,
    })
    const { atualizar } = useEquipamentoMutations()

    useEffect(() => {
        setPagina(1)
    }, [apenasPendentes, buscaComAtraso])

    const marcarComoImpresso = async (equipamento) => {
        setErro('')
        try {
            await atualizar.mutateAsync({ id: equipamento.id, payload: { qrCode: equipamento.numeroPatrimonio } })
        } catch (error) {
            setErro(error.response?.data?.error?.message || 'Erro ao marcar etiqueta como impressa.')
        }
    }

    const marcarTodosExibidos = async () => {
        setErro('')
        const pendentesNaPagina = data?.dados.filter((eq) => !eq.qrCode) ?? []
        try {
            await Promise.all(
                pendentesNaPagina.map((eq) => atualizar.mutateAsync({ id: eq.id, payload: { qrCode: eq.numeroPatrimonio } }))
            )
        } catch (error) {
            setErro(error.response?.data?.error?.message || 'Erro ao marcar etiquetas como impressas.')
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Gerar Etiquetas</h1>
                    <p className="text-sm text-slate-500">QR Code + número de patrimônio, prontos para imprimir</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={marcarTodosExibidos} disabled={atualizar.isPending}>
                        <CheckCheck className="h-4 w-4" /> Marcar exibidos como impressos
                    </Button>
                    <Button onClick={() => window.print()}>
                        <Printer className="h-4 w-4" /> Imprimir
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 print:hidden">
                <SearchInput value={busca} onChange={setBusca} placeholder="Buscar por patrimônio..." />
                <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                        type="checkbox"
                        checked={apenasPendentes}
                        onChange={(e) => setApenasPendentes(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    Mostrar apenas pendentes (sem etiqueta gerada)
                </label>
            </div>

            {erro && <p className="text-sm text-red-600 print:hidden">{erro}</p>}
            {isLoading && <p className="text-sm text-slate-500 print:hidden">Carregando...</p>}
            {isError && <p className="text-sm text-red-600 print:hidden">Não foi possível carregar os equipamentos.</p>}
            {data && data.dados.length === 0 && (
                <p className="text-sm text-slate-500 print:hidden">Nenhum equipamento encontrado.</p>
            )}

            {data && data.dados.length > 0 && (
                <>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 print:grid-cols-3 print:gap-2">
                        {data.dados.map((equipamento) => (
                            <div
                                key={equipamento.id}
                                className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-slate-300 p-4 print:break-inside-avoid"
                            >
                                <QRCodeSVG value={equipamento.numeroPatrimonio} size={96} />
                                <span className="text-sm font-semibold text-slate-900">{equipamento.numeroPatrimonio}</span>
                                <span className="text-xs text-slate-500 print:hidden">
                                    {equipamento.qrCode ? 'Já impressa' : 'Pendente'}
                                </span>
                                {!equipamento.qrCode && (
                                    <button
                                        onClick={() => marcarComoImpresso(equipamento)}
                                        className="text-xs text-brand-600 hover:underline print:hidden"
                                    >
                                        Marcar como impressa
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="print:hidden">
                        <Pagination pagina={data.pagina} limite={data.limite} total={data.total} onChange={setPagina} />
                    </div>
                </>
            )}
        </div>
    )
}
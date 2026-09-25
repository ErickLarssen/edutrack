import { useState, useRef, useEffect } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { Check, AlertTriangle } from 'lucide-react'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { devolucaoService } from '../services/devolucaoService'
import { useDevolucaoMutations } from '../hooks/useDevolucaoMutations'

export function DevolucaoScannerPage() {
    const { registrar } = useDevolucaoMutations()
    const [manualInput, setManualInput] = useState('')
    const [itemAtual, setItemAtual] = useState(null)
    const [mostrarDano, setMostrarDano] = useState(false)
    const [danos, setDanos] = useState('')
    const [erro, setErro] = useState('')
    const [historico, setHistorico] = useState([])
    const fimHistoricoRef = useRef(null)

    useEffect(() => {
        fimHistoricoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, [historico.length])

    const buscarPatrimonio = async (valorBruto) => {
        const patrimonio = valorBruto.trim()
        if (!patrimonio) return
        setErro('')
        setMostrarDano(false)
        setDanos('')
        try {
            const item = await devolucaoService.buscarItemPorPatrimonio(patrimonio)
            setItemAtual(item)
        } catch (error) {
            setItemAtual(null)
            setErro(error.response?.data?.error?.message || `Patrimônio "${patrimonio}" não encontrado.`)
        }
    }

    const handleScan = (detectedCodes) => {
        const primeiro = detectedCodes?.[0]
        if (primeiro?.rawValue) buscarPatrimonio(primeiro.rawValue)
    }

    const handleManualSubmit = (event) => {
        event.preventDefault()
        buscarPatrimonio(manualInput)
        setManualInput('')
    }

    const confirmarDevolucao = async (conferencia) => {
        if (conferencia === 'COM_PROBLEMA' && !mostrarDano) {
            setMostrarDano(true)
            return
        }
        if (conferencia === 'COM_PROBLEMA' && !danos.trim()) {
            setErro('Descreva o dano antes de confirmar.')
            return
        }

        setErro('')
        try {
            await registrar.mutateAsync({
                emprestimoId: itemAtual.emprestimoId,
                itemId: itemAtual.id,
                payload: { conferencia, danos: conferencia === 'COM_PROBLEMA' ? danos : undefined },
            })
            setHistorico((atual) => [
                ...atual,
                { id: itemAtual.id, patrimonio: itemAtual.equipamento.numeroPatrimonio, resultado: conferencia },
            ])
            setItemAtual(null)
            setMostrarDano(false)
            setDanos('')
        } catch (error) {
            setErro(error.response?.data?.error?.message || 'Erro ao registrar devolução.')
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Devolver com QR Code</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Aponte a câmera para o equipamento sendo devolvido</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="overflow-hidden">
                    <div className="aspect-square w-full bg-slate-900">
                        <Scanner
                            onScan={handleScan}
                            onError={(error) => setErro(error?.message || 'Erro ao acessar a câmera.')}
                            formats={['qr_code']}
                            allowMultiple={false}
                            components={{ audio: true, finder: true, torch: true }}
                        />
                    </div>
                </Card>

                <div className="flex flex-col gap-4">
                    {itemAtual ? (
                        <Card className="border-brand-200 bg-brand-50 p-5">
                            <p className="text-xs font-medium uppercase tracking-wide text-brand-600">Equipamento encontrado</p>
                            <p className="mt-1 text-lg font-semibold text-slate-900">{itemAtual.equipamento.numeroPatrimonio}</p>
                            <p className="text-sm text-slate-600">{itemAtual.equipamento.marca} {itemAtual.equipamento.modelo}</p>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Prof. {itemAtual.emprestimo.professor.nome}
                                {itemAtual.emprestimo.turma && ` — Turma ${itemAtual.emprestimo.turma}`}
                            </p>

                            {!mostrarDano ? (
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <Button onClick={() => confirmarDevolucao('OK')} disabled={registrar.isPending} className="h-14 text-base">
                                        <Check className="h-5 w-5" /> OK
                                    </Button>
                                    <Button variant="danger" onClick={() => confirmarDevolucao('COM_PROBLEMA')} disabled={registrar.isPending} className="h-14 text-base">
                                        <AlertTriangle className="h-5 w-5" /> Com problema
                                    </Button>
                                </div>
                            ) : (
                                <div className="mt-4 flex flex-col gap-3">
                                    <Input label="Descreva o dano" value={danos} onChange={(e) => setDanos(e.target.value)} autoFocus />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button variant="secondary" onClick={() => setMostrarDano(false)} disabled={registrar.isPending}>Cancelar</Button>
                                        <Button variant="danger" onClick={() => confirmarDevolucao('COM_PROBLEMA')} disabled={registrar.isPending}>
                                            {registrar.isPending ? 'Registrando...' : 'Confirmar dano'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    ) : (
                        <form onSubmit={handleManualSubmit} className="flex gap-2">
                            <Input
                                placeholder="Ou digite o patrimônio manualmente"
                                value={manualInput}
                                onChange={(e) => setManualInput(e.target.value)}
                            />
                            <Button type="submit" variant="secondary">Buscar</Button>
                        </form>
                    )}

                    {erro && <p className="text-sm text-red-600">{erro}</p>}

                    <Card>
                        <CardHeader>
                            <h2 className="text-sm font-semibold text-slate-900">Devolvidos nesta sessão ({historico.length})</h2>
                        </CardHeader>
                        <CardContent className="flex max-h-72 flex-col gap-2 overflow-y-auto">
                            {historico.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">Nenhuma devolução registrada ainda.</p>}
                            {historico.map((registro, indice) => (
                                <div key={`${registro.id}-${indice}`} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
                                    <span className="font-medium text-slate-900">{registro.patrimonio}</span>
                                    <Badge variant={registro.resultado === 'OK' ? 'success' : 'danger'}>
                                        {registro.resultado === 'OK' ? 'OK' : 'Com problema'}
                                    </Badge>
                                </div>
                            ))}
                            <div ref={fimHistoricoRef} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
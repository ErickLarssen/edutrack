import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Scanner } from '@yudiel/react-qr-scanner'
import { X, Check } from 'lucide-react'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useProfessores } from '../hooks/useProfessores'
import { useEmprestimoMutations } from '../hooks/useEmprestimoMutations'
import { equipamentoService } from '../services/equipamentoService'
import { STATUS_EQUIPAMENTO } from '../utils/statusEquipamento'
import { limparPayload } from '../utils/limparPayload'
import { hojeLocal } from '../utils/hojeLocal'

export function EmprestimoScannerPage() {
    const navigate = useNavigate()
    const { data: professoresData } = useProfessores()
    const { criar } = useEmprestimoMutations()

    const [etapa, setEtapa] = useState('cabecalho')
    const [cabecalho, setCabecalho] = useState({
        professorId: '',
        data: hojeLocal(),
        hora: new Date().toTimeString().slice(0, 5),
        sala: '',
        turma: '',
        alunoResponsavel: '',
        previsaoDevolucao: '',
    })
    const [erroCabecalho, setErroCabecalho] = useState('')

    const [itensCarrinho, setItensCarrinho] = useState([])
    const [manualInput, setManualInput] = useState('')
    const [erroScan, setErroScan] = useState('')
    const [enviando, setEnviando] = useState(false)

    const iniciarScanner = (event) => {
        event.preventDefault()
        if (!cabecalho.professorId) {
            setErroCabecalho('Selecione um professor antes de começar.')
            return
        }
        setErroCabecalho('')
        setEtapa('scanner')
    }

    const adicionarPorPatrimonio = async (valorBruto) => {
        const patrimonio = valorBruto.trim()
        if (!patrimonio) return
        setErroScan('')

        if (itensCarrinho.some((item) => item.numeroPatrimonio === patrimonio)) {
            setErroScan(`${patrimonio} já está na lista.`)
            return
        }

        try {
            const equipamento = await equipamentoService.buscarPorPatrimonio(patrimonio)
            if (equipamento.status !== 'DISPONIVEL') {
                const statusLabel = STATUS_EQUIPAMENTO[equipamento.status]?.label ?? equipamento.status
                setErroScan(`${patrimonio} está "${statusLabel}", não disponível para empréstimo.`)
                return
            }
            setItensCarrinho((atual) => [...atual, equipamento])
        } catch (error) {
            setErroScan(error.response?.data?.error?.message || `Patrimônio "${patrimonio}" não encontrado.`)
        }
    }

    const handleScan = (detectedCodes) => {
        const primeiro = detectedCodes?.[0]
        if (primeiro?.rawValue) adicionarPorPatrimonio(primeiro.rawValue)
    }

    const handleManualSubmit = (event) => {
        event.preventDefault()
        adicionarPorPatrimonio(manualInput)
        setManualInput('')
    }

    const removerItem = (id) => {
        setItensCarrinho((atual) => atual.filter((item) => item.id !== id))
    }

    const handleConfirmar = async () => {
        setErroScan('')
        setEnviando(true)
        try {
            const payload = limparPayload({
                professorId: Number(cabecalho.professorId),
                equipamentoIds: itensCarrinho.map((item) => item.id),
                data: cabecalho.data,
                hora: cabecalho.hora,
                sala: cabecalho.sala,
                turma: cabecalho.turma,
                alunoResponsavel: cabecalho.alunoResponsavel,
            })

            if (cabecalho.previsaoDevolucao) {
                payload.previsaoDevolucao = `${cabecalho.data}T${cabecalho.previsaoDevolucao}:00-03:00`
            }

            await criar.mutateAsync(payload)
            navigate('/emprestimos')
        } catch (error) {
            setErroScan(error.response?.data?.error?.message || 'Erro ao registrar empréstimo.')
        } finally {
            setEnviando(false)
        }
    }

    if (etapa === 'cabecalho') {
        return (
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Registrar empréstimo com QR Code</h1>
                    <p className="text-sm text-slate-500">Preencha os dados da retirada antes de escanear os equipamentos</p>
                </div>

                <Card className="max-w-md">
                    <CardHeader>
                        <h2 className="text-sm font-semibold text-slate-900">Dados da retirada</h2>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={iniciarScanner} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-700">Professor</label>
                                <select
                                    className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    value={cabecalho.professorId}
                                    onChange={(e) => setCabecalho({ ...cabecalho, professorId: e.target.value })}
                                >
                                    <option value="">Selecione um professor</option>
                                    {professoresData?.dados.map((professor) => (
                                        <option key={professor.id} value={professor.id}>{professor.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    type="date"
                                    label="Data"
                                    value={cabecalho.data}
                                    onChange={(e) => setCabecalho({ ...cabecalho, data: e.target.value })}
                                />
                                <Input
                                    type="time"
                                    label="Hora"
                                    value={cabecalho.hora}
                                    onChange={(e) => setCabecalho({ ...cabecalho, hora: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Sala"
                                    value={cabecalho.sala}
                                    onChange={(e) => setCabecalho({ ...cabecalho, sala: e.target.value })}
                                />
                                <Input
                                    label="Turma"
                                    value={cabecalho.turma}
                                    onChange={(e) => setCabecalho({ ...cabecalho, turma: e.target.value })}
                                />
                            </div>
                            <Input
                                type="time"
                                label="Previsão de devolução (opcional)"
                                value={cabecalho.previsaoDevolucao}
                                onChange={(e) => setCabecalho({ ...cabecalho, previsaoDevolucao: e.target.value })}
                            />
                            {erroCabecalho && <p className="text-sm text-red-600">{erroCabecalho}</p>}
                            <Button type="submit">Iniciar leitura de QR Code</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Escaneando equipamentos</h1>
                    <p className="text-sm text-slate-500">Aponte a câmera para o QR Code de cada equipamento</p>
                </div>
                <Button variant="secondary" onClick={() => setEtapa('cabecalho')}>Voltar</Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="overflow-hidden">
                    <div className="aspect-square w-full bg-slate-900">
                        <Scanner
                            onScan={handleScan}
                            onError={(error) => setErroScan(error?.message || 'Erro ao acessar a câmera.')}
                            formats={['qr_code']}
                            allowMultiple={false}
                            components={{ audio: true, finder: true, torch: true }}
                        />
                    </div>
                </Card>

                <div className="flex flex-col gap-4">
                    <form onSubmit={handleManualSubmit} className="flex gap-2">
                        <Input
                            placeholder="Ou digite o patrimônio manualmente"
                            value={manualInput}
                            onChange={(e) => setManualInput(e.target.value)}
                        />
                        <Button type="submit" variant="secondary">Adicionar</Button>
                    </form>

                    {erroScan && <p className="text-sm text-red-600">{erroScan}</p>}

                    <Card>
                        <CardHeader>
                            <h2 className="text-sm font-semibold text-slate-900">
                                Equipamentos escaneados ({itensCarrinho.length})
                            </h2>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            {itensCarrinho.length === 0 && (
                                <p className="text-sm text-slate-500">Nenhum equipamento escaneado ainda.</p>
                            )}
                            {itensCarrinho.map((item) => (
                                <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
                                    <div>
                                        <p className="font-medium text-slate-900">{item.numeroPatrimonio}</p>
                                        <p className="text-slate-500">{item.marca} {item.modelo}</p>
                                    </div>
                                    <button onClick={() => removerItem(item.id)} className="text-slate-400 hover:text-red-600">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Button onClick={handleConfirmar} disabled={itensCarrinho.length === 0 || enviando}>
                        <Check className="h-4 w-4" />
                        {enviando ? 'Registrando...' : `Confirmar e registrar (${itensCarrinho.length})`}
                    </Button>
                </div>
            </div>
        </div>
    )
}
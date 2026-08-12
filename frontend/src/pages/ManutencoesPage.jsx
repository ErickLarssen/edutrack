import { useState } from 'react'
import { Plus, Pencil, Play, CheckCircle2 } from 'lucide-react'
import { useManutencoes } from '../hooks/useManutencoes'
import { useManutencaoMutations } from '../hooks/useManutencaoMutations'
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../components/ui/Table'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { ManutencaoForm } from '../components/manutencoes/ManutencaoForm'
import { STATUS_MANUTENCAO, PRIORIDADE_MANUTENCAO, TRANSICOES_VALIDAS } from '../utils/statusManutencao'
import { formatarData } from '../utils/formatDate'

export function ManutencoesPage() {
    const [modalAberto, setModalAberto] = useState(false)
    const [manutencaoEditando, setManutencaoEditando] = useState(null)
    const [erro, setErro] = useState('')

    const { data, isLoading, isError } = useManutencoes()
    const { criar, atualizar, atualizarStatus } = useManutencaoMutations()

    const abrirCriacao = () => {
        setManutencaoEditando(null)
        setModalAberto(true)
    }

    const abrirEdicao = (manutencao) => {
        setManutencaoEditando(manutencao)
        setModalAberto(true)
    }

    const handleSubmit = async (payload) => {
        setErro('')
        try {
            if (manutencaoEditando) {
                await atualizar.mutateAsync({ id: manutencaoEditando.id, payload })
            } else {
                await criar.mutateAsync(payload)
            }
            setModalAberto(false)
        } catch (error) {
            setErro(error.response?.data?.error?.message || 'Erro ao salvar manutenção.')
        }
    }

    const handleTransicao = async (manutencao, novoStatus) => {
        setErro('')
        try {
            await atualizarStatus.mutateAsync({ id: manutencao.id, status: novoStatus })
        } catch (error) {
            setErro(error.response?.data?.error?.message || 'Erro ao atualizar status.')
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Manutenção</h1>
                    <p className="text-sm text-slate-500">Ocorrências e reparos de equipamentos</p>
                </div>
                <Button onClick={abrirCriacao}>
                    <Plus className="h-4 w-4" /> Nova manutenção
                </Button>
            </div>

            {erro && <p className="text-sm text-red-600">{erro}</p>}
            {isLoading && <p className="text-sm text-slate-500">Carregando...</p>}
            {isError && <p className="text-sm text-red-600">Não foi possível carregar as manutenções.</p>}

            {data && (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>Equipamento</TableHeaderCell>
                            <TableHeaderCell>Problema</TableHeaderCell>
                            <TableHeaderCell>Prioridade</TableHeaderCell>
                            <TableHeaderCell>Registrada em</TableHeaderCell>
                            <TableHeaderCell>Status</TableHeaderCell>
                            <TableHeaderCell className="text-right">Ações</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.dados.map((manutencao) => (
                            <TableRow key={manutencao.id}>
                                <TableCell>{manutencao.equipamento.numeroPatrimonio}</TableCell>
                                <TableCell>{manutencao.problema}</TableCell>
                                <TableCell>
                                    <Badge variant={PRIORIDADE_MANUTENCAO[manutencao.prioridade].variant}>
                                        {PRIORIDADE_MANUTENCAO[manutencao.prioridade].label}
                                    </Badge>
                                </TableCell>
                                <TableCell>{formatarData(manutencao.dataRegistro)}</TableCell>
                                <TableCell>
                                    <Badge variant={STATUS_MANUTENCAO[manutencao.status].variant}>
                                        {STATUS_MANUTENCAO[manutencao.status].label}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {manutencao.status !== 'CONCLUIDA' && (
                                            <button onClick={() => abrirEdicao(manutencao)} className="text-slate-400 hover:text-brand-600">
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                        )}
                                        {TRANSICOES_VALIDAS[manutencao.status].includes('EM_ANDAMENTO') && (
                                            <button
                                                title="Iniciar"
                                                onClick={() => handleTransicao(manutencao, 'EM_ANDAMENTO')}
                                                className="text-slate-400 hover:text-blue-600"
                                            >
                                                <Play className="h-4 w-4" />
                                            </button>
                                        )}
                                        {TRANSICOES_VALIDAS[manutencao.status].includes('CONCLUIDA') && (
                                            <button
                                                title="Concluir"
                                                onClick={() => handleTransicao(manutencao, 'CONCLUIDA')}
                                                className="text-slate-400 hover:text-green-600"
                                            >
                                                <CheckCircle2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Modal
                aberto={modalAberto}
                onFechar={() => setModalAberto(false)}
                title={manutencaoEditando ? 'Editar manutenção' : 'Nova manutenção'}
            >
                <ManutencaoForm
                    manutencao={manutencaoEditando}
                    onSubmit={handleSubmit}
                    enviando={criar.isPending || atualizar.isPending}
                />
            </Modal>
        </div>
    )
}
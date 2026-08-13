import { useState } from 'react'
import { Plus, Pencil, Ban, RotateCcw } from 'lucide-react'
import { useEquipamentos } from '../hooks/useEquipamentos'
import { useEquipamentoMutations } from '../hooks/useEquipamentoMutations'
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../components/ui/Table'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EquipamentoForm } from '../components/equipamentos/EquipamentoForm'
import { STATUS_EQUIPAMENTO, TIPO_EQUIPAMENTO } from '../utils/statusEquipamento'
import { Spinner } from '../components/ui/Spinner'

export function EquipamentosPage() {
    const [modalAberto, setModalAberto] = useState(false)
    const [equipamentoEditando, setEquipamentoEditando] = useState(null)
    const [equipamentoParaInativar, setEquipamentoParaInativar] = useState(null)
    const [erro, setErro] = useState('')

    const { data, isLoading, isError } = useEquipamentos()
    const { criar, atualizar, inativar, reativar } = useEquipamentoMutations()

    const abrirCriacao = () => {
        setEquipamentoEditando(null)
        setModalAberto(true)
    }

    const abrirEdicao = (equipamento) => {
        setEquipamentoEditando(equipamento)
        setModalAberto(true)
    }

    const handleSubmit = async (payload) => {
        setErro('')
        try {
            if (equipamentoEditando) {
                await atualizar.mutateAsync({ id: equipamentoEditando.id, payload })
            } else {
                await criar.mutateAsync(payload)
            }
            setModalAberto(false)
        } catch (error) {
            setErro(error.response?.data?.error?.message || 'Erro ao salvar equipamento.')
        }
    }

    const handleConfirmarInativacao = async () => {
        try {
            await inativar.mutateAsync(equipamentoParaInativar.id)
            setEquipamentoParaInativar(null)
        } catch (error) {
            setErro(error.response?.data?.error?.message || 'Erro ao inativar equipamento.')
            setEquipamentoParaInativar(null)
        }
    }

    const handleReativar = async (equipamento) => {
        try {
            await reativar.mutateAsync(equipamento.id)
        } catch (error) {
            setErro(error.response?.data?.error?.message || 'Erro ao reativar equipamento.')
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Equipamentos</h1>
                    <p className="text-sm text-slate-500">Tablets, notebooks e Chromebooks do inventário</p>
                </div>
                <Button onClick={abrirCriacao}>
                    <Plus className="h-4 w-4" /> Novo equipamento
                </Button>
            </div>

            {erro && <p className="text-sm text-red-600">{erro}</p>}
            {isLoading && <Spinner />}
            {isError && <p className="text-sm text-red-600">Não foi possível carregar os equipamentos.</p>}

            {data && (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>Patrimônio</TableHeaderCell>
                            <TableHeaderCell>Marca / Modelo</TableHeaderCell>
                            <TableHeaderCell>Tipo</TableHeaderCell>
                            <TableHeaderCell>Status</TableHeaderCell>
                            <TableHeaderCell>Localização</TableHeaderCell>
                            <TableHeaderCell className="text-right">Ações</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.dados.map((equipamento) => (
                            <TableRow key={equipamento.id}>
                                <TableCell>{equipamento.numeroPatrimonio}</TableCell>
                                <TableCell>{equipamento.marca} {equipamento.modelo}</TableCell>
                                <TableCell>{TIPO_EQUIPAMENTO[equipamento.tipo]}</TableCell>
                                <TableCell>
                                    <Badge variant={STATUS_EQUIPAMENTO[equipamento.status].variant}>
                                        {STATUS_EQUIPAMENTO[equipamento.status].label}
                                    </Badge>
                                </TableCell>
                                <TableCell>{equipamento.localizacao || '—'}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => abrirEdicao(equipamento)} className="text-slate-400 hover:text-brand-600">
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        {equipamento.status === 'INATIVO' ? (
                                            <button onClick={() => handleReativar(equipamento)} className="text-slate-400 hover:text-green-600">
                                                <RotateCcw className="h-4 w-4" />
                                            </button>
                                        ) : (
                                            <button onClick={() => setEquipamentoParaInativar(equipamento)} className="text-slate-400 hover:text-red-600">
                                                <Ban className="h-4 w-4" />
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
                title={equipamentoEditando ? 'Editar equipamento' : 'Novo equipamento'}
            >
                <EquipamentoForm
                    equipamento={equipamentoEditando}
                    onSubmit={handleSubmit}
                    enviando={criar.isPending || atualizar.isPending}
                />
            </Modal>

            <ConfirmDialog
                aberto={!!equipamentoParaInativar}
                onFechar={() => setEquipamentoParaInativar(null)}
                onConfirmar={handleConfirmarInativacao}
                titulo="Inativar equipamento"
                descricao={`Tem certeza que deseja inativar o equipamento ${equipamentoParaInativar?.numeroPatrimonio}?`}
                confirmando={inativar.isPending}
            />
        </div>
    )
}
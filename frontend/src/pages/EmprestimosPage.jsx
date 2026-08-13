import { useState } from 'react'
import { Plus, Eye, Pencil } from 'lucide-react'
import { useEmprestimos } from '../hooks/useEmprestimos'
import { useEmprestimoMutations } from '../hooks/useEmprestimoMutations'
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../components/ui/Table'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { EmprestimoForm } from '../components/emprestimos/EmprestimoForm'
import { EmprestimoDetalhes } from '../components/emprestimos/EmprestimoDetalhes'
import { STATUS_EMPRESTIMO } from '../utils/statusEmprestimo'
import { formatarData } from '../utils/formatDate'
import { limparPayload } from '../utils/limparPayload'
import { Spinner } from '../components/ui/Spinner'

export function EmprestimosPage() {
    const [modalAberto, setModalAberto] = useState(false)
    const [emprestimoEditandoId, setEmprestimoEditandoId] = useState(null)
    const [emprestimoDetalhadoId, setEmprestimoDetalhadoId] = useState(null)
    const [erro, setErro] = useState('')

    const { data, isLoading, isError } = useEmprestimos()
    const { criar, atualizar } = useEmprestimoMutations()

    const abrirCriacao = () => {
        setEmprestimoEditandoId(null)
        setModalAberto(true)
    }

    const abrirEdicao = (emprestimo) => {
        setEmprestimoEditandoId(emprestimo.id)
        setModalAberto(true)
    }

    const handleSubmit = async (payload) => {
        setErro('')
        const payloadLimpo = limparPayload(payload)
        try {
            if (emprestimoEditandoId) {
                +        await atualizar.mutateAsync({ id: emprestimoEditandoId, payload: payloadLimpo })
            } else {
                await criar.mutateAsync(payloadLimpo)
            }
            setModalAberto(false)
        } catch (error) {
            setErro(error.response?.data?.error?.message || 'Erro ao salvar empréstimo.')
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Empréstimos</h1>
                    <p className="text-sm text-slate-500">Registro de retirada de equipamentos</p>
                </div>
                <Button onClick={abrirCriacao}>
                    <Plus className="h-4 w-4" /> Novo empréstimo
                </Button>
            </div>

            {erro && <p className="text-sm text-red-600">{erro}</p>}
            {isLoading && <Spinner />}
            {isError && <p className="text-sm text-red-600">Não foi possível carregar os empréstimos.</p>}

            {data && (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>Professor</TableHeaderCell>
                            <TableHeaderCell>Data</TableHeaderCell>
                            <TableHeaderCell>Sala / Turma</TableHeaderCell>
                            <TableHeaderCell>Itens</TableHeaderCell>
                            <TableHeaderCell>Status</TableHeaderCell>
                            <TableHeaderCell className="text-right">Ações</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.dados.map((emprestimo) => (
                            <TableRow key={emprestimo.id}>
                                <TableCell>{emprestimo.professor.nome}</TableCell>
                                <TableCell>{formatarData(emprestimo.data)}</TableCell>
                                <TableCell>{[emprestimo.sala, emprestimo.turma].filter(Boolean).join(' / ') || '—'}</TableCell>
                                <TableCell>{emprestimo.itens.length}</TableCell>
                                <TableCell>
                                    <Badge variant={STATUS_EMPRESTIMO[emprestimo.status].variant}>
                                        {STATUS_EMPRESTIMO[emprestimo.status].label}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => setEmprestimoDetalhadoId(emprestimo.id)} className="text-slate-400 hover:text-brand-600">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => abrirEdicao(emprestimo)} className="text-slate-400 hover:text-brand-600">
                                            <Pencil className="h-4 w-4" />
                                        </button>
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
                title={emprestimoEditandoId ? 'Editar empréstimo' : 'Novo empréstimo'}
            >
                <EmprestimoForm
                    emprestimoId={emprestimoEditandoId}
                    onSubmit={handleSubmit}
                    enviando={criar.isPending || atualizar.isPending}
                />
            </Modal>

            <Modal aberto={!!emprestimoDetalhadoId} onFechar={() => setEmprestimoDetalhadoId(null)} title="Detalhes do empréstimo">
                {emprestimoDetalhadoId && <EmprestimoDetalhes id={emprestimoDetalhadoId} />}
            </Modal>
        </div>
    )
}
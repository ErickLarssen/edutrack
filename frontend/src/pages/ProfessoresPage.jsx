import { useState } from 'react'
import { Plus, Pencil, Ban, RotateCcw } from 'lucide-react'
import { useProfessores } from '../hooks/useProfessores'
import { useProfessorMutations } from '../hooks/useProfessorMutations'
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../components/ui/Table'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { ProfessorForm } from '../components/professores/ProfessorForm'
import { Spinner } from '../components/ui/Spinner'

export function ProfessoresPage() {
    const [incluirInativos, setIncluirInativos] = useState(false)
    const [modalAberto, setModalAberto] = useState(false)
    const [professorEditando, setProfessorEditando] = useState(null)
    const [professorParaInativar, setProfessorParaInativar] = useState(null)
    const [erro, setErro] = useState('')

    const { data, isLoading, isError } = useProfessores({ incluirInativos })
    const { criar, atualizar, inativar, reativar } = useProfessorMutations()

    const abrirCriacao = () => {
        setProfessorEditando(null)
        setModalAberto(true)
    }

    const abrirEdicao = (professor) => {
        setProfessorEditando(professor)
        setModalAberto(true)
    }

    const handleSubmit = async (payload) => {
        setErro('')
        try {
            if (professorEditando) {
                await atualizar.mutateAsync({ id: professorEditando.id, payload })
            } else {
                await criar.mutateAsync(payload)
            }
            setModalAberto(false)
        } catch (error) {
            setErro(error.response?.data?.error?.message || 'Erro ao salvar professor.')
        }
    }

    const handleConfirmarInativacao = async () => {
        try {
            await inativar.mutateAsync(professorParaInativar.id)
            setProfessorParaInativar(null)
        } catch (error) {
            setErro(error.response?.data?.error?.message || 'Erro ao inativar professor.')
            setProfessorParaInativar(null)
        }
    }

    const handleReativar = async (professor) => {
        try {
            await reativar.mutateAsync(professor.id)
        } catch (error) {
            setErro(error.response?.data?.error?.message || 'Erro ao reativar professor.')
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Professores</h1>
                    <p className="text-sm text-slate-500">Cadastro de professores da escola</p>
                </div>
                <Button onClick={abrirCriacao}>
                    <Plus className="h-4 w-4" /> Novo professor
                </Button>
            </div>

            <label className="flex w-fit items-center gap-2 text-sm text-slate-600">
                <input
                    type="checkbox"
                    checked={incluirInativos}
                    onChange={(e) => setIncluirInativos(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                Mostrar inativos
            </label>

            {erro && <p className="text-sm text-red-600">{erro}</p>}
            {isLoading && <Spinner />}
            {isError && <p className="text-sm text-red-600">Não foi possível carregar os professores.</p>}

            {data && (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>Nome</TableHeaderCell>
                            <TableHeaderCell>Disciplina</TableHeaderCell>
                            <TableHeaderCell>Contato</TableHeaderCell>
                            <TableHeaderCell>Período</TableHeaderCell>
                            <TableHeaderCell>Status</TableHeaderCell>
                            <TableHeaderCell className="text-right">Ações</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.dados.map((professor) => (
                            <TableRow key={professor.id}>
                                <TableCell>{professor.nome}</TableCell>
                                <TableCell>{professor.disciplina}</TableCell>
                                <TableCell>{professor.contato || '—'}</TableCell>
                                <TableCell>{professor.periodo || '—'}</TableCell>
                                <TableCell>
                                    <Badge variant={professor.ativo ? 'success' : 'neutral'}>
                                        {professor.ativo ? 'Ativo' : 'Inativo'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => abrirEdicao(professor)} className="text-slate-400 hover:text-brand-600">
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        {professor.ativo ? (
                                            <button onClick={() => setProfessorParaInativar(professor)} className="text-slate-400 hover:text-red-600">
                                                <Ban className="h-4 w-4" />
                                            </button>
                                        ) : (
                                            <button onClick={() => handleReativar(professor)} className="text-slate-400 hover:text-green-600">
                                                <RotateCcw className="h-4 w-4" />
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
                title={professorEditando ? 'Editar professor' : 'Novo professor'}
            >
                <ProfessorForm
                    professor={professorEditando}
                    onSubmit={handleSubmit}
                    enviando={criar.isPending || atualizar.isPending}
                />
            </Modal>

            <ConfirmDialog
                aberto={!!professorParaInativar}
                onFechar={() => setProfessorParaInativar(null)}
                onConfirmar={handleConfirmarInativacao}
                titulo="Inativar professor"
                descricao={`Tem certeza que deseja inativar ${professorParaInativar?.nome}?`}
                confirmando={inativar.isPending}
            />
        </div>
    )
}
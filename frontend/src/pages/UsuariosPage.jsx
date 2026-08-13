import { useState } from 'react'
import { Plus, Pencil, Ban, RotateCcw } from 'lucide-react'
import { useUsuarios } from '../hooks/useUsuarios'
import { useUsuarioMutations } from '../hooks/useUsuarioMutations'
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../components/ui/Table'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { UsuarioForm } from '../components/usuarios/UsuarioForm'
import { ROLE_LABELS } from '../utils/role'
import { limparPayload } from '../utils/limparPayload'
import { useAuth } from '../contexts/AuthContext'
import { Spinner } from '../components/ui/Spinner'

export function UsuariosPage() {
    const { usuario: usuarioLogado } = useAuth()
    const [incluirInativos, setIncluirInativos] = useState(false)
    const [modalAberto, setModalAberto] = useState(false)
    const [usuarioEditando, setUsuarioEditando] = useState(null)
    const [usuarioParaInativar, setUsuarioParaInativar] = useState(null)
    const [erro, setErro] = useState('')

    const { data, isLoading, isError } = useUsuarios({ incluirInativos })
    const { criar, atualizar, inativar, reativar } = useUsuarioMutations()

    const abrirCriacao = () => {
        setUsuarioEditando(null)
        setModalAberto(true)
    }

    const abrirEdicao = (usuario) => {
        setUsuarioEditando(usuario)
        setModalAberto(true)
    }

    const handleSubmit = async (payload) => {
        setErro('')
        const payloadLimpo = limparPayload(payload)
        try {
            if (usuarioEditando) {
                await atualizar.mutateAsync({ id: usuarioEditando.id, payload: payloadLimpo })
            } else {
                await criar.mutateAsync(payloadLimpo)
            }
            setModalAberto(false)
        } catch (error) {
            setErro(error.response?.data?.error?.message || 'Erro ao salvar usuário.')
        }
    }

    const handleConfirmarInativacao = async () => {
        try {
            await inativar.mutateAsync(usuarioParaInativar.id)
            setUsuarioParaInativar(null)
        } catch (error) {
            setErro(error.response?.data?.error?.message || 'Erro ao inativar usuário.')
            setUsuarioParaInativar(null)
        }
    }

    const handleReativar = async (usuario) => {
        try {
            await reativar.mutateAsync(usuario.id)
        } catch (error) {
            setErro(error.response?.data?.error?.message || 'Erro ao reativar usuário.')
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Usuários</h1>
                    <p className="text-sm text-slate-500">Contas de acesso ao sistema</p>
                </div>
                <Button onClick={abrirCriacao}>
                    <Plus className="h-4 w-4" /> Novo usuário
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
            {isError && <p className="text-sm text-red-600">Não foi possível carregar os usuários.</p>}

            {data && (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>Nome</TableHeaderCell>
                            <TableHeaderCell>Email</TableHeaderCell>
                            <TableHeaderCell>Papel</TableHeaderCell>
                            <TableHeaderCell>Status</TableHeaderCell>
                            <TableHeaderCell className="text-right">Ações</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.dados.map((usuario) => {
                            const ehVoce = usuario.id === usuarioLogado.id
                            return (
                                <TableRow key={usuario.id}>
                                    <TableCell>
                                        {usuario.nome} {ehVoce && <span className="text-xs text-slate-400">(você)</span>}
                                    </TableCell>
                                    <TableCell>{usuario.email}</TableCell>
                                    <TableCell>{ROLE_LABELS[usuario.role]}</TableCell>
                                    <TableCell>
                                        <Badge variant={usuario.ativo ? 'success' : 'neutral'}>
                                            {usuario.ativo ? 'Ativo' : 'Inativo'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => abrirEdicao(usuario)} className="text-slate-400 hover:text-brand-600">
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            {!ehVoce &&
                                                (usuario.ativo ? (
                                                    <button onClick={() => setUsuarioParaInativar(usuario)} className="text-slate-400 hover:text-red-600">
                                                        <Ban className="h-4 w-4" />
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleReativar(usuario)} className="text-slate-400 hover:text-green-600">
                                                        <RotateCcw className="h-4 w-4" />
                                                    </button>
                                                ))}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            )}

            <Modal aberto={modalAberto} onFechar={() => setModalAberto(false)} title={usuarioEditando ? 'Editar usuário' : 'Novo usuário'}>
                <UsuarioForm usuario={usuarioEditando} onSubmit={handleSubmit} enviando={criar.isPending || atualizar.isPending} />
            </Modal>

            <ConfirmDialog
                aberto={!!usuarioParaInativar}
                onFechar={() => setUsuarioParaInativar(null)}
                onConfirmar={handleConfirmarInativacao}
                titulo="Inativar usuário"
                descricao={`Tem certeza que deseja inativar ${usuarioParaInativar?.nome}?`}
                confirmando={inativar.isPending}
            />
        </div>
    )
}
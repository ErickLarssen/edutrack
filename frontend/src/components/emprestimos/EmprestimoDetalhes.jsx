import { useState } from 'react'
import { useEmprestimo } from '../../hooks/useEmprestimo'
import { useDevolucaoMutations } from '../../hooks/useDevolucaoMutations'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { DevolucaoForm } from '../devolucoes/DevolucaoForm'
import { formatarData } from '../../utils/formatDate'

export function EmprestimoDetalhes({ id }) {
    const { data: emprestimo, isLoading, isError } = useEmprestimo(id)
    const { registrar } = useDevolucaoMutations()
    const [itemDevolvendo, setItemDevolvendo] = useState(null)
    const [erro, setErro] = useState('')

    if (isLoading) return <p className="text-sm text-slate-500">Carregando...</p>
    if (isError || !emprestimo) return <p className="text-sm text-red-600">Não foi possível carregar os detalhes.</p>

    const handleDevolucao = async (payload) => {
        setErro('')
        try {
            await registrar.mutateAsync({ emprestimoId: id, itemId: itemDevolvendo.id, payload })
            setItemDevolvendo(null)
        } catch (error) {
            setErro(error.response?.data?.error?.message || 'Erro ao registrar devolução.')
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-slate-500">Professor:</span> <span className="font-medium text-slate-900">{emprestimo.professor.nome}</span></div>
                <div><span className="text-slate-500">Registrado por:</span> <span className="font-medium text-slate-900">{emprestimo.usuario.nome}</span></div>
                <div><span className="text-slate-500">Data:</span> <span className="font-medium text-slate-900">{formatarData(emprestimo.data)}</span></div>
                <div><span className="text-slate-500">Hora:</span> <span className="font-medium text-slate-900">{emprestimo.hora}</span></div>
            </div>

            {erro && <p className="text-sm text-red-600">{erro}</p>}

            <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-900">Equipamentos</h3>
                <div className="flex flex-col gap-2">
                    {emprestimo.itens.map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
                            <div>
                                <p className="font-medium text-slate-900">{item.equipamento.numeroPatrimonio}</p>
                                <p className="text-slate-500">{item.equipamento.marca} {item.equipamento.modelo}</p>
                            </div>
                            {item.devolucao ? (
                                <Badge variant={item.devolucao.conferencia === 'OK' ? 'success' : 'danger'}>
                                    Devolvido — {item.devolucao.conferencia === 'OK' ? 'OK' : 'Com problema'}
                                </Badge>
                            ) : (
                                <Button size="sm" variant="secondary" onClick={() => setItemDevolvendo(item)}>
                                    Devolver
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <Modal aberto={!!itemDevolvendo} onFechar={() => setItemDevolvendo(null)} title="Registrar devolução">
                {itemDevolvendo && (
                    <DevolucaoForm item={itemDevolvendo} onSubmit={handleDevolucao} enviando={registrar.isPending} />
                )}
            </Modal>
        </div>
    )
}
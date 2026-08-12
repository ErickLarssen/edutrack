import { useEmprestimo } from '../../hooks/useEmprestimo'
import { Badge } from '../ui/Badge'
import { formatarData } from '../../utils/formatDate'

export function EmprestimoDetalhes({ id }) {
    const { data: emprestimo, isLoading, isError } = useEmprestimo(id)

    if (isLoading) return <p className="text-sm text-slate-500">Carregando...</p>
    if (isError || !emprestimo) return <p className="text-sm text-red-600">Não foi possível carregar os detalhes.</p>

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-slate-500">Professor:</span> <span className="font-medium text-slate-900">{emprestimo.professor.nome}</span></div>
                <div><span className="text-slate-500">Registrado por:</span> <span className="font-medium text-slate-900">{emprestimo.usuario.nome}</span></div>
                <div><span className="text-slate-500">Data:</span> <span className="font-medium text-slate-900">{formatarData(emprestimo.data)}</span></div>
                <div><span className="text-slate-500">Hora:</span> <span className="font-medium text-slate-900">{emprestimo.hora}</span></div>
            </div>

            <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-900">Equipamentos</h3>
                <div className="flex flex-col gap-2">
                    {emprestimo.itens.map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
                            <div>
                                <p className="font-medium text-slate-900">{item.equipamento.numeroPatrimonio}</p>
                                <p className="text-slate-500">{item.equipamento.marca} {item.equipamento.modelo}</p>
                            </div>
                            <Badge variant={item.devolucao ? 'success' : 'warning'}>
                                {item.devolucao ? 'Devolvido' : 'Pendente'}
                            </Badge>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
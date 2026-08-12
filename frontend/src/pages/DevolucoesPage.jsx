import { useDevolucoes } from '../hooks/useDevolucoes'
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../components/ui/Table'
import { Badge } from '../components/ui/Badge'
import { formatarData } from '../utils/formatDate'

export function DevolucoesPage() {
    const { data, isLoading, isError } = useDevolucoes()

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">Devoluções</h1>
                <p className="text-sm text-slate-500">Histórico de devoluções registradas</p>
            </div>

            {isLoading && <p className="text-sm text-slate-500">Carregando...</p>}
            {isError && <p className="text-sm text-red-600">Não foi possível carregar as devoluções.</p>}

            {data && (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>Equipamento</TableHeaderCell>
                            <TableHeaderCell>Professor</TableHeaderCell>
                            <TableHeaderCell>Data</TableHeaderCell>
                            <TableHeaderCell>Conferência</TableHeaderCell>
                            <TableHeaderCell>Registrado por</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.dados.map((devolucao) => (
                            <TableRow key={devolucao.id}>
                                <TableCell>{devolucao.emprestimoItem.equipamento.numeroPatrimonio}</TableCell>
                                <TableCell>{devolucao.emprestimoItem.emprestimo.professor.nome}</TableCell>
                                <TableCell>{formatarData(devolucao.data)}</TableCell>
                                <TableCell>
                                    <Badge variant={devolucao.conferencia === 'OK' ? 'success' : 'danger'}>
                                        {devolucao.conferencia === 'OK' ? 'OK' : 'Com problema'}
                                    </Badge>
                                </TableCell>
                                <TableCell>{devolucao.usuario.nome}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}
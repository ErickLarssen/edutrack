import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScanLine } from 'lucide-react'
import { useDevolucoes } from '../hooks/useDevolucoes'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { SearchInput } from '../components/ui/SearchInput'
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../components/ui/Table'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Pagination } from '../components/ui/Pagination'
import { Spinner } from '../components/ui/Spinner'
import { formatarData } from '../utils/formatDate'

export function DevolucoesPage() {
    const navigate = useNavigate()
    const [pagina, setPagina] = useState(1)
    const [busca, setBusca] = useState('')
    const buscaComAtraso = useDebouncedValue(busca) 
    const { data, isLoading, isError } = useDevolucoes({ pagina, busca: buscaComAtraso || undefined })

    useEffect(() => {
        setPagina(1)
    }, [buscaComAtraso])

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Devoluções</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Histórico de devoluções registradas</p>
            </div>

            <Button variant="secondary" className="w-fit" onClick={() => navigate('/devolucoes/scanner')}>
                <ScanLine className="h-4 w-4" /> Devolver com QR Code
            </Button>

            <SearchInput value={busca} onChange={setBusca} placeholder="Buscar por patrimônio..." />

            {isLoading && <Spinner />}
            {isError && <p className="text-sm text-red-600">Não foi possível carregar as devoluções.</p>}

            {data && (
                <>
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
                    <Pagination pagina={data.pagina} limite={data.limite} total={data.total} onChange={setPagina} />
                </>
            )}
        </div>
    )
}
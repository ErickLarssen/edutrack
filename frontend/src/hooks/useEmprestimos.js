import { useQuery } from '@tanstack/react-query'
import { emprestimoService } from '../services/emprestimoService'

export function useEmprestimos(filtros) {
    return useQuery({
        queryKey: ['emprestimos', filtros],
        queryFn: () => emprestimoService.listar(filtros),
    })
}
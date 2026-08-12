import { useQuery } from '@tanstack/react-query'
import { emprestimoService } from '../services/emprestimoService'

export function useEmprestimo(id) {
    return useQuery({
        queryKey: ['emprestimo', id],
        queryFn: () => emprestimoService.buscarPorId(id),
        enabled: !!id,
    })
}
import { useQuery } from '@tanstack/react-query'
import { devolucaoService } from '../services/devolucaoService'

export function useDevolucoes(filtros) {
    return useQuery({
        queryKey: ['devolucoes', filtros],
        queryFn: () => devolucaoService.listar(filtros),
    })
}
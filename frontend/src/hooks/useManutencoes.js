import { useQuery } from '@tanstack/react-query'
import { manutencaoService } from '../services/manutencaoService'

export function useManutencoes(filtros) {
    return useQuery({
        queryKey: ['manutencoes', filtros],
        queryFn: () => manutencaoService.listar(filtros),
    })
}
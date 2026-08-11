import { useQuery } from '@tanstack/react-query'
import { professorService } from '../services/professorService'

export function useProfessores(filtros) {
    return useQuery({
        queryKey: ['professores', filtros],
        queryFn: () => professorService.listar(filtros),
    })
}
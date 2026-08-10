import { useQuery } from '@tanstack/react-query'
import { equipamentoService } from '../services/equipamentoService'

export function useEquipamentos(filtros) {
    return useQuery({
        queryKey: ['equipamentos', filtros],
        queryFn: () => equipamentoService.listar(filtros),
    })
}
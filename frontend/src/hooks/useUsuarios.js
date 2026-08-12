import { useQuery } from '@tanstack/react-query'
import { usuarioService } from '../services/usuarioService'

export function useUsuarios(filtros) {
    return useQuery({
        queryKey: ['usuarios', filtros],
        queryFn: () => usuarioService.listar(filtros),
    })
}
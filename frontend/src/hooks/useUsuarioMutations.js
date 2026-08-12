import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usuarioService } from '../services/usuarioService'

export function useUsuarioMutations() {
    const queryClient = useQueryClient()
    const invalidar = () => queryClient.invalidateQueries({ queryKey: ['usuarios'] })

    const criar = useMutation({ mutationFn: usuarioService.criar, onSuccess: invalidar })
    const atualizar = useMutation({
        mutationFn: ({ id, payload }) => usuarioService.atualizar(id, payload),
        onSuccess: invalidar,
    })
    const inativar = useMutation({ mutationFn: usuarioService.inativar, onSuccess: invalidar })
    const reativar = useMutation({ mutationFn: usuarioService.reativar, onSuccess: invalidar })

    return { criar, atualizar, inativar, reativar }
}
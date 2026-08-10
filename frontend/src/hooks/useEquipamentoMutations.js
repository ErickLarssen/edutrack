import { useMutation, useQueryClient } from '@tanstack/react-query'
import { equipamentoService } from '../services/equipamentoService'

export function useEquipamentoMutations() {
    const queryClient = useQueryClient()
    const invalidar = () => queryClient.invalidateQueries({ queryKey: ['equipamentos'] })

    const criar = useMutation({ mutationFn: equipamentoService.criar, onSuccess: invalidar })
    const atualizar = useMutation({
        mutationFn: ({ id, payload }) => equipamentoService.atualizar(id, payload),
        onSuccess: invalidar,
    })
    const inativar = useMutation({ mutationFn: equipamentoService.inativar, onSuccess: invalidar })
    const reativar = useMutation({ mutationFn: equipamentoService.reativar, onSuccess: invalidar })

    return { criar, atualizar, inativar, reativar }
}
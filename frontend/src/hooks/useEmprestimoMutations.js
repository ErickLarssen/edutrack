import { useMutation, useQueryClient } from '@tanstack/react-query'
import { emprestimoService } from '../services/emprestimoService'

export function useEmprestimoMutations() {
    const queryClient = useQueryClient()
    const invalidar = () => {
        queryClient.invalidateQueries({ queryKey: ['emprestimos'] })
        queryClient.invalidateQueries({ queryKey: ['equipamentos'] })
    }

    const criar = useMutation({ mutationFn: emprestimoService.criar, onSuccess: invalidar })
    const atualizar = useMutation({
        mutationFn: ({ id, payload }) => emprestimoService.atualizar(id, payload),
        onSuccess: (_, variables) => {
            invalidar()
            queryClient.invalidateQueries({ queryKey: ['emprestimo', variables.id] })
        },
    })

    return { criar, atualizar }
}
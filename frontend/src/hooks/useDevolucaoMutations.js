import { useMutation, useQueryClient } from '@tanstack/react-query'
import { devolucaoService } from '../services/devolucaoService'

export function useDevolucaoMutations() {
    const queryClient = useQueryClient()

    const registrar = useMutation({
        mutationFn: ({ emprestimoId, itemId, payload }) => devolucaoService.registrar(emprestimoId, itemId, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['emprestimo', variables.emprestimoId] })
            queryClient.invalidateQueries({ queryKey: ['emprestimos'] })
            queryClient.invalidateQueries({ queryKey: ['equipamentos'] })
            queryClient.invalidateQueries({ queryKey: ['devolucoes'] })
        },
    })

    return { registrar }
}
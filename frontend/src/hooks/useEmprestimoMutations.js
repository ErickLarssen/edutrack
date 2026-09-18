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

    const adicionarItens = useMutation({
        mutationFn: ({ id, equipamentoIds }) => emprestimoService.adicionarItens(id, equipamentoIds),
        onSuccess: (_, variables) => {
            invalidar()
            queryClient.invalidateQueries({ queryKey: ['emprestimo', variables.id] })
            queryClient.invalidateQueries({ queryKey: ['equipamentos'] })
        },
    })

    return { criar, atualizar, adicionarItens }
}
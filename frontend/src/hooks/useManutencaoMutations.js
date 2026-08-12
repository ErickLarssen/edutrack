import { useMutation, useQueryClient } from '@tanstack/react-query'
import { manutencaoService } from '../services/manutencaoService'

export function useManutencaoMutations() {
    const queryClient = useQueryClient()
    const invalidar = () => {
        queryClient.invalidateQueries({ queryKey: ['manutencoes'] })
        queryClient.invalidateQueries({ queryKey: ['equipamentos'] })
    }

    const criar = useMutation({ mutationFn: manutencaoService.criar, onSuccess: invalidar })
    const atualizar = useMutation({
        mutationFn: ({ id, payload }) => manutencaoService.atualizar(id, payload),
        onSuccess: invalidar,
    })
    const atualizarStatus = useMutation({
        mutationFn: ({ id, status }) => manutencaoService.atualizarStatus(id, status),
        onSuccess: invalidar,
    })

    return { criar, atualizar, atualizarStatus }
}
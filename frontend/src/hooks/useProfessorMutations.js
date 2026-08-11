import { useMutation, useQueryClient } from '@tanstack/react-query'
import { professorService } from '../services/professorService'

export function useProfessorMutations() {
    const queryClient = useQueryClient()
    const invalidar = () => queryClient.invalidateQueries({ queryKey: ['professores'] })

    const criar = useMutation({ mutationFn: professorService.criar, onSuccess: invalidar })
    const atualizar = useMutation({
        mutationFn: ({ id, payload }) => professorService.atualizar(id, payload),
        onSuccess: invalidar,
    })
    const inativar = useMutation({ mutationFn: professorService.inativar, onSuccess: invalidar })
    const reativar = useMutation({ mutationFn: professorService.reativar, onSuccess: invalidar })

    return { criar, atualizar, inativar, reativar }
}
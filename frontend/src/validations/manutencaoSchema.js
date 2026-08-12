import { z } from 'zod'

export const criarManutencaoSchema = z.object({
    equipamentoId: z.coerce.number().positive('Selecione um equipamento'),
    problema: z.string().min(1, 'Problema é obrigatório'),
    descricao: z.string().optional(),
    prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA']),
})

export const atualizarManutencaoSchema = z.object({
    problema: z.string().min(1, 'Problema é obrigatório').optional(),
    descricao: z.string().optional(),
    prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA']).optional(),
})
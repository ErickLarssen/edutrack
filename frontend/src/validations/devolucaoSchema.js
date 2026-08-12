import { z } from 'zod'

export const devolucaoSchema = z
    .object({
        conferencia: z.enum(['OK', 'COM_PROBLEMA']),
        danos: z.string().optional(),
        observacoes: z.string().optional(),
    })
    .refine((dados) => dados.conferencia !== 'COM_PROBLEMA' || Boolean(dados.danos?.trim()), {
        message: 'Descreva os danos quando a conferência indicar problema',
        path: ['danos'],
    })
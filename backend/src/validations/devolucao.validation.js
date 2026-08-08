const { z } = require('zod');

const registrarDevolucaoSchema = z.object({
    params: z.object({
        emprestimoId: z.coerce.number().int().positive('ID de empréstimo inválido'),
        itemId: z.coerce.number().int().positive('ID de item inválido'),
    }),
    body: z
        .object({
            data: z.coerce.date({ message: 'Data inválida' }),
            hora: z.string().min(1, 'Hora é obrigatória'),
            conferencia: z.enum(['OK', 'COM_PROBLEMA'], { message: 'Conferência deve ser OK ou COM_PROBLEMA' }),
            danos: z.string().optional(),
            fotos: z.array(z.string().url('URL de foto inválida')).optional(),
            observacoes: z.string().optional(),
        })
        .refine((dados) => dados.conferencia !== 'COM_PROBLEMA' || Boolean(dados.danos?.trim()), {
            message: 'Descreva os danos quando a conferência indicar problema',
            path: ['danos'],
        }),
});

const listarDevolucoesSchema = z.object({
    query: z.object({
        conferencia: z.enum(['OK', 'COM_PROBLEMA']).optional(),
        pagina: z.coerce.number().int().positive().optional(),
        limite: z.coerce.number().int().positive().max(100).optional(),
    }),
});

module.exports = { registrarDevolucaoSchema, listarDevolucoesSchema };
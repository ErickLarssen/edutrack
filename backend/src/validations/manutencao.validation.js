const { z } = require('zod');

const criarManutencaoSchema = z.object({
    body: z.object({
        equipamentoId: z.coerce.number().int().positive('Equipamento é obrigatório'),
        problema: z.string().min(1, 'Problema é obrigatório'),
        descricao: z.string().optional(),
        prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA']).optional(),
        fotos: z.array(z.string().url('URL de foto inválida')).optional(),
    }),
});

const atualizarManutencaoSchema = z.object({
    params: z.object({ id: z.coerce.number().int().positive('ID inválido') }),
    body: z.object({
        problema: z.string().min(1).optional(),
        descricao: z.string().optional(),
        prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA']).optional(),
        fotos: z.array(z.string().url('URL de foto inválida')).optional(),
    }),
});

const atualizarStatusSchema = z.object({
    params: z.object({ id: z.coerce.number().int().positive('ID inválido') }),
    body: z.object({
        status: z.enum(['ABERTA', 'EM_ANDAMENTO', 'CONCLUIDA'], { message: 'Status inválido' }),
    }),
});

const idParamSchema = z.object({
    params: z.object({ id: z.coerce.number().int().positive('ID inválido') }),
});

const listarManutencoesSchema = z.object({
    query: z.object({
        status: z.enum(['ABERTA', 'EM_ANDAMENTO', 'CONCLUIDA']).optional(),
        prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA']).optional(),
        equipamentoId: z.coerce.number().int().positive().optional(),
        pagina: z.coerce.number().int().positive().optional(),
        limite: z.coerce.number().int().positive().max(100).optional(),
    }),
});

module.exports = {
    criarManutencaoSchema,
    atualizarManutencaoSchema,
    atualizarStatusSchema,
    idParamSchema,
    listarManutencoesSchema,
};
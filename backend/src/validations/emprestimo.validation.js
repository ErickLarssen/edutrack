const { z } = require('zod');

const criarEmprestimoSchema = z.object({
    body: z.object({
        professorId: z.coerce.number().int().positive('Professor é obrigatório'),
        equipamentoIds: z
            .array(z.coerce.number().int().positive())
            .min(1, 'Selecione pelo menos um equipamento'),
        data: z.coerce.date({ message: 'Data inválida' }),
        hora: z.string().min(1, 'Hora é obrigatória'),
        sala: z.string().optional(),
        turma: z.string().optional(),
        alunoResponsavel: z.string().optional(),
        previsaoDevolucao: z.coerce.date().optional(),
        observacoes: z.string().optional(),
    }),
});

const atualizarEmprestimoSchema = z.object({
    params: z.object({ id: z.coerce.number().int().positive('ID inválido') }),
    body: z.object({
        sala: z.string().optional(),
        turma: z.string().optional(),
        alunoResponsavel: z.string().optional(),
        previsaoDevolucao: z.coerce.date().optional(),
        observacoes: z.string().optional(),
    }),
});

const idParamSchema = z.object({
    params: z.object({ id: z.coerce.number().int().positive('ID inválido') }),
});

const listarEmprestimosSchema = z.object({
    query: z.object({
        status: z.enum(['ATIVO', 'FINALIZADO']).optional(),
        professorId: z.coerce.number().int().positive().optional(),
        pagina: z.coerce.number().int().positive().optional(),
        limite: z.coerce.number().int().positive().max(100).optional(),
    }),
});

module.exports = { criarEmprestimoSchema, atualizarEmprestimoSchema, idParamSchema, listarEmprestimosSchema };
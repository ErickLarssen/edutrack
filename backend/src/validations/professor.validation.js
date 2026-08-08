const { z } = require('zod');

const dadosBase = {
    nome: z.string().min(1, 'Nome é obrigatório'),
    disciplina: z.string().min(1, 'Disciplina é obrigatória'),
    contato: z.string().optional(),
    periodo: z.string().optional(),
    observacoes: z.string().optional(),
};

const criarProfessorSchema = z.object({
    body: z.object(dadosBase),
});

const atualizarProfessorSchema = z.object({
    params: z.object({ id: z.coerce.number().int().positive('ID inválido') }),
    body: z.object(
        Object.fromEntries(
            Object.entries(dadosBase).map(([chave, validador]) => [chave, validador.optional()])
        )
    ),
});

const idParamSchema = z.object({
    params: z.object({ id: z.coerce.number().int().positive('ID inválido') }),
});

const listarProfessoresSchema = z.object({
    query: z.object({
        busca: z.string().optional(),
        incluirInativos: z.coerce.boolean().optional(),
        pagina: z.coerce.number().int().positive().optional(),
        limite: z.coerce.number().int().positive().max(100).optional(),
    }),
});

module.exports = { criarProfessorSchema, atualizarProfessorSchema, idParamSchema, listarProfessoresSchema };
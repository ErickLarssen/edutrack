const { z } = require('zod');
const { booleanoDeQuery } = require('./shared');

const ROLES = ['ADMIN', 'COORDENADOR', 'DIRETOR', 'ESTAGIARIO'];

const criarUsuarioSchema = z.object({
    body: z.object({
        nome: z.string().min(1, 'Nome é obrigatório'),
        email: z.string().email('Email inválido'),
        senha: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
        role: z.enum(ROLES, { message: `Role deve ser um de: ${ROLES.join(', ')}` }),
    }),
});

const atualizarUsuarioSchema = z.object({
    params: z.object({ id: z.coerce.number().int().positive('ID inválido') }),
    body: z.object({
        nome: z.string().min(1).optional(),
        email: z.string().email('Email inválido').optional(),
        senha: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres').optional(),
        role: z.enum(ROLES).optional(),
    }),
});

const idParamSchema = z.object({
    params: z.object({ id: z.coerce.number().int().positive('ID inválido') }),
});

const listarUsuariosSchema = z.object({
    query: z.object({
        role: z.enum(ROLES).optional(),
        busca: z.string().optional(),
        incluirInativos: booleanoDeQuery.optional(),
        pagina: z.coerce.number().int().positive().optional(),
        limite: z.coerce.number().int().positive().max(100).optional(),
    }),
});

module.exports = { criarUsuarioSchema, atualizarUsuarioSchema, idParamSchema, listarUsuariosSchema };
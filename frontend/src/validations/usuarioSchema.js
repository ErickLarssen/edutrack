import { z } from 'zod'
import { ROLES } from '../utils/role'

export const criarUsuarioSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    senha: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
    role: z.enum(ROLES, { message: 'Selecione um papel' }),
})

export const atualizarUsuarioSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório').optional(),
    email: z.string().email('Email inválido').optional(),
    senha: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres').optional().or(z.literal('')),
    role: z.enum(ROLES).optional(),
})
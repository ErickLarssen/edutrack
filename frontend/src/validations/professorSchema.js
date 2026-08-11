import { z } from 'zod'

export const professorSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    disciplina: z.string().min(1, 'Disciplina é obrigatória'),
    contato: z.string().optional(),
    periodo: z.string().optional(),
    observacoes: z.string().optional(),
})
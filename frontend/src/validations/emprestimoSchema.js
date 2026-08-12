import { z } from 'zod'

export const criarEmprestimoSchema = z.object({
    professorId: z.coerce.number().positive('Selecione um professor'),
    equipamentoIds: z.array(z.number()).min(1, 'Selecione pelo menos um equipamento'),
    data: z.string().min(1, 'Data é obrigatória'),
    hora: z.string().min(1, 'Hora é obrigatória'),
    sala: z.string().optional(),
    turma: z.string().optional(),
    alunoResponsavel: z.string().optional(),
    previsaoDevolucao: z.string().optional(),
    observacoes: z.string().optional(),
})

export const atualizarEmprestimoSchema = z.object({
    sala: z.string().optional(),
    turma: z.string().optional(),
    alunoResponsavel: z.string().optional(),
    previsaoDevolucao: z.string().optional(),
    observacoes: z.string().optional(),
})
import { z } from 'zod'

export const equipamentoSchema = z.object({
    numeroPatrimonio: z.string().min(1, 'Número de patrimônio é obrigatório'),
    numeroSerie: z.string().min(1, 'Número de série é obrigatório'),
    marca: z.string().min(1, 'Marca é obrigatória'),
    modelo: z.string().min(1, 'Modelo é obrigatório'),
    tipo: z.enum(['TABLET', 'NOTEBOOK', 'CHROMEBOOK'], { message: 'Selecione um tipo' }),
    localizacao: z.string().optional(),
    observacoes: z.string().optional(),
})
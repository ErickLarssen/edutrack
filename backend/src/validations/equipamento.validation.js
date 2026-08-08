const { z } = require('zod');

const TIPOS = ['TABLET', 'NOTEBOOK', 'CHROMEBOOK'];
const STATUS = ['DISPONIVEL', 'EMPRESTADO', 'MANUTENCAO', 'INATIVO'];

const dadosBase = {
    numeroPatrimonio: z.string().min(1, 'Número de patrimônio é obrigatório'),
    numeroSerie: z.string().min(1, 'Número de série é obrigatório'),
    marca: z.string().min(1, 'Marca é obrigatória'),
    modelo: z.string().min(1, 'Modelo é obrigatório'),
    tipo: z.enum(TIPOS, { message: `Tipo deve ser um de: ${TIPOS.join(', ')}` }),
    fotoUrl: z.string().url('URL de foto inválida').optional(),
    qrCode: z.string().optional(),
    localizacao: z.string().optional(),
    observacoes: z.string().optional(),
};

const criarEquipamentoSchema = z.object({
    body: z.object(dadosBase),
});

const atualizarEquipamentoSchema = z.object({
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

const listarEquipamentosSchema = z.object({
    query: z.object({
        status: z.enum(STATUS).optional(),
        tipo: z.enum(TIPOS).optional(),
        busca: z.string().optional(),
        pagina: z.coerce.number().int().positive().optional(),
        limite: z.coerce.number().int().positive().max(100).optional(),
    }),
});

module.exports = { criarEquipamentoSchema, atualizarEquipamentoSchema, idParamSchema, listarEquipamentosSchema };
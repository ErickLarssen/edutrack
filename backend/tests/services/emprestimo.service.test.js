const emprestimoService = require('../../src/services/emprestimo.service');
const emprestimoRepository = require('../../src/repositories/emprestimo.repository');
const equipamentoRepository = require('../../src/repositories/equipamento.repository');
const professorRepository = require('../../src/repositories/professor.repository');

jest.mock('../../src/repositories/emprestimo.repository');
jest.mock('../../src/repositories/equipamento.repository');
jest.mock('../../src/repositories/professor.repository');

describe('emprestimo.service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const dadosBase = {
        professorId: 1,
        equipamentoIds: [10, 20],
        data: new Date('2026-08-13'),
        hora: '14:00',
    };

    it('rejeita quando a lista tem equipamentos duplicados', async () => {
        await expect(
            emprestimoService.criar({ ...dadosBase, equipamentoIds: [10, 10] }, 99)
        ).rejects.toThrow('A lista contém equipamentos duplicados');
    });

    it('rejeita quando o professor não existe ou está inativo', async () => {
        professorRepository.buscarPorId.mockResolvedValue({ id: 1, ativo: false });

        await expect(emprestimoService.criar(dadosBase, 99)).rejects.toThrow('Professor não encontrado ou inativo');
    });

    it('rejeita quando algum equipamento está indisponível', async () => {
        professorRepository.buscarPorId.mockResolvedValue({ id: 1, ativo: true });
        equipamentoRepository.buscarPorIds.mockResolvedValue([
            { id: 10, numeroPatrimonio: 'PAT-010', status: 'DISPONIVEL' },
            { id: 20, numeroPatrimonio: 'PAT-020', status: 'MANUTENCAO' },
        ]);

        await expect(emprestimoService.criar(dadosBase, 99)).rejects.toThrow('PAT-020 (MANUTENCAO)');
    });

    it('cria o empréstimo quando professor e equipamentos são válidos', async () => {
        professorRepository.buscarPorId.mockResolvedValue({ id: 1, ativo: true });
        equipamentoRepository.buscarPorIds.mockResolvedValue([
            { id: 10, numeroPatrimonio: 'PAT-010', status: 'DISPONIVEL' },
            { id: 20, numeroPatrimonio: 'PAT-020', status: 'DISPONIVEL' },
        ]);
        emprestimoRepository.criarComItens.mockResolvedValue({ id: 1 });

        const resultado = await emprestimoService.criar(dadosBase, 99);

        expect(emprestimoRepository.criarComItens).toHaveBeenCalledWith({
            dadosEmprestimo: { professorId: 1, data: dadosBase.data, hora: '14:00', usuarioId: 99 },
            equipamentoIds: [10, 20],
        });
        expect(resultado).toEqual({ id: 1 });
    });
});
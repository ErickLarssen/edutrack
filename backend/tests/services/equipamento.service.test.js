const equipamentoService = require('../../src/services/equipamento.service');
const equipamentoRepository = require('../../src/repositories/equipamento.repository');

jest.mock('../../src/repositories/equipamento.repository');

describe('equipamento.service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('criar', () => {
        it('cria o equipamento quando patrimônio e série são únicos', async () => {
            equipamentoRepository.buscarPorPatrimonio.mockResolvedValue(null);
            equipamentoRepository.buscarPorSerie.mockResolvedValue(null);
            equipamentoRepository.criar.mockResolvedValue({ id: 1, numeroPatrimonio: 'PAT-001' });

            const resultado = await equipamentoService.criar({ numeroPatrimonio: 'PAT-001', numeroSerie: 'SN-001' });

            expect(equipamentoRepository.criar).toHaveBeenCalledWith({
                numeroPatrimonio: 'PAT-001',
                numeroSerie: 'SN-001',
            });
            expect(resultado.id).toBe(1);
        });

        it('rejeita quando já existe equipamento com o mesmo patrimônio', async () => {
            equipamentoRepository.buscarPorPatrimonio.mockResolvedValue({ id: 99 });

            await expect(
                equipamentoService.criar({ numeroPatrimonio: 'PAT-001', numeroSerie: 'SN-001' })
            ).rejects.toThrow('Já existe um equipamento com esse número de patrimônio');

            expect(equipamentoRepository.criar).not.toHaveBeenCalled();
        });

        it('rejeita quando já existe equipamento com o mesmo número de série', async () => {
            equipamentoRepository.buscarPorPatrimonio.mockResolvedValue(null);
            equipamentoRepository.buscarPorSerie.mockResolvedValue({ id: 99 });

            await expect(
                equipamentoService.criar({ numeroPatrimonio: 'PAT-002', numeroSerie: 'SN-001' })
            ).rejects.toThrow('Já existe um equipamento com esse número de série');
        });
    });

    describe('inativar', () => {
        it('bloqueia a inativação de um equipamento emprestado', async () => {
            equipamentoRepository.buscarPorId.mockResolvedValue({ id: 1, status: 'EMPRESTADO' });

            await expect(equipamentoService.inativar(1)).rejects.toThrow(
                'Não é possível inativar um equipamento que está emprestado'
            );
            expect(equipamentoRepository.inativar).not.toHaveBeenCalled();
        });

        it('permite inativar um equipamento disponível', async () => {
            equipamentoRepository.buscarPorId.mockResolvedValue({ id: 1, status: 'DISPONIVEL' });
            equipamentoRepository.inativar.mockResolvedValue({ id: 1, status: 'INATIVO' });

            const resultado = await equipamentoService.inativar(1);

            expect(equipamentoRepository.inativar).toHaveBeenCalledWith(1);
            expect(resultado.status).toBe('INATIVO');
        });
    });
});
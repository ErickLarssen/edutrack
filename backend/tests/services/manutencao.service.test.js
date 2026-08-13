const manutencaoService = require('../../src/services/manutencao.service');
const manutencaoRepository = require('../../src/repositories/manutencao.repository');

jest.mock('../../src/repositories/manutencao.repository');

describe('manutencao.service — máquina de estados', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('permite transição de ABERTA para EM_ANDAMENTO', async () => {
        manutencaoRepository.buscarPorId.mockResolvedValue({ id: 1, status: 'ABERTA', equipamentoId: 5 });
        manutencaoRepository.atualizarStatusSimples.mockResolvedValue({ id: 1, status: 'EM_ANDAMENTO' });

        const resultado = await manutencaoService.atualizarStatus(1, 'EM_ANDAMENTO');

        expect(manutencaoRepository.atualizarStatusSimples).toHaveBeenCalledWith(1, 'EM_ANDAMENTO');
        expect(resultado.status).toBe('EM_ANDAMENTO');
    });

    it('bloqueia transição de EM_ANDAMENTO de volta para ABERTA', async () => {
        manutencaoRepository.buscarPorId.mockResolvedValue({ id: 1, status: 'EM_ANDAMENTO', equipamentoId: 5 });

        await expect(manutencaoService.atualizarStatus(1, 'ABERTA')).rejects.toThrow(
            'Não é possível mudar de EM_ANDAMENTO para ABERTA'
        );
    });

    it('bloqueia qualquer transição a partir de CONCLUIDA', async () => {
        manutencaoRepository.buscarPorId.mockResolvedValue({ id: 1, status: 'CONCLUIDA', equipamentoId: 5 });

        await expect(manutencaoService.atualizarStatus(1, 'EM_ANDAMENTO')).rejects.toThrow(
            'Não é possível mudar de CONCLUIDA para EM_ANDAMENTO'
        );
    });

    it('ao concluir, aciona o efeito colateral que libera o equipamento', async () => {
        manutencaoRepository.buscarPorId.mockResolvedValue({ id: 1, status: 'ABERTA', equipamentoId: 5 });
        manutencaoRepository.concluirComEfeito.mockResolvedValue({ id: 1, status: 'CONCLUIDA' });

        await manutencaoService.atualizarStatus(1, 'CONCLUIDA');

        expect(manutencaoRepository.concluirComEfeito).toHaveBeenCalledWith(1, 5);
    });
});
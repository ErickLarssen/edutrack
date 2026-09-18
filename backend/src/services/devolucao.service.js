const AppError = require('../utils/AppError');
const devolucaoRepository = require('../repositories/devolucao.repository');
const emprestimoRepository = require('../repositories/emprestimo.repository');
const equipamentoRepository = require('../repositories/equipamento.repository');

const registrar = async (emprestimoId, itemId, dados, usuarioId) => {
    const item = await emprestimoRepository.buscarItemPorId(itemId);

    if (!item || item.emprestimoId !== emprestimoId) {
        throw new AppError('Item de empréstimo não encontrado', 404);
    }

    if (item.devolucao) {
        throw new AppError('Este item já foi devolvido', 409);
    }

    return devolucaoRepository.criarComEfeitos({
        emprestimoItemId: itemId,
        equipamentoId: item.equipamentoId,
        emprestimoId,
        dadosDevolucao: { ...dados, usuarioId },
        criarManutencao: dados.conferencia === 'COM_PROBLEMA',
    });
};

const listar = (filtros) => devolucaoRepository.listar(filtros);

const buscarItemPorPatrimonio = async (numeroPatrimonio) => {
    const equipamento = await equipamentoRepository.buscarPorPatrimonio(numeroPatrimonio);
    if (!equipamento) {
        throw new AppError('Equipamento não encontrado para esse patrimônio', 404);
    }
    if (equipamento.status !== 'EMPRESTADO') {
        throw new AppError(`Equipamento não está emprestado no momento (status: ${equipamento.status})`, 409);
    }

    const item = await emprestimoRepository.buscarItemAtivoPorEquipamentoId(equipamento.id);
    if (!item) {
        throw new AppError('Não foi encontrado um empréstimo ativo para esse equipamento', 404);
    }
    return item;
};

module.exports = { registrar, listar, buscarItemPorPatrimonio };
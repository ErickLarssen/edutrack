const AppError = require('../utils/AppError');
const devolucaoRepository = require('../repositories/devolucao.repository');
const emprestimoRepository = require('../repositories/emprestimo.repository');

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

module.exports = { registrar, listar };
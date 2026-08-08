const AppError = require('../utils/AppError');
const manutencaoRepository = require('../repositories/manutencao.repository');
const equipamentoRepository = require('../repositories/equipamento.repository');

const TRANSICOES_VALIDAS = {
    ABERTA: ['EM_ANDAMENTO', 'CONCLUIDA'],
    EM_ANDAMENTO: ['CONCLUIDA'],
    CONCLUIDA: [],
};

const criar = async (dados, usuarioId) => {
    const equipamento = await equipamentoRepository.buscarPorId(dados.equipamentoId);

    if (!equipamento) {
        throw new AppError('Equipamento não encontrado', 404);
    }

    if (equipamento.status !== 'DISPONIVEL') {
        throw new AppError(`Não é possível abrir manutenção: equipamento está ${equipamento.status}`, 409);
    }

    return manutencaoRepository.criarComEfeito({ ...dados, registradoPor: usuarioId });
};

const listar = (filtros) => manutencaoRepository.listar(filtros);

const buscarPorId = async (id) => {
    const manutencao = await manutencaoRepository.buscarPorId(id);
    if (!manutencao) {
        throw new AppError('Manutenção não encontrada', 404);
    }
    return manutencao;
};

const atualizar = async (id, dados) => {
    const manutencao = await buscarPorId(id);

    if (manutencao.status === 'CONCLUIDA') {
        throw new AppError('Não é possível editar uma manutenção já concluída', 409);
    }

    return manutencaoRepository.atualizar(id, dados);
};

const atualizarStatus = async (id, novoStatus) => {
    const manutencao = await buscarPorId(id);

    const transicoesPermitidas = TRANSICOES_VALIDAS[manutencao.status];
    if (!transicoesPermitidas.includes(novoStatus)) {
        throw new AppError(`Não é possível mudar de ${manutencao.status} para ${novoStatus}`, 409);
    }

    if (novoStatus === 'CONCLUIDA') {
        return manutencaoRepository.concluirComEfeito(id, manutencao.equipamentoId);
    }

    return manutencaoRepository.atualizarStatusSimples(id, novoStatus);
};

module.exports = { criar, listar, buscarPorId, atualizar, atualizarStatus };
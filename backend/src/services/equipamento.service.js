const AppError = require('../utils/AppError');
const equipamentoRepository = require('../repositories/equipamento.repository');

const criar = async (dados) => {
    const patrimonioExistente = await equipamentoRepository.buscarPorPatrimonio(dados.numeroPatrimonio);
    if (patrimonioExistente) {
        throw new AppError('Já existe um equipamento com esse número de patrimônio', 409);
    }

    const serieExistente = await equipamentoRepository.buscarPorSerie(dados.numeroSerie);
    if (serieExistente) {
        throw new AppError('Já existe um equipamento com esse número de série', 409);
    }

    return equipamentoRepository.criar(dados);
};

const listar = (filtros) => equipamentoRepository.listar(filtros);

const buscarPorId = async (id) => {
    const equipamento = await equipamentoRepository.buscarPorId(id);
    if (!equipamento) {
        throw new AppError('Equipamento não encontrado', 404);
    }
    return equipamento;
};

const atualizar = async (id, dados) => {
    await buscarPorId(id);

    if (dados.numeroPatrimonio) {
        const patrimonioExistente = await equipamentoRepository.buscarPorPatrimonio(dados.numeroPatrimonio, id);
        if (patrimonioExistente) {
            throw new AppError('Já existe um equipamento com esse número de patrimônio', 409);
        }
    }

    if (dados.numeroSerie) {
        const serieExistente = await equipamentoRepository.buscarPorSerie(dados.numeroSerie, id);
        if (serieExistente) {
            throw new AppError('Já existe um equipamento com esse número de série', 409);
        }
    }

    return equipamentoRepository.atualizar(id, dados);
};

const inativar = async (id) => {
    const equipamento = await buscarPorId(id);

    if (equipamento.status === 'EMPRESTADO') {
        throw new AppError('Não é possível inativar um equipamento que está emprestado', 409);
    }

    return equipamentoRepository.inativar(id);
};

const reativar = async (id) => {
    const equipamento = await buscarPorId(id);

    if (equipamento.status !== 'INATIVO') {
        throw new AppError('Somente equipamentos inativos podem ser reativados', 409);
    }

    return equipamentoRepository.reativar(id);
};

module.exports = { criar, listar, buscarPorId, atualizar, inativar, reativar };
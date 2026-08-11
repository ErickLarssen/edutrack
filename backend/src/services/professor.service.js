const AppError = require('../utils/AppError');
const professorRepository = require('../repositories/professor.repository');

const criar = (dados) => professorRepository.criar(dados);

const listar = (filtros) => professorRepository.listar(filtros);

const buscarPorId = async (id) => {
    const professor = await professorRepository.buscarPorId(id);
    if (!professor) {
        throw new AppError('Professor não encontrado', 404);
    }
    return professor;
};

const atualizar = async (id, dados) => {
    await buscarPorId(id);
    return professorRepository.atualizar(id, dados);
};

const inativar = async (id) => {
    await buscarPorId(id);
    return professorRepository.inativar(id);
};

const reativar = async (id) => {
    const professor = await buscarPorId(id);
    if (professor.ativo) {
        throw new AppError('Professor já está ativo', 409);
    }
    return professorRepository.reativar(id);
};

module.exports = { criar, listar, buscarPorId, atualizar, inativar, reativar };
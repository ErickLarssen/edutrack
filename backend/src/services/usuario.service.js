const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const usuarioRepository = require('../repositories/usuario.repository');

const criar = async (dados) => {
    const existente = await usuarioRepository.buscarPorEmail(dados.email);
    if (existente) {
        throw new AppError('Já existe um usuário com esse email', 409);
    }

    const senhaHash = await bcrypt.hash(dados.senha, 10);
    const { senha, ...resto } = dados;

    return usuarioRepository.criar({ ...resto, senhaHash });
};

const listar = (filtros) => usuarioRepository.listar(filtros);

const buscarPorId = async (id) => {
    const usuario = await usuarioRepository.buscarPorIdPublico(id);
    if (!usuario) {
        throw new AppError('Usuário não encontrado', 404);
    }
    return usuario;
};

const atualizar = async (id, dados, usuarioAutenticado) => {
    const usuario = await usuarioRepository.buscarPorId(id);
    if (!usuario) {
        throw new AppError('Usuário não encontrado', 404);
    }

    if (dados.email && dados.email !== usuario.email) {
        const existente = await usuarioRepository.buscarPorEmail(dados.email);
        if (existente) {
            throw new AppError('Já existe um usuário com esse email', 409);
        }
    }

    if (id === usuarioAutenticado.id && dados.role && dados.role !== 'ADMIN' && usuario.role === 'ADMIN') {
        throw new AppError('Você não pode remover seu próprio papel de administrador', 409);
    }

    const { senha, ...resto } = dados;
    const dadosParaAtualizar = { ...resto };

    if (senha) {
        dadosParaAtualizar.senhaHash = await bcrypt.hash(senha, 10);
    }

    return usuarioRepository.atualizar(id, dadosParaAtualizar);
};

const inativar = async (id, usuarioAutenticado) => {
    if (id === usuarioAutenticado.id) {
        throw new AppError('Você não pode desativar sua própria conta', 409);
    }

    const usuario = await usuarioRepository.buscarPorId(id);
    if (!usuario) {
        throw new AppError('Usuário não encontrado', 404);
    }

    if (usuario.role === 'ADMIN') {
        const totalAdmins = await usuarioRepository.contarAdminsAtivos();
        if (totalAdmins <= 1) {
            throw new AppError('Não é possível desativar o último administrador ativo', 409);
        }
    }

    return usuarioRepository.inativar(id);
};

const reativar = async (id) => {
    const usuario = await usuarioRepository.buscarPorId(id);
    if (!usuario) {
        throw new AppError('Usuário não encontrado', 404);
    }
    if (usuario.ativo) {
        throw new AppError('Usuário já está ativo', 409);
    }
    return usuarioRepository.reativar(id);
};

module.exports = { criar, listar, buscarPorId, atualizar, inativar, reativar };
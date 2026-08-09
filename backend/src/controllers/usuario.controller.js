const usuarioService = require('../services/usuario.service');

const criar = async (req, res, next) => {
    try {
        const usuario = await usuarioService.criar(req.body);
        res.status(201).json({ success: true, data: usuario });
    } catch (error) {
        next(error);
    }
};

const listar = async (req, res, next) => {
    try {
        const resultado = await usuarioService.listar(req.query);
        res.json({ success: true, data: resultado });
    } catch (error) {
        next(error);
    }
};

const buscarPorId = async (req, res, next) => {
    try {
        const usuario = await usuarioService.buscarPorId(req.params.id);
        res.json({ success: true, data: usuario });
    } catch (error) {
        next(error);
    }
};

const atualizar = async (req, res, next) => {
    try {
        const usuario = await usuarioService.atualizar(req.params.id, req.body, req.usuarioAutenticado);
        res.json({ success: true, data: usuario });
    } catch (error) {
        next(error);
    }
};

const deletar = async (req, res, next) => {
    try {
        await usuarioService.inativar(req.params.id, req.usuarioAutenticado);
        res.json({ success: true, data: { message: 'Usuário inativado com sucesso' } });
    } catch (error) {
        next(error);
    }
};

module.exports = { criar, listar, buscarPorId, atualizar, deletar };
const emprestimoService = require('../services/emprestimo.service');

const criar = async (req, res, next) => {
    try {
        const emprestimo = await emprestimoService.criar(req.body, req.usuarioAutenticado.id);
        res.status(201).json({ success: true, data: emprestimo });
    } catch (error) {
        next(error);
    }
};

const listar = async (req, res, next) => {
    try {
        const resultado = await emprestimoService.listar(req.query);
        res.json({ success: true, data: resultado });
    } catch (error) {
        next(error);
    }
};

const buscarPorId = async (req, res, next) => {
    try {
        const emprestimo = await emprestimoService.buscarPorId(req.params.id);
        res.json({ success: true, data: emprestimo });
    } catch (error) {
        next(error);
    }
};

const atualizar = async (req, res, next) => {
    try {
        const emprestimo = await emprestimoService.atualizar(req.params.id, req.body);
        res.json({ success: true, data: emprestimo });
    } catch (error) {
        next(error);
    }
};

module.exports = { criar, listar, buscarPorId, atualizar };
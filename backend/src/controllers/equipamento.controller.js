const equipamentoService = require('../services/equipamento.service');

const criar = async (req, res, next) => {
    try {
        const equipamento = await equipamentoService.criar(req.body);
        res.status(201).json({ success: true, data: equipamento });
    } catch (error) {
        next(error);
    }
};

const listar = async (req, res, next) => {
    try {
        const resultado = await equipamentoService.listar(req.query);
        res.json({ success: true, data: resultado });
    } catch (error) {
        next(error);
    }
};

const buscarPorId = async (req, res, next) => {
    try {
        const equipamento = await equipamentoService.buscarPorId(req.params.id);
        res.json({ success: true, data: equipamento });
    } catch (error) {
        next(error);
    }
};

const atualizar = async (req, res, next) => {
    try {
        const equipamento = await equipamentoService.atualizar(req.params.id, req.body);
        res.json({ success: true, data: equipamento });
    } catch (error) {
        next(error);
    }
};

const deletar = async (req, res, next) => {
    try {
        await equipamentoService.inativar(req.params.id);
        res.json({ success: true, data: { message: 'Equipamento inativado com sucesso' } });
    } catch (error) {
        next(error);
    }
};

module.exports = { criar, listar, buscarPorId, atualizar, deletar };
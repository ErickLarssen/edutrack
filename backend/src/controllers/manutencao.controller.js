const manutencaoService = require('../services/manutencao.service');

const criar = async (req, res, next) => {
    try {
        const manutencao = await manutencaoService.criar(req.body, req.usuarioAutenticado.id);
        res.status(201).json({ success: true, data: manutencao });
    } catch (error) {
        next(error);
    }
};

const listar = async (req, res, next) => {
    try {
        const resultado = await manutencaoService.listar(req.query);
        res.json({ success: true, data: resultado });
    } catch (error) {
        next(error);
    }
};

const buscarPorId = async (req, res, next) => {
    try {
        const manutencao = await manutencaoService.buscarPorId(req.params.id);
        res.json({ success: true, data: manutencao });
    } catch (error) {
        next(error);
    }
};

const atualizar = async (req, res, next) => {
    try {
        const manutencao = await manutencaoService.atualizar(req.params.id, req.body);
        res.json({ success: true, data: manutencao });
    } catch (error) {
        next(error);
    }
};

const atualizarStatus = async (req, res, next) => {
    try {
        const manutencao = await manutencaoService.atualizarStatus(req.params.id, req.body.status);
        res.json({ success: true, data: manutencao });
    } catch (error) {
        next(error);
    }
};

module.exports = { criar, listar, buscarPorId, atualizar, atualizarStatus };
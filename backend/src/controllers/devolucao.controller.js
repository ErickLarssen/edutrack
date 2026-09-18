const devolucaoService = require('../services/devolucao.service');

const registrar = async (req, res, next) => {
    try {
        const { emprestimoId, itemId } = req.params;
        const devolucao = await devolucaoService.registrar(emprestimoId, itemId, req.body, req.usuarioAutenticado.id);
        res.status(201).json({ success: true, data: devolucao });
    } catch (error) {
        next(error);
    }
};

const listar = async (req, res, next) => {
    try {
        const resultado = await devolucaoService.listar(req.query);
        res.json({ success: true, data: resultado });
    } catch (error) {
        next(error);
    }
};

const buscarPorPatrimonio = async (req, res, next) => {
    try {
        const item = await devolucaoService.buscarItemPorPatrimonio(req.params.numeroPatrimonio);
        res.json({ success: true, data: item });
    } catch (error) {
        next(error);
    }
};

module.exports = { registrar, listar, buscarPorPatrimonio };
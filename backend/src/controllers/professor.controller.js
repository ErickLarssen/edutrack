const professorService = require('../services/professor.service');

const criar = async (req, res, next) => {
    try {
        const professor = await professorService.criar(req.body);
        res.status(201).json({ success: true, data: professor });
    } catch (error) {
        next(error);
    }
};

const listar = async (req, res, next) => {
    try {
        const resultado = await professorService.listar(req.query);
        res.json({ success: true, data: resultado });
    } catch (error) {
        next(error);
    }
};

const buscarPorId = async (req, res, next) => {
    try {
        const professor = await professorService.buscarPorId(req.params.id);
        res.json({ success: true, data: professor });
    } catch (error) {
        next(error);
    }
};

const atualizar = async (req, res, next) => {
    try {
        const professor = await professorService.atualizar(req.params.id, req.body);
        res.json({ success: true, data: professor });
    } catch (error) {
        next(error);
    }
};

const deletar = async (req, res, next) => {
    try {
        await professorService.inativar(req.params.id);
        res.json({ success: true, data: { message: 'Professor inativado com sucesso' } });
    } catch (error) {
        next(error);
    }
};

const reativar = async (req, res, next) => {
    try {
        const professor = await professorService.reativar(req.params.id);
        res.json({ success: true, data: professor });
    } catch (error) {
        next(error);
    }
};

module.exports = { criar, listar, buscarPorId, atualizar, deletar, reativar };
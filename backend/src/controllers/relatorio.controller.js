const relatorioService = require('../services/relatorio.service');

const equipamentosMaisUtilizados = async (req, res, next) => {
    try {
        const resultado = await relatorioService.equipamentosMaisUtilizados(req.query.limite);
        res.json({ success: true, data: resultado });
    } catch (error) {
        next(error);
    }
};

const equipamentosMaisDanificados = async (req, res, next) => {
    try {
        const resultado = await relatorioService.equipamentosMaisDanificados(req.query.limite);
        res.json({ success: true, data: resultado });
    } catch (error) {
        next(error);
    }
};

const tempoMedioEmprestimo = async (req, res, next) => {
    try {
        const resultado = await relatorioService.tempoMedioEmprestimo();
        res.json({ success: true, data: resultado });
    } catch (error) {
        next(error);
    }
};

module.exports = { equipamentosMaisUtilizados, equipamentosMaisDanificados, tempoMedioEmprestimo };
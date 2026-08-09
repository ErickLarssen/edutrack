const dashboardService = require('../services/dashboard.service');

const obterResumo = async (req, res, next) => {
    try {
        const resumo = await dashboardService.obterResumo();
        res.json({ success: true, data: resumo });
    } catch (error) {
        next(error);
    }
};

module.exports = { obterResumo };
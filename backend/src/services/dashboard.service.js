const dashboardRepository = require('../repositories/dashboard.repository');

const obterResumo = async () => {
    const [equipamentos, ultimosEmprestimos, ultimasDevolucoes, atrasados] = await Promise.all([
        dashboardRepository.contarEquipamentosPorStatus(),
        dashboardRepository.ultimosEmprestimos(),
        dashboardRepository.ultimasDevolucoes(),
        dashboardRepository.emprestimosAtrasados(),
    ]);

    return {
        equipamentos,
        ultimosEmprestimos,
        ultimasDevolucoes,
        alertas: {
            emprestimosAtrasados: atrasados,
            totalAtrasados: atrasados.length,
        },
    };
};

module.exports = { obterResumo };
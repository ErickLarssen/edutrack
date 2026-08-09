const prisma = require('../config/database');

const contarEquipamentosPorStatus = async () => {
    const resultado = await prisma.equipamento.groupBy({
        by: ['status'],
        _count: { status: true },
    });

    const contagens = { DISPONIVEL: 0, EMPRESTADO: 0, MANUTENCAO: 0, INATIVO: 0 };
    resultado.forEach((item) => {
        contagens[item.status] = item._count.status;
    });

    const total = Object.values(contagens).reduce((soma, valor) => soma + valor, 0);

    return { ...contagens, total };
};

const ultimosEmprestimos = (quantidade = 5) => {
    return prisma.emprestimo.findMany({
        take: quantidade,
        orderBy: { createdAt: 'desc' },
        include: { professor: { select: { id: true, nome: true } } },
    });
};

const ultimasDevolucoes = (quantidade = 5) => {
    return prisma.devolucao.findMany({
        take: quantidade,
        orderBy: { createdAt: 'desc' },
        include: {
            emprestimoItem: { include: { equipamento: { select: { id: true, numeroPatrimonio: true } } } },
        },
    });
};

const emprestimosAtrasados = () => {
    return prisma.emprestimo.findMany({
        where: {
            status: 'ATIVO',
            previsaoDevolucao: { lt: new Date() },
        },
        include: { professor: { select: { id: true, nome: true } } },
        orderBy: { previsaoDevolucao: 'asc' },
    });
};

module.exports = { contarEquipamentosPorStatus, ultimosEmprestimos, ultimasDevolucoes, emprestimosAtrasados };
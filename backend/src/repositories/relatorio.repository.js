const prisma = require('../config/database');

const equipamentosMaisUtilizados = async (limite = 10) => {
    const agrupado = await prisma.emprestimoItem.groupBy({
        by: ['equipamentoId'],
        _count: { equipamentoId: true },
        orderBy: { _count: { equipamentoId: 'desc' } },
        take: limite,
    });

    const equipamentos = await prisma.equipamento.findMany({
        where: { id: { in: agrupado.map((item) => item.equipamentoId) } },
    });

    return agrupado.map((item) => ({
        equipamento: equipamentos.find((eq) => eq.id === item.equipamentoId),
        totalEmprestimos: item._count.equipamentoId,
    }));
};

const equipamentosMaisDanificados = async (limite = 10) => {
    const devolucoesComProblema = await prisma.devolucao.findMany({
        where: { conferencia: 'COM_PROBLEMA' },
        select: { emprestimoItem: { select: { equipamentoId: true } } },
    });

    const contagemPorEquipamento = new Map();
    devolucoesComProblema.forEach(({ emprestimoItem }) => {
        const id = emprestimoItem.equipamentoId;
        contagemPorEquipamento.set(id, (contagemPorEquipamento.get(id) || 0) + 1);
    });

    const rankeado = [...contagemPorEquipamento.entries()].sort((a, b) => b[1] - a[1]).slice(0, limite);

    const equipamentos = await prisma.equipamento.findMany({
        where: { id: { in: rankeado.map(([id]) => id) } },
    });

    return rankeado.map(([equipamentoId, totalDanos]) => ({
        equipamento: equipamentos.find((eq) => eq.id === equipamentoId),
        totalDanos,
    }));
};

const tempoMedioEmprestimoDias = async () => {
    const itensDevolvidos = await prisma.emprestimoItem.findMany({
        where: { devolucao: { isNot: null } },
        include: { emprestimo: { select: { data: true } }, devolucao: { select: { data: true } } },
    });

    if (itensDevolvidos.length === 0) {
        return { mediaDias: 0, totalAmostras: 0 };
    }

    const somaDias = itensDevolvidos.reduce((soma, item) => {
        const diffMs = item.devolucao.data.getTime() - item.emprestimo.data.getTime();
        return soma + diffMs / (1000 * 60 * 60 * 24);
    }, 0);

    return {
        mediaDias: Number((somaDias / itensDevolvidos.length).toFixed(1)),
        totalAmostras: itensDevolvidos.length,
    };
};

module.exports = { equipamentosMaisUtilizados, equipamentosMaisDanificados, tempoMedioEmprestimoDias };
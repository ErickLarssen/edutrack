const prisma = require('../config/database');

const buscarPorId = (id) => {
    return prisma.manutencao.findUnique({
        where: { id },
        include: { equipamento: true, usuario: { select: { id: true, nome: true } } },
    });
};

const listar = async ({ status, prioridade, equipamentoId, pagina = 1, limite = 20 }) => {
    const where = {
        ...(status && { status }),
        ...(prioridade && { prioridade }),
        ...(equipamentoId && { equipamentoId }),
    };

    const [dados, total] = await Promise.all([
        prisma.manutencao.findMany({
            where,
            skip: (pagina - 1) * limite,
            take: limite,
            orderBy: { dataRegistro: 'desc' },
            include: { equipamento: { select: { id: true, numeroPatrimonio: true, marca: true, modelo: true } } },
        }),
        prisma.manutencao.count({ where }),
    ]);

    return { dados, total, pagina, limite };
};

const criarComEfeito = async (dados) => {
    return prisma.$transaction(async (tx) => {
        const manutencao = await tx.manutencao.create({ data: dados });
        await tx.equipamento.update({ where: { id: dados.equipamentoId }, data: { status: 'MANUTENCAO' } });
        return manutencao;
    });
};

const atualizar = (id, dados) => prisma.manutencao.update({ where: { id }, data: dados });

const atualizarStatusSimples = (id, status) => prisma.manutencao.update({ where: { id }, data: { status } });

const concluirComEfeito = async (id, equipamentoId) => {
    return prisma.$transaction(async (tx) => {
        const manutencao = await tx.manutencao.update({
            where: { id },
            data: { status: 'CONCLUIDA', dataSolucao: new Date() },
        });
        await tx.equipamento.update({ where: { id: equipamentoId }, data: { status: 'DISPONIVEL' } });
        return manutencao;
    });
};

module.exports = { buscarPorId, listar, criarComEfeito, atualizar, atualizarStatusSimples, concluirComEfeito };
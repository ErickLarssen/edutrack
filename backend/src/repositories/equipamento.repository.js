const prisma = require('../config/database');

const buscarPorPatrimonio = (numeroPatrimonio, ignorarId) => {
    return prisma.equipamento.findFirst({
        where: {
            numeroPatrimonio,
            ...(ignorarId && { id: { not: ignorarId } }),
        },
    });
};

const buscarPorSerie = (numeroSerie, ignorarId) => {
    return prisma.equipamento.findFirst({
        where: {
            numeroSerie,
            ...(ignorarId && { id: { not: ignorarId } }),
        },
    });
};

const buscarPorId = (id) => {
    return prisma.equipamento.findUnique({ where: { id } });
};

const listar = async ({ status, tipo, busca, pagina = 1, limite = 20 }) => {
    const where = {
        ...(status && { status }),
        ...(tipo && { tipo }),
        ...(busca && {
            OR: [
                { numeroPatrimonio: { contains: busca } },
                { numeroSerie: { contains: busca } },
                { marca: { contains: busca } },
                { modelo: { contains: busca } },
            ],
        }),
    };

    const [dados, total] = await Promise.all([
        prisma.equipamento.findMany({
            where,
            skip: (pagina - 1) * limite,
            take: limite,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.equipamento.count({ where }),
    ]);

    return { dados, total, pagina, limite };
};

const criar = (dados) => prisma.equipamento.create({ data: dados });

const atualizar = (id, dados) => prisma.equipamento.update({ where: { id }, data: dados });

const inativar = (id) => prisma.equipamento.update({ where: { id }, data: { status: 'INATIVO' } });

const reativar = (id) => prisma.equipamento.update({ where: { id }, data: { status: 'DISPONIVEL' } });

const buscarPorIds = (ids) => prisma.equipamento.findMany({ where: { id: { in: ids } } });

module.exports = { buscarPorPatrimonio, buscarPorSerie, buscarPorId, buscarPorIds, listar, criar, atualizar, inativar, reativar };
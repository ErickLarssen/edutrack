const prisma = require('../config/database');

const buscarPorId = (id) => {
    return prisma.professor.findUnique({ where: { id } });
};

const listar = async ({ busca, incluirInativos, pagina = 1, limite = 20 }) => {
    const where = {
        ...(!incluirInativos && { ativo: true }),
        ...(busca && {
            OR: [
                { nome: { contains: busca } },
                { disciplina: { contains: busca } },
            ],
        }),
    };

    const [dados, total] = await Promise.all([
        prisma.professor.findMany({
            where,
            skip: (pagina - 1) * limite,
            take: limite,
            orderBy: { nome: 'asc' },
        }),
        prisma.professor.count({ where }),
    ]);

    return { dados, total, pagina, limite };
};

const criar = (dados) => prisma.professor.create({ data: dados });

const atualizar = (id, dados) => prisma.professor.update({ where: { id }, data: dados });

const inativar = (id) => prisma.professor.update({ where: { id }, data: { ativo: false } });

module.exports = { buscarPorId, listar, criar, atualizar, inativar };
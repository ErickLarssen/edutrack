const prisma = require('../config/database');

const criarComItens = async ({ dadosEmprestimo, equipamentoIds }) => {
    return prisma.$transaction(async (tx) => {
        const emprestimo = await tx.emprestimo.create({
            data: {
                ...dadosEmprestimo,
                itens: {
                    create: equipamentoIds.map((equipamentoId) => ({ equipamentoId })),
                },
            },
            include: {
                professor: true,
                itens: { include: { equipamento: true } },
            },
        });

        await tx.equipamento.updateMany({
            where: { id: { in: equipamentoIds } },
            data: { status: 'EMPRESTADO' },
        });

        return emprestimo;
    });
};

const buscarPorId = (id) => {
    return prisma.emprestimo.findUnique({
        where: { id },
        include: {
            professor: true,
            usuario: { select: { id: true, nome: true, email: true } },
            itens: {
                include: {
                    equipamento: true,
                    devolucao: true,
                },
            },
        },
    });
};

const listar = async ({ status, professorId, pagina = 1, limite = 20 }) => {
    const where = {
        ...(status && { status }),
        ...(professorId && { professorId }),
    };

    const [dados, total] = await Promise.all([
        prisma.emprestimo.findMany({
            where,
            skip: (pagina - 1) * limite,
            take: limite,
            orderBy: { data: 'desc' },
            include: {
                professor: { select: { id: true, nome: true } },
                itens: { select: { id: true, equipamentoId: true } },
            },
        }),
        prisma.emprestimo.count({ where }),
    ]);

    return { dados, total, pagina, limite };
};

const atualizar = (id, dados) => prisma.emprestimo.update({ where: { id }, data: dados });

const buscarItemPorId = (itemId) => {
    return prisma.emprestimoItem.findUnique({
        where: { id: itemId },
        include: { equipamento: true, devolucao: true },
    });
};

const buscarItemAtivoPorEquipamentoId = (equipamentoId) => {
    return prisma.emprestimoItem.findFirst({
        where: { equipamentoId, devolucao: null },
        include: {
            equipamento: true,
            emprestimo: { include: { professor: true } },
        },
    });
};

const adicionarItens = async (emprestimoId, equipamentoIds) => {
    return prisma.$transaction(async (tx) => {
        await tx.emprestimoItem.createMany({
            data: equipamentoIds.map((equipamentoId) => ({ emprestimoId, equipamentoId })),
        });

        await tx.equipamento.updateMany({
            where: { id: { in: equipamentoIds } },
            data: { status: 'EMPRESTADO' },
        });

        return tx.emprestimo.findUnique({
            where: { id: emprestimoId },
            include: {
                professor: true,
                usuario: { select: { id: true, nome: true, email: true } },
                itens: { include: { equipamento: true, devolucao: true } },
            },
        });
    });
};

module.exports = { criarComItens, buscarPorId, listar, atualizar, buscarItemPorId, buscarItemAtivoPorEquipamentoId, adicionarItens };
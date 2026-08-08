const prisma = require('../config/database');

const criarComEfeitos = async ({ emprestimoItemId, equipamentoId, emprestimoId, dadosDevolucao, criarManutencao }) => {
    return prisma.$transaction(async (tx) => {
        const devolucao = await tx.devolucao.create({
            data: { emprestimoItemId, ...dadosDevolucao },
        });

        const novoStatusEquipamento = dadosDevolucao.conferencia === 'OK' ? 'DISPONIVEL' : 'MANUTENCAO';
        await tx.equipamento.update({
            where: { id: equipamentoId },
            data: { status: novoStatusEquipamento },
        });

        if (criarManutencao) {
            await tx.manutencao.create({
                data: {
                    equipamentoId,
                    problema: 'Dano identificado na devolução',
                    descricao: dadosDevolucao.danos,
                    fotos: dadosDevolucao.fotos,
                    registradoPor: dadosDevolucao.usuarioId,
                },
            });
        }

        const itensPendentes = await tx.emprestimoItem.count({
            where: { emprestimoId, devolucao: null },
        });

        if (itensPendentes === 0) {
            await tx.emprestimo.update({ where: { id: emprestimoId }, data: { status: 'FINALIZADO' } });
        }

        return tx.devolucao.findUnique({
            where: { id: devolucao.id },
            include: { emprestimoItem: { include: { equipamento: true } } },
        });
    });
};

const listar = async ({ conferencia, pagina = 1, limite = 20 }) => {
    const where = { ...(conferencia && { conferencia }) };

    const [dados, total] = await Promise.all([
        prisma.devolucao.findMany({
            where,
            skip: (pagina - 1) * limite,
            take: limite,
            orderBy: { createdAt: 'desc' },
            include: {
                emprestimoItem: {
                    include: {
                        equipamento: true,
                        emprestimo: { include: { professor: true } },
                    },
                },
                usuario: { select: { id: true, nome: true } },
            },
        }),
        prisma.devolucao.count({ where }),
    ]);

    return { dados, total, pagina, limite };
};

module.exports = { criarComEfeitos, listar };
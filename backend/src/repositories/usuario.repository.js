const prisma = require('../config/database');

const SELECAO_PUBLICA = {
    id: true,
    nome: true,
    email: true,
    role: true,
    ativo: true,
    createdAt: true,
    updatedAt: true,
};

const buscarPorEmail = (email) => prisma.usuario.findUnique({ where: { email } });

const buscarPorId = (id) => prisma.usuario.findUnique({ where: { id } });

const buscarPorIdPublico = (id) => prisma.usuario.findUnique({ where: { id }, select: SELECAO_PUBLICA });

const listar = async ({ role, incluirInativos, busca, pagina = 1, limite = 20 }) => {
    const where = {
        ...(!incluirInativos && { ativo: true }),
        ...(role && { role }),
        ...(busca && {
            OR: [{ nome: { contains: busca } }, { email: { contains: busca } }],
        }),
    };

    const [dados, total] = await Promise.all([
        prisma.usuario.findMany({
            where,
            select: SELECAO_PUBLICA,
            skip: (pagina - 1) * limite,
            take: limite,
            orderBy: { nome: 'asc' },
        }),
        prisma.usuario.count({ where }),
    ]);

    return { dados, total, pagina, limite };
};

const criar = (dados) => prisma.usuario.create({ data: dados, select: SELECAO_PUBLICA });

const atualizar = (id, dados) => prisma.usuario.update({ where: { id }, data: dados, select: SELECAO_PUBLICA });

const inativar = (id) => prisma.usuario.update({ where: { id }, data: { ativo: false }, select: SELECAO_PUBLICA });

const reativar = (id) => prisma.usuario.update({ where: { id }, data: { ativo: true }, select: SELECAO_PUBLICA });

const contarAdminsAtivos = () => prisma.usuario.count({ where: { role: 'ADMIN', ativo: true } });

module.exports = {
    buscarPorEmail,
    buscarPorId,
    buscarPorIdPublico,
    listar,
    criar,
    atualizar,
    inativar,
    reativar,
    contarAdminsAtivos,
};
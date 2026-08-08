const prisma = require('../config/database');

const buscarPorEmail = (email) => {
    return prisma.usuario.findUnique({ where: { email } });
};

const buscarPorId = (id) => {
    return prisma.usuario.findUnique({ where: { id } });
};

module.exports = { buscarPorEmail, buscarPorId };
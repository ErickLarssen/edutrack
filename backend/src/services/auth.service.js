const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const { gerarToken } = require('../utils/jwt');
const usuarioRepository = require('../repositories/usuario.repository');

const login = async (email, senha) => {
    const usuario = await usuarioRepository.buscarPorEmail(email);

    if (!usuario) {
        throw new AppError('Credenciais inválidas', 401);
    }

    const senhaConfere = await bcrypt.compare(senha, usuario.senhaHash);

    if (!senhaConfere) {
        throw new AppError('Credenciais inválidas', 401);
    }

    const token = gerarToken({ sub: usuario.id, role: usuario.role });

    return {
        token,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            role: usuario.role,
        },
    };
};

module.exports = { login };
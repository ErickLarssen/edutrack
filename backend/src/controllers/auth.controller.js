const authService = require('../services/auth.service');
const usuarioRepository = require('../repositories/usuario.repository');

const login = async (req, res, next) => {
    try {
        const { email, senha } = req.body;
        const resultado = await authService.login(email, senha);
        res.json({ success: true, data: resultado });
    } catch (error) {
        next(error);
    }
};

const me = async (req, res, next) => {
    try {
        const usuario = await usuarioRepository.buscarPorId(req.usuarioAutenticado.id);

        res.json({
            success: true,
            data: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                role: usuario.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { login, me };
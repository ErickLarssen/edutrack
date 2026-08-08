const AppError = require('../utils/AppError');
const { verificarToken } = require('../utils/jwt');

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('Token não fornecido', 401));
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = verificarToken(token);
        req.usuarioAutenticado = { id: payload.sub, role: payload.role };
        next();
    } catch (error) {
        return next(new AppError('Token inválido ou expirado', 401));
    }
};

module.exports = authenticate;
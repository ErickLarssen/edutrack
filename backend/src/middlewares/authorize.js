const AppError = require('../utils/AppError');

const authorize = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.usuarioAutenticado.role)) {
            return next(new AppError('Você não tem permissão para esta ação', 403));
        }
        next();
    };
};

module.exports = authorize;
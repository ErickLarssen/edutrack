const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : 'Erro interno no servidor';

    if (!err.isOperational) {
        console.error('[ERRO NÃO TRATADO]', err);
    }

    res.status(statusCode).json({
        success: false,
        error: {
            message,
        },
    });
};

module.exports = errorHandler;
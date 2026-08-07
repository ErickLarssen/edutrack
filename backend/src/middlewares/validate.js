const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            params: req.params,
            query: req.query,
        });
        next();
    } catch (error) {
        if (error.name === 'ZodError') {
            const detalhes = error.errors.map((e) => ({
                campo: e.path.join('.'),
                mensagem: e.message,
            }));

            return res.status(422).json({
                success: false,
                error: {
                    message: 'Erro de validação',
                    details: detalhes,
                },
            });
        }

        next(error);
    }
};

module.exports = validate;
const validate = (schema) => (req, res, next) => {
    try {
        const resultado = schema.parse({
            body: req.body,
            params: req.params,
            query: req.query,
        });

        if (resultado.body) req.body = resultado.body;
        if (resultado.params) req.params = resultado.params;
        if (resultado.query) req.query = resultado.query;

        next();

    } catch (error) {
        if (error.name === 'ZodError') {
            const problemas = error.issues || error.errors || [];
            const detalhes = problemas.map((e) => ({

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
const { z } = require('zod');

const listarComLimiteSchema = z.object({
    query: z.object({
        limite: z.coerce.number().int().positive().max(50).optional(),
    }),
});

module.exports = { listarComLimiteSchema };
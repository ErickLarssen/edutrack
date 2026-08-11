const { z } = require('zod');

const booleanoDeQuery = z.preprocess((valor) => {
    if (typeof valor === 'string') return valor === 'true';
    return valor;
}, z.boolean());

module.exports = { booleanoDeQuery };
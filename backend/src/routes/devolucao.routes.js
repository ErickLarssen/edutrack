const express = require('express');
const router = express.Router();

const devolucaoController = require('../controllers/devolucao.controller');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const { listarDevolucoesSchema, buscarItemPorPatrimonioSchema } = require('../validations/devolucao.validation');

router.use(authenticate);

router.get('/', validate(listarDevolucoesSchema), devolucaoController.listar);
router.get('/item-por-patrimonio/:numeroPatrimonio', validate(buscarItemPorPatrimonioSchema), devolucaoController.buscarPorPatrimonio);

module.exports = router;
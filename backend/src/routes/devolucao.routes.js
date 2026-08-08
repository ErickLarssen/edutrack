const express = require('express');
const router = express.Router();

const devolucaoController = require('../controllers/devolucao.controller');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const { listarDevolucoesSchema } = require('../validations/devolucao.validation');

router.use(authenticate);

router.get('/', validate(listarDevolucoesSchema), devolucaoController.listar);

module.exports = router;
const express = require('express');
const router = express.Router();

const relatorioController = require('../controllers/relatorio.controller');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const { listarComLimiteSchema } = require('../validations/relatorio.validation');

router.use(authenticate);

router.get('/equipamentos-mais-utilizados', validate(listarComLimiteSchema), relatorioController.equipamentosMaisUtilizados);
router.get('/equipamentos-mais-danificados', validate(listarComLimiteSchema), relatorioController.equipamentosMaisDanificados);
router.get('/tempo-medio-emprestimo', relatorioController.tempoMedioEmprestimo);

module.exports = router;
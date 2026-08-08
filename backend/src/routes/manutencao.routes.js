const express = require('express');
const router = express.Router();

const manutencaoController = require('../controllers/manutencao.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const {
    criarManutencaoSchema,
    atualizarManutencaoSchema,
    atualizarStatusSchema,
    idParamSchema,
    listarManutencoesSchema,
} = require('../validations/manutencao.validation');

router.use(authenticate);

router.get('/', validate(listarManutencoesSchema), manutencaoController.listar);
router.get('/:id', validate(idParamSchema), manutencaoController.buscarPorId);
router.post('/', authorize('ADMIN', 'ESTAGIARIO'), validate(criarManutencaoSchema), manutencaoController.criar);
router.put('/:id', authorize('ADMIN', 'ESTAGIARIO'), validate(atualizarManutencaoSchema), manutencaoController.atualizar);
router.patch(
    '/:id/status',
    authorize('ADMIN', 'ESTAGIARIO'),
    validate(atualizarStatusSchema),
    manutencaoController.atualizarStatus
);

module.exports = router;
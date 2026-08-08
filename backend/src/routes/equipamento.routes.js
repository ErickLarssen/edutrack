const express = require('express');
const router = express.Router();

const equipamentoController = require('../controllers/equipamento.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const {
    criarEquipamentoSchema,
    atualizarEquipamentoSchema,
    idParamSchema,
    listarEquipamentosSchema,
} = require('../validations/equipamento.validation');

router.use(authenticate);

router.get('/', validate(listarEquipamentosSchema), equipamentoController.listar);
router.get('/:id', validate(idParamSchema), equipamentoController.buscarPorId);
router.post('/', authorize('ADMIN', 'ESTAGIARIO'), validate(criarEquipamentoSchema), equipamentoController.criar);
router.put('/:id', authorize('ADMIN', 'ESTAGIARIO'), validate(atualizarEquipamentoSchema), equipamentoController.atualizar);
router.delete('/:id', authorize('ADMIN'), validate(idParamSchema), equipamentoController.deletar);

module.exports = router;
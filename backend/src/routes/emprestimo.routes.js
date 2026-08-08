const express = require('express');
const router = express.Router();

const emprestimoController = require('../controllers/emprestimo.controller');
const devolucaoController = require('../controllers/devolucao.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const {
    criarEmprestimoSchema,
    atualizarEmprestimoSchema,
    idParamSchema,
    listarEmprestimosSchema,
} = require('../validations/emprestimo.validation');
const { registrarDevolucaoSchema } = require('../validations/devolucao.validation');

router.use(authenticate);

router.get('/', validate(listarEmprestimosSchema), emprestimoController.listar);
router.get('/:id', validate(idParamSchema), emprestimoController.buscarPorId);
router.post('/', authorize('ADMIN', 'ESTAGIARIO'), validate(criarEmprestimoSchema), emprestimoController.criar);
router.put('/:id', authorize('ADMIN', 'ESTAGIARIO'), validate(atualizarEmprestimoSchema), emprestimoController.atualizar);

router.post(
    '/:emprestimoId/itens/:itemId/devolucoes',
    authorize('ADMIN', 'ESTAGIARIO'),
    validate(registrarDevolucaoSchema),
    devolucaoController.registrar
);

module.exports = router;
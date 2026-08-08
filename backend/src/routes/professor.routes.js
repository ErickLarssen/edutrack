const express = require('express');
const router = express.Router();

const professorController = require('../controllers/professor.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const {
    criarProfessorSchema,
    atualizarProfessorSchema,
    idParamSchema,
    listarProfessoresSchema,
} = require('../validations/professor.validation');

router.use(authenticate);

router.get('/', validate(listarProfessoresSchema), professorController.listar);
router.get('/:id', validate(idParamSchema), professorController.buscarPorId);
router.post('/', authorize('ADMIN', 'ESTAGIARIO'), validate(criarProfessorSchema), professorController.criar);
router.put('/:id', authorize('ADMIN', 'ESTAGIARIO'), validate(atualizarProfessorSchema), professorController.atualizar);
router.delete('/:id', authorize('ADMIN'), validate(idParamSchema), professorController.deletar);

module.exports = router;
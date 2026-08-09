const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuario.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const {
    criarUsuarioSchema,
    atualizarUsuarioSchema,
    idParamSchema,
    listarUsuariosSchema,
} = require('../validations/usuario.validation');

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/', validate(listarUsuariosSchema), usuarioController.listar);
router.get('/:id', validate(idParamSchema), usuarioController.buscarPorId);
router.post('/', validate(criarUsuarioSchema), usuarioController.criar);
router.put('/:id', validate(atualizarUsuarioSchema), usuarioController.atualizar);
router.delete('/:id', validate(idParamSchema), usuarioController.deletar);

module.exports = router;
const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');
const authenticate = require('../middlewares/authenticate');

router.use(authenticate);
router.get('/', dashboardController.obterResumo);

module.exports = router;
const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const equipamentoRoutes = require('./equipamento.routes');
const professorRoutes = require('./professor.routes');
const emprestimoRoutes = require('./emprestimo.routes');
const devolucaoRoutes = require('./devolucao.routes');
const manutencaoRoutes = require('./manutencao.routes');
const usuarioRoutes = require('./usuario.routes');

router.get('/health', (req, res) => {
    res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

router.use('/auth', authRoutes);
router.use('/equipamentos', equipamentoRoutes);
router.use('/professores', professorRoutes);
router.use('/emprestimos', emprestimoRoutes);
router.use('/devolucoes', devolucaoRoutes);
router.use('/manutencoes', manutencaoRoutes);
router.use('/usuarios', usuarioRoutes);

module.exports = router;
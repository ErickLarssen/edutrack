const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const equipamentoRoutes = require('./equipamento.routes');

router.get('/health', (req, res) => {
    res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

router.use('/auth', authRoutes);
router.use('/equipamentos', equipamentoRoutes);

module.exports = router;
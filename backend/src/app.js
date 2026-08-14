const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const origensPermitidas = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : true;

app.use(cors({ origin: origensPermitidas }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1', routes);

app.use((req, res) => {
    res.status(404).json({ success: false, error: { message: 'Rota não encontrada' } });
});

app.use(errorHandler);

module.exports = app;
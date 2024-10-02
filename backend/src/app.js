const express = require('express');
const errorMiddleware = require('./error/errorMiddleware');

const app = express();

app.use(express.json());


app.get('/health', (req, res) => {
	res.status(200).send('OK');
});

app.use(errorMiddleware);

module.exports = app;
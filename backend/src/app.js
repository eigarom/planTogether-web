const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan')
const errorMiddleware = require('./middlewares/error/errorMiddleware');

const authRouter = require('./routes/authRouter');
const userAccountRouter = require('./routes/userAccountRouter');

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

app.use('/auth', authRouter);
app.use('/users', userAccountRouter);

app.get('/health', (req, res) => {
	res.status(200).send('OK');
});

app.use(errorMiddleware);

module.exports = app;
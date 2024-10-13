const express = require('express');
const errorMiddleware = require('./error/errorMiddleware');

const authRouter = require('./routes/authRouter');
const familyRouter = require('./routes/familyRouter');

const app = express();

app.use(express.json());

app.use('/auth', authRouter);
app.use('/familyRouter', familyRouter);

app.get('/health', (req, res) => {
	res.status(200).send('OK');
});

app.use(errorMiddleware);

module.exports = app;
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan')
const errorMiddleware = require('./middlewares/error/errorMiddleware');

const authRouter = require('./routes/authRouter');
const familyRouter = require('./routes/familyRouter');
const memberRouter = require('./routes/memberRouter');
const userAccountRouter = require('./routes/userAccountRouter');
const eventRouter = require('./routes/eventRouter')
const taskRouter = require('./routes/taskRouter')

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Supprime /api pour Azure
app.use((req, res, next) => {
	if (req.path.startsWith('/api/')) {
		req.url = req.url.replace('/api', '');
	}
	next();
});

app.use('/auth', authRouter);
app.use('/users', userAccountRouter);
app.use('/families', familyRouter);
app.use('/families/my-family/members', memberRouter);
app.use('/families/my-family/events', eventRouter);
app.use('/families/my-family/taskslists', taskRouter);

app.get('/health', (req, res) => {
	res.status(200).send('OK');
});

app.use(errorMiddleware);

module.exports = app;
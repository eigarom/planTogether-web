require('dotenv').config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require('express');
const router = express.Router();
const HttpError = require("../error/HttpError");
const UserAccountServices = require("../services/UserAccountServices");

router.post('/login', async (req, res, next) => {
	const email = req.body.email;
	if (!email || email === '') {
		return next(new HttpError(400, `Le courriel est requis`));
	}

	try {
		const user = await UserAccountServices.getUserByEmail(email);
		if (!user) {
			return next(new HttpError(401, `Identifiants invalides`));
		}

		const passwordMatch = await bcrypt.compare(req.body.password, user.password);
		if (!passwordMatch) {
			return next(new HttpError(401, `Identifiants invalides`));
		}

		const token = jwt.sign({email: user.email}, process.env.JWT_SECRET, {expiresIn: '8766h'});
		res.status(200).json({token});

	} catch (error) {
		return next(err);
	}
});

module.exports = router;
require('dotenv').config();
const express = require('express');
const {loginSchema, registerSchema} = require('../schemas/authSchemas');
const router = express.Router();
const HttpError = require("../middlewares/error/HttpError");
const UserAccountServices = require("../services/UserAccountServices");
const AuthServices = require("../services/AuthServices");

router.post('/login', async (req, res, next) => {
	const {error} = loginSchema.validate(req.body);
	if (error) {
		return next(new HttpError(400, error.message));
	}

	const {email, password} = req.body

	try {
		const user = await UserAccountServices.getUserCredentialsByEmail(email);
		if (!user) {
			return next(new HttpError(401, `Identifiants invalides`));
		}

		if (!await AuthServices.isValidPassword(password, user)) {
			return next(new HttpError(401, `Identifiants invalides`));
		}

		const token = AuthServices.generateToken(user);

		res.json({token});
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
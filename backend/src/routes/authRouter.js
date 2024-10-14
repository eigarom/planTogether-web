require('dotenv').config();
const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {loginSchema} = require('../schemas/authSchemas');
const router = express.Router();
const HttpError = require("../error/HttpError");
const UserAccountServices = require("../services/UserAccountServices");

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

		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return next(new HttpError(401, `Identifiants invalides`));
		}

		const token = jwt.sign({
			email: user.email,
			userId: user.userId,
			familyId: user.familyId
		}, process.env.JWT_SECRET);

		res.json({token});
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
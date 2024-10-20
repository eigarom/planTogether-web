require('dotenv').config();
const express = require('express');
const {loginSchema, registerSchema} = require('../schemas/authSchemas');
const router = express.Router();
const HttpError = require("../middlewares/error/HttpError");
const AuthServices = require("../services/AuthServices");

router.post('/login', async (req, res, next) => {
	const {error} = loginSchema.validate(req.body);
	if (error) {
		return next(new HttpError(400, error.message));
	}

	const {email, password} = req.body

	try {
		const token = await AuthServices.login(email, password);

		res.json({token});
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
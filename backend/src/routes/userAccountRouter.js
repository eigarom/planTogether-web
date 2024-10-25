const express = require('express');
const router = express.Router();
const HttpError = require("../middlewares/error/HttpError");
const UserAccountServices = require("../services/UserAccountServices");
const verifyJWT = require("../middlewares/auth/authMiddleware");
const {loginSchema} = require("../schemas/authSchemas");
const {userAccountSchema} = require("../schemas/userAccountSchemas");

router.get('/me', verifyJWT, async (req, res, next) => {
	try {
		const user = await UserAccountServices.getUserById(req.user.userId);
		if (user) {
			res.json(user);
		} else {
			next(new HttpError(404, 'Utilisateur introuvable'))
		}
	} catch (err) {
		return next(err);
	}
});

router.get('/me/image', verifyJWT, async (req, res, next) => {
	try {
		const imageInfo = await UserAccountServices.getUserImageContent(req.user.userId);
		if (imageInfo) {
			res.header('Content-Type', imageInfo.imageContentType);
			res.send(imageInfo.imageContent);
		} else {
			next(new HttpError(404, `Image de l'utilisateur introuvable`))
		}
	} catch (err) {
		return next(err);
	}
});

router.put('/me', verifyJWT, async (req, res, next) => {
	const {error} = userAccountSchema.validate(req.body);
	if (error) {
		return next(new HttpError(400, error.message));
	}

	try {
		const user = await UserAccountServices.getUserById(req.user.userId);
		if (!user) {
			return next(new HttpError(404, `Utilisateur introuvable`));
		}

		const userInformations = {
			id: "" + req.user.userId,
			name: "" + req.body.name,
			color: "" + req.body.color,
			lang: "" + req.body.lang,
			theme: "" + req.body.theme
		};

		const updatedUser = await UserAccountServices.updateUser(userInformations);

		res.json(updatedUser);
	} catch (err) {
		next(err);
	}
});


module.exports = router;
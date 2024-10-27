const express = require('express');
const router = express.Router();
const HttpError = require("../middlewares/error/HttpError");
const UserAccountServices = require("../services/UserAccountServices");
const verifyJWT = require("../middlewares/auth/authMiddleware");

router.get('/me', verifyJWT, async (req, res, next) => {
		try {
			const user = await UserAccountServices.getUserById(req.user.userId);
			if (user) {
				res.json(user);
			} else {
				next(new HttpError(404, 'Utilisateur introuvable'))
			}
		} catch
			(err) {
			return next(err);
		}
	}
)
;

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

module.exports = router;
const express = require('express');
const router = express.Router();
const HttpError = require("../error/HttpError");
const UserAccountServices = require("../services/UserAccountServices");

router.get('/me', async (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token || token === '') {
		return next(new HttpError(401, "Erreur lors de la récupération du token"));
	}

	try {
		const user = await UserAccountServices.getUserByToken(token);
		if (user) {
			res.json(user);
		} else {
			return next(new HttpError(404, `Utilisateur introuvable`));
		}
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
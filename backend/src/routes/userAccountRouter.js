const express = require('express');
const router = express.Router();
const HttpError = require("../error/HttpError");
const UserAccountServices = require("../services/UserAccountServices");
const {authenticateUser} = require("../auth/authMiddleware");

router.get('/me', authenticateUser, async (req, res, next) => {
	try {
		const user = await UserAccountServices.getUserById(req.userId);
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
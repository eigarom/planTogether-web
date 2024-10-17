const express = require('express');
const router = express.Router();
const HttpError = require("../error/HttpError");
const EventServices = require("../services/EventServices");
const verifyJWT = require("../auth/authMiddleware");

router.get('/', verifyJWT, async (req, res, next) => {
	const familyId = req.user.familyId;

	try {
		const events = await EventServices.getEventsByIdFamily(familyId);

		if (events) {
			res.json(events);
		} else {
			return next(new HttpError(404, `Événements pour la famille ${familyId} introuvables`));
		}
	} catch (error) {
		return next(error);
	}
});

module.exports = router;
const express = require('express');
const router = express.Router();
const HttpError = require("../error/HttpError");
const EventServices = require("../services/EventServices");

router.get('/', async (req, res, next) => {
	const familyId = 1;

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
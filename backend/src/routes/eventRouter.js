const express = require('express');
const router = express.Router();
const HttpError = require("../middlewares/error/HttpError");
const EventServices = require("../services/EventServices");
const verifyJWT = require("../middlewares/auth/authMiddleware");

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

router.get('/:id', verifyJWT, async (req, res, next) => {
	const familyId = req.user.familyId;
	const userId = req.user.userId;
	const eventId = req.params.id;

	try {
		const event = await EventServices.getEventByIds(eventId, familyId);

		if (!event) {
			return next(new HttpError(404, `Événement ${eventId} pour la famille ${familyId} introuvable`));
		}
		if (event.isVisible || event.members.some(member => member.id === userId)) {
			res.json(event);
		} else {
			return next(new HttpError(403, `L'utilisateur ${userId} n'a pas les droits requis`));
		}
	} catch (error) {
		return next(error);
	}
});

module.exports = router;
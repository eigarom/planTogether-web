const express = require('express');
const router = express.Router();
const HttpError = require("../middlewares/error/HttpError");
const EventServices = require("../services/EventServices");
const verifyJWT = require("../middlewares/auth/authMiddleware");
//const {eventSchema} = require("../schemas/eventSchemas");

const verifyEventId = async (req, res, next) => {
	const eventId = req.params.id;

	if (!await EventServices.isEventInFamily(eventId, req.user.familyId)) {
		return next(new HttpError(403, "Accès non autorisé aux données de cet événement"));
	}
	next();
};

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

router.get('/:id', verifyJWT, verifyEventId, async (req, res, next) => {
	const userId = req.user.userId;
	const eventId = req.params.id;

	try {
		const event = await EventServices.getEventById(eventId);

		if (!event) {
			return next(new HttpError(404, `Événement ${eventId} introuvable`));
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

router.get('/:id/periods/:periodId', verifyJWT, verifyEventId, async (req, res, next) => {
	const userId = req.user.userId;
	const eventId = req.params.id;
	const periodId = req.params.periodId

	try {
		const event = await EventServices.getEventWithPeriodId(eventId, periodId);

		if (!event) {
			return next(new HttpError(404, `Événement ${eventId} introuvable`));
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

router.post('/', verifyJWT, async (req, res, next) => {
	//const { error } = eventSchema.validate(req.body);
	// if (error) {
	// 	return next(new HttpError(400, error.message));
	// }
	try {
		const eventDetails = {
			familyId: req.user.familyId,
			name: req.body.name,
			description: req.body.description,
			isVisible: req.body.isVisible,
			periods: req.body.periods.map(period => ({
				startDateTime: period.startDateTime,
				endDateTime: period.endDateTime,
				alerts: period.alerts
			})),
			members: req.body.members
		};
		const newEvent = await EventServices.createEvent(eventDetails);

		res.status(201).json(newEvent);
	} catch (err) {
		return next(err);
	}
});

router.put('/:id', verifyJWT, verifyEventId, async (req, res, next) => {
	//const { error } = eventSchema.validate(req.body);
	// if (error) {
	// 	return next(new HttpError(400, error.message));
	// }
	const userId = req.user.userId;
	const eventId = req.params.id;

	try {
		const event = await EventServices.getEventById(eventId);
		if (!event) {
			return next(new HttpError(404, `Événement introuvable`));
		}

		if (!event.isVisible && !event.members.some(member => member.id === userId)) {
			return next(new HttpError(403, `L'utilisateur ${userId} n'a pas les droits requis`));
		}

		const eventDetails = {
			id: eventId,
			name: req.body.name,
			description: req.body.description,
			isVisible: req.body.isVisible,
			members: req.body.members
		};
		const updatedEvent = await EventServices.updateEvent(eventDetails);

		res.status(200).json(updatedEvent);
	} catch (err) {
		return next(err);
	}
});

router.put('/:id/periods/:periodId', verifyJWT, verifyEventId, async (req, res, next) => {
	//const { error } = eventSchema.validate(req.body);
	// if (error) {
	// 	return next(new HttpError(400, error.message));
	// }
	const userId = req.user.userId;
	const eventId = req.params.id;
	const periodId = req.params.periodId;

	try {

		const event = await EventServices.getEventById(eventId);
		if (!event) {
			return next(new HttpError(404, `Événement introuvable`));
		}

		if (!event.isVisible && !event.members.some(member => member.id === userId)) {
			return next(new HttpError(403, `L'utilisateur ${userId} n'a pas les droits requis`));
		}

		const period = await EventServices.getPeriodById(periodId, eventId);
		if (!period) {
			return next(new HttpError(404, `Période introuvable`));
		}

		const periodDetails = {
			eventId: eventId,
			periodId: periodId,
			startDateTime: req.body.startDateTime,
			endDateTime: req.body.endDateTime,
			alerts: req.body.alerts
		};
		const updatedPeriod = await EventServices.updatePeriod(periodDetails);

		res.status(200).json(updatedPeriod);
	} catch (err) {
		return next(err);
	}
});

router.delete('/:id', verifyJWT, verifyEventId, async (req, res, next) => {
	const userId = req.user.userId;
	const eventId = req.params.id;

	try {
		const event = await EventServices.getEventById(eventId);
		if (!event) {
			return next(new HttpError(404, `Événement introuvable`));
		}

		if (!event.isVisible && !event.members.some(member => member.id === userId)) {
			return next(new HttpError(403, `L'utilisateur ${userId} n'a pas les droits requis`));
		}

		await EventServices.deleteEvent(eventId);

		res.json({});
	} catch (err) {
		next(err);
	}
});

router.delete('/:id/:periodId', verifyJWT, verifyEventId, async (req, res, next) => {
	const userId = req.user.userId;
	const eventId = req.params.id;
	const periodId = req.params.periodId;

	try {
		const event = await EventServices.getEventById(eventId);
		if (!event) {
			return next(new HttpError(404, `Événement introuvable`));
		}

		if (!event.isVisible && !event.members.some(member => member.id === userId)) {
			return next(new HttpError(403, `L'utilisateur ${userId} n'a pas les droits requis`));
		}

		const period = await EventServices.getPeriodById(periodId, eventId);
		if (!period) {
			return next(new HttpError(404, `Période introuvable`));
		}

		await EventServices.deletePeriod(periodId, eventId);

		res.json({});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
const express = require('express');
const router = express.Router();
const verifyJWT = require("../middlewares/auth/authMiddleware");
const HttpError = require("../middlewares/error/HttpError");
const MemberServices = require("../services/MemberServices");
const {imageSchema} = require("../schemas/imageSchemas");

const verifyMemberId = async (req, res, next) => {
	const memberId = req.params.id;

	if (!await MemberServices.isMemberInFamily(memberId, req.user.familyId)) {
		return next(new HttpError(403, "Accès non autorisé aux données de ce membre"));
	}
	next();
};

router.get('/:id/image', verifyJWT, verifyMemberId, async (req, res, next) => {
	try {
		const imageInfo = await MemberServices.getMemberImageContent(req.params.id);
		if (imageInfo) {
			res.header('Content-Type', imageInfo.imageContentType);
			res.send(imageInfo.imageContent);
		} else {
			next(new HttpError(404, `Image du membre introuvable`))
		}
	} catch (err) {
		return next(err);
	}
});

router.put('/:id/image', verifyJWT, verifyMemberId, async (req, res, next) => {
	const {error} = imageSchema.validate(req.body);
	if (error) {
		return next(new HttpError(400, error.message));
	}

	try {
		const member = await MemberServices.getMemberById(req.params.id);
		if (!member) {
			return next(new HttpError(404, `Membre introuvable`));
		}

		const imageInfo = await MemberServices.updateMemberImage(req.params.id, req.file.buffer, req.file.mimetype);

		if (imageInfo) {
			res.header('Content-Type', imageInfo.imageContentType);
			res.send(imageInfo.imageContent);
		} else {
			next(new HttpError(500, `Erreur lors de la modification de l'image`))
		}
	} catch (err) {
		next(err);
	}
});

router.delete('/:id/image', verifyJWT, verifyMemberId, async (req, res, next) => {
	try {
		const member = await MemberServices.getMemberById(req.params.id);
		if (!member) {
			return next(new HttpError(404, `Membre introuvable`));
		}

		const imageInfo = await MemberServices.updateMemberImage(req.params.id, null, null);
		if (!imageInfo.imageContent && !imageInfo.imageContentType) {
			res.json({});
		} else {
			next(new HttpError(500, `Erreur lors de la suppression de l'image`))
		}
	} catch (err) {
		next(err);
	}
});


module.exports = router;
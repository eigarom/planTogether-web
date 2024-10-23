const express = require("express");
const router = express.Router();
const HttpError = require("../middlewares/error/HttpError");
const FamilyServices = require("../services/FamilyServices");
const {familySchema} = require("../schemas/familySchemas");
const verifyJWT = require("../middlewares/auth/authMiddleware");

router.get('/my-family', verifyJWT, async (req, res, next) => {
	try {
		const family = await FamilyServices.getFamilyById(req.user.userId);

		res.json({family: family || null});
	} catch (err) {
		return next(err);
	}
});

router.post("/", verifyJWT, async (req, res, next) => {
	const {error} = familySchema.validate(req.body);
	if (error) {
		return next(new HttpError(400, error.message));
	}

	const newFamily = {
		name: "" + req.body.name,
		color: "" + req.body.color,
		imageContent: "" + req.body.imageContent,
		imageContentType: "" + req.body.imageContentType,
	};
	const userId = req.user.userId;
	try {
		const family = await FamilyServices.createFamily(newFamily, userId);
		res.status(201).json(family);
	} catch (err) {
		return next(err);
	}
});

router.get('/my-family/image', verifyJWT, async (req, res, next) => {
	try {
		const imageInfo = await FamilyServices.getFamilyImageContent(req.user.familyId);
		if (imageInfo && imageInfo.imageContent) {
			if (imageInfo.imageContentType) {
				res.header('Content-Type', imageInfo.imageContentType);
			}
			res.send(imageInfo.imageContent);
		}
	} catch (err) {
		return next(err);
	}
});

module.exports = router;

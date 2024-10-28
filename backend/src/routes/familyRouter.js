const express = require("express");
const router = express.Router();
const HttpError = require("../middlewares/error/HttpError");
const FamilyServices = require("../services/FamilyServices");
const {familySchema} = require("../schemas/familySchemas");
const verifyJWT = require("../middlewares/auth/authMiddleware");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { generateToken } = require('../utils/authUtils');
const UserAccountServices = require('../services/UserAccountServices');

router.get('/my-family', verifyJWT, async (req, res, next) => {
	try {
		const family = await FamilyServices.getFamilyById(req.user.familyId);
		if (family) {
			res.json(family);
		} else {
			next(new HttpError(404, `Famille introuvable`))
		}
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
		color: "" + req.body.color
	};
	const userId = req.user.userId;
	try {
		const family = await FamilyServices.createFamily(newFamily, userId);
		const updatedUser = await UserAccountServices.getUserCredentialsByEmail(req.user.email);

		const token = generateToken(updatedUser);
		res.status(201).json({family, token});
	} catch (err) {
		return next(err);
	}
});

router.get('/my-family/image', verifyJWT, async (req, res, next) => {
	try {
		const imageInfo = await FamilyServices.getFamilyImageContent(req.user.familyId);
		if (imageInfo && imageInfo.imageContent && imageInfo.imageContentType) {
			res.header('Content-Type', imageInfo.imageContentType);
			res.send(imageInfo.imageContent);
		} else {
			next(new HttpError(404, `Image de la famille introuvable`))
		}
	} catch (err) {
		return next(err);
	}
});

router.put('/my-family/image', verifyJWT,
    // Fonction middleware de multer pour gérer l'upload d'un fichier dans ce endpoint.
    // Cet appel de middleware doit venir après celui de l'authentification.
    upload.single('family-image'), // Doit correspondre à l'id du champ dans le formulaire html
    async (req, res, next) => {
      // const familyId = req.user.familyId;

       try {
          const family = await FamilyServices.getFamilyById(req.user.familyId);
          if (!family) {
             return next(new HttpError(404, `L'id ${req.user.familyId} ne correspond à aucune famille existante`));
          }

          // Le middleware upload.single(...) rendra accessible le contenu binaire du fichier
          // téléversé dans req.file.buffer et le type de fichier (p.ex. "image/jpeg")
          // dans req.file.mimetype:
          const imageInfo = await FamilyServices.updateFamilyImage(req.user.familyId, req.file.buffer, req.file.mimetype);
		if (imageInfo && imageInfo.imageContent) {
			if (imageInfo.imageContentType) {
				res.header('Content-Type', imageInfo.imageContentType);
			}
			res.send(imageInfo.imageContent);
		}
          res.json("");
       } catch (err) {
          next(err);
       }
    });

module.exports = router;

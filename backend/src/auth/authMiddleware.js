const jwt = require('jsonwebtoken');
const HttpError = require("../error/HttpError");
const FamilyServices = require("../services/FamilyServices");
const UserAccountServices = require("../services/UserAccountServices");

const authenticateUserId = async (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token || token === '') {
		return next(new HttpError(401, "Erreur lors de la récupération du token"));
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const userId = await UserAccountServices.getUserIdByEmail(decoded.email);

		if (!userId) {
			return next(new HttpError(404, "Utilisateur introuvable"));
		}

		req.userId = userId;
		next();
	} catch (err) {
		return next(new HttpError(401, "Token invalide"));
	}
};

const authenticateUserFamilyId = async (req, res, next) => {
	await authenticateUserId(req, res, async (err) => {
		if (err) return next(err);

		try {
			const familyId = await FamilyServices.getFamilyIdByUserId(req.userId);
			if (!familyId) {
				return next(new HttpError(404, "Famille introuvable"));
			}

			req.familyId = familyId;
			next();
		} catch (err) {
			return next(new HttpError(500, "Erreur lors de la récupération de la famille"));
		}
	});
};

module.exports = {authenticateUser: authenticateUserId, authenticateUserFamily: authenticateUserFamilyId};
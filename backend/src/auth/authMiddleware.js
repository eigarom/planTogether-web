const jwt = require('jsonwebtoken');
const HttpError = require("../error/HttpError");

const verifyJWT = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];  // Extraction du token si "Bearer <token>"

	if (!token || token === '') {
		return next(new HttpError(401, "Erreur lors de la récupération du token"));
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
		if (err) {
			return next(new HttpError(401, "Échec de l'authentification du token"));
		}
		req.user = data;
		next();
	});
};

module.exports = verifyJWT;
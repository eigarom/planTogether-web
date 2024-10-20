const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Génère un token JWT pour l'utilisateur
 * @param {object} user - L'objet utilisateur contenant les informations nécessaires
 * @returns {string} - Le token JWT signé
 */
function generateToken(user) {
	return jwt.sign({
		email: user.email,
		userId: user.userId,
		familyId: user.familyId
	}, process.env.JWT_SECRET);
}

/**
 * Vérifie si le mot de passe fourni correspond au mot de passe haché de l'utilisateur
 * @param {string} password - Le mot de passe en clair fourni par l'utilisateur
 * @param {object} user - L'utilisateur avec son mot de passe haché
 * @returns {Promise<boolean>} - Résultat de la comparaison (true si valide, false sinon)
 */
async function isValidPassword(password, user) {
	return await bcrypt.compare(password, user.password);
}

module.exports = {
	generateToken,
	isValidPassword
};

const UserAccountServices = require("./UserAccountServices");
const UserAccountQueries = require("../queries/UserAccountQueries");
const HttpError = require("../middlewares/error/HttpError");
const {isValidPassword, generateToken, hashPassword} = require("../utils/authUtils");

class AuthServices {
	static async login(email, password) {
		const user = await UserAccountServices.getUserCredentialsByEmail(email);
		if (!user) {
			throw (new HttpError(401, `Identifiants invalides`));
		}

		if (!await isValidPassword(password, user)) {
			throw (new HttpError(401, `Identifiants invalides`));
		}

		return generateToken(user);
	}

	static async register(email, password, name) {
		const user = await UserAccountServices.getUserCredentialsByEmail(email);
		if (user) {
			throw (new HttpError(401, `Courriel non disponible`));
		}

		const hashedPassword = await hashPassword(password);

		const newUserId = await UserAccountQueries.insertUserAccount(email, hashedPassword, name);

		const newUser = {
			email: email,
			userId: newUserId,
			familyId: null
		}

		return generateToken(newUser);
	}
}

module.exports = AuthServices;
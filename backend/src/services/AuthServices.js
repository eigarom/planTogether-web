const UserAccountServices = require("./UserAccountServices");
const HttpError = require("../middlewares/error/HttpError");
const {isValidPassword, generateToken} = require("../utils/authUtils");

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
}

module.exports = AuthServices;
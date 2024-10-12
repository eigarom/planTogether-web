const jwt = require("jsonwebtoken");
const UserAccountQueries = require("../queries/UserAccountQueries");

class UserAccountServices {
	static async getUserByMail(email) {
		try {
			const result = await UserAccountQueries.getUserByEmail(email);
			return {
				email: result.email,
				name: result.name,
				color: result.color,
				imageContent: result.imageContent,
				imageContentType: result.imageContentType,
				lang: result.lang,
				theme: result.theme
			}
		} catch (error) {
			throw new Error("Invalid token");
		}
	}

	static async getUserByToken(token) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			const email = decoded.email;
			const result = await UserAccountQueries.getUserByEmail(email);
			return {
				email: result.email,
				name: result.name,
				color: result.color,
				imageContent: result.imageContent,
				imageContentType: result.imageContentType,
				lang: result.lang,
				theme: result.theme
			}
		} catch (error) {
			throw new Error("Invalid token");
		}
	}

	static async getUserCredentialsByEmail(email) {
		const result = await UserAccountQueries.getUserCredentialsByEmail(email);

		if (result) {
			return {
				email: result.email,
				password: result.password_hash
			};
		}
		return undefined;
	}
}

module.exports = UserAccountServices;
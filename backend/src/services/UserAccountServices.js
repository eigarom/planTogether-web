const UserAccountQueries = require("../queries/UserAccountQueries");

class UserAccountServices {
	static async getUserById(userId) {
		const result = await UserAccountQueries.getUserByID(userId);
		if (result) {
			return {
				email: result.email,
				name: result.name,
				color: result.color,
				imageContent: result.imageContent,
				imageContentType: result.imageContentType,
				lang: result.lang,
				theme: result.theme
			}
		}
		return undefined;
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

	static async getUserIdByEmail(email) {
		const result = await UserAccountQueries.getUserIdByEmail(email);
		if (result) {
			return result.id_member;
		}
		return undefined;
	}
}

module.exports = UserAccountServices;
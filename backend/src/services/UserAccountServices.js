const UserAccountQueries = require("../queries/UserAccountQueries");

class UserAccountServices {
	static async getUserByEmail(email) {
		const result = await UserAccountQueries.getUserByEmail(email);

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
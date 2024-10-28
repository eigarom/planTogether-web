const UserAccountQueries = require("../queries/UserAccountQueries");

class UserAccountServices {

	static async getUserById(userId) {
		const result = await UserAccountQueries.getUserByID(userId);
		if (result) {
			return {
				id: userId,
				email: result.email,
				name: result.name,
				color: result.color,
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
				password: result.password_hash,
				userId: result.id_member,
				familyId: result.id_family
			};
		}
		return undefined;
	}

	static async updateUser(user) {
		await UserAccountQueries.updateUser(user);
		return this.getUserById(user.id);
	}
}

module.exports = UserAccountServices;
const MemberQueries = require("../queries/MemberQueries");
const UserAccountQueries = require("../queries/UserAccountQueries");
const FamilyServices = require("../services/FamilyServices");

class UserAccountServices {

	static async deleteUser(userId, familyId) {
		await MemberQueries.deleteMember(userId);
		if (await this.getUserById(userId)) {
			throw new Error("Erreur lors de la suppression de l'utilisateur");
		}

		await FamilyServices.deleteFamilyIfNoAccountMembers(familyId);
	}

	static async getUserById(userId) {
		const result = await UserAccountQueries.getUserByID(userId);
		if (result) {
			return {
				id: userId,
				email: result.email,
				name: result.name,
				color: result.color
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

	static async updateUserFamilyId(userId, familyId) {
		await MemberQueries.updateMemberFamilyId(userId, familyId, null);
	}
}

module.exports = UserAccountServices;
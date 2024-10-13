const FamilyQueries = require("../queries/FamilyQueries");

class FamilyServices {
	static async getFamilyIdByUserId(userId) {
		const result = await FamilyQueries.getFamilyIdByUserId(userId);
		if (result) {
			return result.id_family;
		}
		return undefined;
	}

}

module.exports = FamilyServices;
const MemberQueries = require("../queries/MemberQueries");
const UserAccountQueries = require("../queries/UserAccountQueries");

class MemberServices {
	static async getMemberById(memberId) {
		const result = await MemberQueries.getMemberById(memberId);
		if (result) {
			return {
				name: result.name,
				color: result.color,
			}
		}
		return undefined;
	}

	static async getMemberImageContent(userId) {
		const result = await MemberQueries.getMemberImageContent(userId);

		if (result) {
			return {
				imageContent: result.image_content,
				imageContentType: result.image_content_type
			};
		}
		return undefined;
	}

	static async isMemberInFamily(memberId, familyId) {
		return await MemberQueries.isMemberInFamily(memberId, familyId);
	}

	static async updateMemberImage(memberId, imageBuffer, imageContentType) {
		const isUpdated = await MemberQueries.updateMemberImage(memberId, imageBuffer, imageContentType);
		if (!isUpdated) {
			throw new Error("Erreur lors de la mise-à-jour de l'image");
		}

		return await this.getMemberImageContent(memberId);
	}
}

module.exports = MemberServices;
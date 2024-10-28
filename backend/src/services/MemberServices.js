const MemberQueries = require("../queries/MemberQueries");

class MemberServices {
	static async createMember(member) {
		const newMemberId = await MemberQueries.insertMember(member);

		return this.getMemberById(newMemberId);
	}
	static async getMemberById(memberId) {
		const result = await MemberQueries.getMemberById(memberId);
		if (result) {
			return {
				name: result.name,
				color: result.color,
				memberId: memberId
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
const MemberQueries = require("../queries/MemberQueries");

class MemberServices {
	static async createMember(member) {
		const newMemberId = await MemberQueries.createMember(member);

		return this.getMemberById(newMemberId);
	}
	
	static async getMemberById(memberId) {
		const result = await MemberQueries.getMemberById(memberId);
		if (result) {
			return {
				id: memberId,
				name: result.name,
				color: result.color
			}
		}
		return undefined;
	}

	static async getAllMembersByFamilyId(familyId) {
		const accountMembers = await MemberQueries.getAccountMembersByFamilyId(familyId);

		const accountMembersInfos = accountMembers.map(accountMember => ({
			id: accountMember.id_member,
			name: accountMember.name,
			color: accountMember.color,
		
		}));

		const guestMembers = await MemberQueries.getGuestMembersByFamilyId(familyId);
		const guestMembersInfos = guestMembers.map(guestMember => ({
			id: guestMember.id_member,
			name: guestMember.name,
			color: guestMember.color,
		}));

		return {
			accountMembers: accountMembersInfos || [],
			guestMembers: guestMembersInfos || []
		};
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

	static async updateMemberInformations(member) {
		await MemberQueries.updateMemberInformations(member.id, member.name, member.color);
		return this.getMemberById(member.id);
	}

	static async updateMemberImage(memberId, imageBuffer, imageContentType) {
		const isUpdated = await MemberQueries.updateMemberImage(memberId, imageBuffer, imageContentType);
		if (!isUpdated) {
			throw new Error("Erreur lors de la mise-à-jour de l'image");
		}

		return await this.getMemberImageContent(memberId);
	}

	static async deleteMember(memberId) {
		await MemberQueries.deleteMember(memberId);
		if (await this.getMemberById(memberId)) {
			throw new Error("Erreur lors de la suppression de l'utilisateur");
		}
	}
}

module.exports = MemberServices;
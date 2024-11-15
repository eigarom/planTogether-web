const FamilyQueries = require("../queries/FamilyQueries");
const crypto = require('crypto');
const MemberQueries = require("../queries/MemberQueries");
const MemberServices = require("./MemberServices");

class FamilyServices {
	static async createFamily(family, userId) {
		const newFamilyId = await FamilyQueries.createFamily(family, userId);

		return this.getFamilyById(newFamilyId);
	}

	static async createInvitationCode(familyId) {
		let code;
		do {
			code = crypto.randomBytes(16).toString('hex');
		} while (await FamilyQueries.doesCodeExist(code));

		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + 7); // Durée de vie de 7 jours

		const isUpdated = await FamilyQueries.updateInvitationCode(familyId, code, expirationDate);
		if (!isUpdated) {
			throw new Error("Échec lors de la création du code d'invitation");
		}
		return code;
	}

	static async deleteFamilyIfNoAccountMembers(familyId) {
		const accountMembersCount = parseInt(await FamilyQueries.getFamilyAccountMembersCount(familyId));
		const guestMembers = await MemberQueries.getGuestMembersByFamilyId(familyId);

		if (accountMembersCount === 0) {
			if (guestMembers.length === 0) {
			await FamilyQueries.deleteFamily(familyId);
			} else {
				for (const guestMember of guestMembers) {
					await MemberQueries.deleteMember(guestMember.id_member);
				}
				await FamilyQueries.deleteFamily(familyId);
			}
		}
	}

	static async getFamilyById(familyId) {
		const result = await FamilyQueries.getFamilyById(familyId);
		if (result) {
			const family = {
				name: result.name,
				color: result.color
			};
			return family;
		}
		return undefined;
	}

	static async getFamilyIdByInviteCode(inviteCode) {
		const result = await FamilyQueries.getFamilyByInviteCode(inviteCode);
		if (result) {
			return result.id_family;
		}
		return undefined;
	}

	static async getFamilyImageContent(familyId) {
		const result = await FamilyQueries.getFamilyImageContent(familyId);

		if (result) {
			return {
				imageContent: result.image_content,
				imageContentType: result.image_content_type
			};
		}
		return undefined;
	}

	static async updateFamilyInformations(family) {
		await FamilyQueries.updateFamilyInformations(family);
		return this.getFamilyById(family.id);
	}

	static async updateFamilyImage(familyId, imageBuffer, imageContentType) {
		const result = await FamilyQueries.updateFamilyImage(familyId, imageBuffer, imageContentType);

		if (!result) {
			throw new Error("Erreur lors de la mise-à-jour de l'image");
		}

		return await this.getFamilyImageContent(familyId);
	}

	static async quitFamily(userId, familyId) {
		await MemberQueries.updateMemberFamilyId(userId, null, null);
		if (await MemberServices.isMemberInFamily(userId, familyId)) {
			throw new Error("Erreur lors de la suppression de la famille de l'utilisateur");
		}
		await FamilyServices.deleteFamilyIfNoAccountMembers(familyId);
	}

	static async deleteFamily(userId, familyId) {
		const accountMembers = await MemberQueries.getAccountMembersByFamilyId(familyId);
		const guestMembers = await MemberQueries.getGuestMembersByFamilyId(familyId);

		for (const accountMember of accountMembers) {
			await MemberQueries.updateMemberFamilyId(accountMember.id_member, null, null);
		}
		if (await MemberServices.isMemberInFamily(userId, familyId)) {
			throw new Error("Erreur lors de la suppression de la famille");
		}

		for (const guestMember of guestMembers) {
			await MemberQueries.deleteMember(guestMember.id_member);
		}
		await FamilyQueries.deleteFamily(familyId);

		if(await FamilyQueries.getFamilyById(familyId)) {
			throw new Error("Erreur lors de la suppression de la famille");
		}
	}
}

module.exports = FamilyServices;

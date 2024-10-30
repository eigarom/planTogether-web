const FamilyQueries = require("../queries/FamilyQueries");
const crypto = require('crypto');

class FamilyServices {
	static async createFamily(family, userId) {
		const newFamilyId = await FamilyQueries.createFamily(family, userId);

		return this.getFamilyById(newFamilyId);
	}

	static async createInvitationCode(familyId) {
		let code;
		do {
			code = crypto.randomBytes(16).toString('hex');
		} while (!(await FamilyQueries.isCodeUnique(code)));

		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + 7); // Durée de vie de 7 jours

		const isUpdated = await FamilyQueries.updateInvitationCode(familyId, code, expirationDate);
		if (!isUpdated) {
			throw new Error("Échec lors de la création du code d'invitation");
		}
		return code;
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

	static async updateFamilyImage(familyId, imageBuffer, imageContentType) {
		const result = await FamilyQueries.updateFamilyImage(familyId, imageBuffer, imageContentType);

		if (!result) {
			throw new Error("Erreur lors de la mise-à-jour de l'image");
		}

		return await this.getFamilyImageContent(familyId);
	}
}

module.exports = FamilyServices;

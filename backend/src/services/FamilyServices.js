const FamilyQueries = require("../queries/FamilyQueries");

class FamilyServices {
	static async createFamily(family, userId) {
		const newFamilyId = await FamilyQueries.createFamily(family, userId);

		return this.getFamilyById(newFamilyId);
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

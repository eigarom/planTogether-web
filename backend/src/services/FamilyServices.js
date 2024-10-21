const FamilyQueries = require("../queries/FamilyQueries");

class FamilyServices {
    static async createFamily(family,userId) {
        const newFamilyId = await FamilyQueries.createFamily(family,userId);

        const newFamily = this.getFamilyById(newFamilyId);
        return newFamily;
    }
    
    static async getFamilyById(familyId) {
        const result = await FamilyQueries.getFamilyById(familyId);
        if (result) {
            const family = {
                name: result.name,
                color: result.color,
                imageContent: result.image_content,
                imageContentType: result.image_content_type
            };
            return family;
        }
        return undefined;
    }
}

module.exports = FamilyServices;

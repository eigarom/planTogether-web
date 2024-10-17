const FamilyQueries = require("../queries/FamilyQueries");

class FamilyServices {
    static async insertFamily(family) {
        const newFamilyId = await FamilyQueries.insertFamily(family);

        const newFamily = getFamilyById(newFamilyId);
        return newFamily;
    }
    static async getFamilyById(familyId) {
        const result = await FamilyQueries.getFamilyById(family);
        if (result) {
            const family = {
                name: row.name,
                color: row.color,
                imageContent: row.image_content,
                imageContentType: row.image_content_type,
            };
            return family;
        }
        return undefined;
    }
}

module.exports = FamilyServices;

const FamilyQueries = require("../queries/FamilyQueries");

class FamilyServices {
    static async insertFamily(family) {
        const result = await FamilyQueries.insertFamily(family);

        if (result) {
            return {
                name: result.name,
                color: result.color,
                imageContent: result.imageContent,
                imageContentType: result.imageContentType,
                inviteCode: result.inviteCode,
                inviteExpirationDate: result.inviteExpirationDate,
            };
        }
        return undefined;
    }
}

module.exports = FamilyServices;

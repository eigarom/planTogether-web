const FamilyQueries = require("../queries/FamilyQueries");

class FamilyServices {
    static async insertFamily(family) {
        const newFamilyId = await FamilyQueries.insertFamily(family);

      const newFamily = getfamilybyId(newFamilyId);
      return newFamily;
        }
    }


module.exports = FamilyServices;

//const pool = require("./dbPool");

class MemberQueries {
    static async updateMemberFamilyId(memberId, familyId, client) {
        await client.query(
            `UPDATE member
			SET id_family = $2
            WHERE id_member = $1`,
            [memberId, familyId]
        );
    }
}

module.exports = MemberQueries;

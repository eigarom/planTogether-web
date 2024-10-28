const pool = require("./dbPool");

class MemberQueries {
	static async getMemberById(memberId) {
		const result = await pool.query(
			`SELECT name, color
             FROM member
             WHERE id_member = $1`,
			[memberId]
		);
		return result.rows[0];
	}

	static async getMemberImageContent(memberId) {
		const result = await pool.query(
			`SELECT image_content, image_content_type
             FROM member
             WHERE id_member = $1`,
			[memberId]
		);
		return result.rows[0];
	}

	static async isMemberInFamily(memberId, familyId) {
		const result = await pool.query(
			`SELECT *
             FROM member
             WHERE id_member = $1
               AND id_family = $2`,
			[memberId, familyId]
		);
		return result.rowCount > 0;
	}

	static async updateMemberFamilyId(memberId, familyId, client) {
		await (pool || client).query(
			`UPDATE member
             SET id_family = $2
             WHERE id_member = $1`,
			[memberId, familyId]
		);
	}
}

module.exports = MemberQueries;

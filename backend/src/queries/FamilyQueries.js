const pool = require('../queries/dbPool');

class FamilyQueries {
	static async getFamilyIdByUserId(userId) {
		const result = await pool.query(
			`SELECT id_family
             FROM member
             WHERE id_member = $1`,
			[userId]
		);
		return result.rows[0];
	}
}

module.exports = FamilyQueries;
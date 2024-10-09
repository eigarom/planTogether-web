const pool = require('../queries/dbPool');

class UserAccountQueries {
	static async getUserByEmail(email) {
		const result = await pool.query(
			`SELECT email, password_hash
             FROM account_member
             WHERE email = $1`,
			[email]
		);
		return result.rows[0];
	}
}

module.exports = UserAccountQueries;
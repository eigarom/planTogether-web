const pool = require('../queries/dbPool');

class UserAccountQueries {
	static async getUserByEmail(email) {
		const result = await pool.query(
			`SELECT email, name, color, image_content, image_content_type, lang, theme
             FROM account_member
                      INNER JOIN member ON member.id_member = account_member.id_member
             WHERE email = $1`,
			[email]
		);
		return result.rows[0];
	}

	static async getUserCredentialsByEmail(email) {
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
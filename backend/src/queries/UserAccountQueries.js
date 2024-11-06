const pool = require("../queries/dbPool");
const MemberQueries = require("../queries/MemberQueries");

class UserAccountQueries {
	static async getUserByID(userId) {
		const result = await pool.query(
			`SELECT email, name, color
             FROM account_member
                      INNER JOIN member ON member.id_member = account_member.id_member
             WHERE account_member.id_member = $1`,
			[userId]
		);
		return result.rows[0];
	}

	static async getUserCredentialsByEmail(email) {
		const result = await pool.query(
			`SELECT email, password_hash, account_member.id_member, id_family
             FROM account_member
                      INNER JOIN member ON account_member.id_member = member.id_member
             WHERE email = $1`,
			[email]
		);
		return result.rows[0];
	}

	static async insertUser(email, hashedPassword, name) {
		const client = await pool.connect();

		try {
			await client.query('BEGIN');

			const result = await client.query(
				`INSERT INTO member (name)
                 VALUES ($1)
                 RETURNING id_member`,
				[name]
			);
			const memberId = result.rows[0].id_member;


			await client.query(
				`INSERT INTO account_member (email, password_hash, id_member)
                 VALUES ($1, $2, $3)`,
				[email, hashedPassword, memberId]
			);

			await client.query('COMMIT');
			return memberId;
		} catch (err) {
			await client.query('ROLLBACK');
			throw err;
		} finally {
			client.release();
		}
	}

	static async updateUser(user) {
		const client = await pool.connect();

		try {
			await client.query('BEGIN');

			await MemberQueries.updateMemberInformations(user.id, user.name, user.color, client);

			await client.query(
				`UPDATE account_member
                 SET email = $2
                 WHERE id_member = $1`,
				[user.id, user.email]
			);

			await client.query('COMMIT');
		} catch (err) {
			await client.query('ROLLBACK');
			throw err;
		} finally {
			client.release();
		}
	}
}

module.exports = UserAccountQueries;

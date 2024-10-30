const pool = require("../queries/dbPool");
const MemberQueries = require("./MemberQueries");

class FamilyQueries {
	static async createFamily(family, userId) {
		const client = await pool.connect();

		try {
			await client.query("BEGIN");
			const familyId = await this.insertFamily(family, client);
			await MemberQueries.updateMemberFamilyId(
				userId,
				familyId,
				client
			);
			await client.query("COMMIT");
			return familyId;
		} catch (err) {
			await client.query("ROLLBACK");
			throw err;
		} finally {
			client.release();
		}
	}

	static async doesCodeExist(code) {
		const result = await pool.query(
			`SELECT COUNT(*)
             FROM family
             WHERE invite_code = $1`,
			[code]
		);
		return result.rows[0].count > 0;
	}

	static async getFamilyById(familyId) {
		const result = await pool.query(
			`SELECT name, color
             FROM family
             WHERE id_family = $1`,
			[familyId]
		);
		return result.rows[0];
	}

	static async getFamilyByInviteCode(code) {
		const result = await pool.query(
			`SELECT *
             FROM family
             WHERE invite_code = $1
               AND invite_expiration_date > NOW()`,
			[code]
		);
		return result.rows[0];
	}

	static async getFamilyImageContent(familyId) {
		const result = await pool.query(
			`SELECT image_content, image_content_type
             FROM family
             WHERE id_family = $1`,
			[familyId]
		);
		return result.rows[0];
	}

	static async insertFamily(family, client) {
		const result = await (pool || client).query(
			`INSERT INTO family(name, color)
             VALUES ($1, $2)
             RETURNING id_family`,
			[family.name, family.color]
		);
		return result.rows[0].id_family;
	}

	static async updateFamilyImage(familyId, imageBuffer, imageContentType) {
		const result = await pool.query(
			`UPDATE family
             SET image_content      = $2,
                 image_content_type = $3
             WHERE id_family = $1`,
			[familyId, imageBuffer, imageContentType]
		);
		return result.rowCount > 0;
	};

	static async updateInvitationCode(familyId, code, expirationDate) {
		const result = await pool.query(
			`UPDATE family
             SET invite_code            = $1,
                 invite_expiration_date = $2
             WHERE id_family = $3`,
			[code, expirationDate, familyId]
		);
		return result.rowCount > 0;
	}
}

module.exports = FamilyQueries;

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

	static async getFamilyById(familyId) {
		const result = await pool.query(
			`SELECT name, color
             FROM family
             WHERE id_family = $1`,
			[familyId]
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
		const result = await client.query(
			`INSERT INTO family(name, color)
             VALUES ($1, $2)
             RETURNING id_family`,
			[family.name, family.color]
		);
		return result.rows[0].id_family;
	}

    static async updateFamilyImage(familyId, imageBuffer, imageContentType) {
        const result = await pool.query(
            `UPDATE family SET image_content = $2, image_content_type = $3
            WHERE id_family = $1`,
            [familyId, imageBuffer, imageContentType]
        );
        return result.rowCount > 0;
    };
}

module.exports = FamilyQueries;

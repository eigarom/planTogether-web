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

    static async insertFamily(family,client) {
        const result = await pool.query(
            `INSERT INTO family(
            name, 
            color, 
            image_content, 
            image_content_type
            )
            VALUES ($1, $2, $3, $4)
            RETURNING id_family`,
            [
                family.name,
                family.color,
                family.imageContent,
                family.imageContentType,
            ]
        );
        return result.rows[0].id_family;
    }

    static async getFamilyById(familyId) {
        const result = await pool.query(
            `SELECT name, color, image_content, image_content_type
            FROM family
            WHERE id_family = $1`,
            [familyId]
        );
         return result.rows[0];
    }
}

module.exports = FamilyQueries;

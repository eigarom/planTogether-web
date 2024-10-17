const pool = require("../queries/dbPool");

class FamilyQueries {
    static async insertFamily(family) {
        const result = await pool.query(
            `INSERT INTO family(
            name, 
            color, 
            image_content, 
            image_content_type, 
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
            `SELECT id_family, name, color, image_content, image_content_type
            FROM family
            WHERE id_family = $1`
            [familyId]
        );
        const row = result.rows[0];
    }
}

module.exports = FamilyQueries;

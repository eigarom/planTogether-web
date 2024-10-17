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
                family.imageContentType
            ]
        );
        return result.rows[0].id_family;
        // à faire getFamilyById(familyId)
        // const familyKey = result.rows[0].id_family
         //return getFamilyById(familyName);
    }

    
}

module.exports = FamilyQueries;

const pool = require("../queries/dbPool");
const MemberQueries = require("./MemberQueries");

class FamilyQueries {
    static async createFamily(family, userId) {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");
            const familyId = await this.insertFamily(family, client);
            await MemberQueries.updateMemberFamilyId(userId, familyId, client);
            await client.query("COMMIT");
            return familyId;
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    }

    static async deleteFamilyAndGuestMembers(familyId) {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");
            await this.deleteGuestMembersFromFamily(familyId, client);
            await MemberQueries.deleteMembersFamilyId(familyId,client);
            await this.deleteFamily(familyId, client);
            await client.query("COMMIT");
            return familyId;
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    }

    static async deleteFamily(familyId, client) {
        const result = await (pool || client).query(
            `DELETE
             FROM family
             WHERE id_family = $1`,
            [familyId]
        );
        return result.rowCount > 0;
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

    static async getFamilyAccountMembersCount(familyId) {
        const result = await pool.query(
            `SELECT COUNT(*)
             FROM account_member
                      INNER JOIN member ON account_member.id_member = member.id_member
             WHERE id_family = $1`,
            [familyId]
        );
        return result.rows[0].count;
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

    static async updateFamilyInformations(family) {
        const result = await pool.query(
            `UPDATE family
			 SET name = $2,
				 color = $3
			 WHERE id_family = $1`,
            [family.id, family.name, family.color]
        );
        return result.rowCount > 0;
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
    }

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

    static async deleteGuestMembersFromFamily(familyId, client) {
        const result = await (pool || client).query(
            `DELETE
			FROM member
			WHERE id_member IN (
            	SELECT guest_member.id_member
             	FROM guest_member
             	INNER JOIN member ON guest_member.id_member = member.id_member
             	WHERE member.id_family = $1
			)`,
            [familyId]
        );
        return result.rowCount > 0;
    }
}

module.exports = FamilyQueries;

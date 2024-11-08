const pool = require('../queries/dbPool');

class EventQueries {
	static async getEventsByFamilyId(familyId) {
		const result = await pool.query(
			`SELECT *
             FROM event
             WHERE id_family = $1`,
			[familyId]
		);
		return result.rows;
	}

    static async getPeriodsByEventId(eventId) {
        const result = await pool.query(
            `SELECT *
            FROM period
            WHERE id_event = $1`,
            [eventId]
        );
        return result.rows;
    }

    static async getAlertsByEventId(eventId) {
        const result = await pool.query(
            `SELECT *
            FROM alert
            WHERE id_event = $1`,
            [eventId]
        );
        return result.rows;
    }

    static async getMembersByEventId(eventId) {
        const result = await pool.query(
            `SELECT m.id_member, name, color
            FROM participation p
            INNER JOIN member m ON m.id_member = p.id_member
            WHERE id_event = $1`,
            [eventId]
        );
        return result.rows;
    }

    static async getEventById(eventId) {
		const result = await pool.query(
			`SELECT *
             FROM event
             WHERE id_event = $1`,
			[eventId]
		);
		return result.rows[0];
	}

    static async isEventInFamily(eventId, familyId) {
		const result = await pool.query(
			`SELECT *
             FROM event
             WHERE id_event = $1
               AND id_family = $2`,
			[eventId, familyId]
		);
		return result.rowCount > 0;
	}
}

module.exports = EventQueries;